---
title: "The migration factory"
pubDate: 2026-11-01
description: "I got tired of data migrations that drag on for a year. So I built a small factory where AI agents do the work, other agents check it, and a human only shows up to decide."
tags: ["data_eng","chatgpt","shopify"]
draft: false
---

I got tired of data migrations that drag on for a year. So I built a small factory where AI agents do the work, other agents check it, and a human only shows up to decide.

![the migration factory](../../assets/images/posts/20261110/hero.jpg)

For the last two months I have been working on exactly that, with AI agents doing the migrations and other agents checking them. This post is about what I ended up building, how it works, and what broke along the way.

## The problem

Every data platform I have worked on carries a backlog of migrations. Move these tables to the new storage format. Rename those metrics. Repoint the last readers of a deprecated view. None of it is hard. All of it is tedious, and every single one has the same shape: find everything that depends on the thing, change it, prove nothing moved for the people reading it, get the owner to merge, and then clean up.

What usually happens is that a platform team writes a very good document, opens a tracking issue, and sends a thousand-row to-do list to a hundred data engineers. Then it waits. A year later, 60% is done and the rest is "in progress".

The part that made me think a factory was possible is this: the work is repetitive, but the **decision** is not. Nobody wants to spend a day repointing a model and diffing two tables. Everybody wants to be the one who says "yes, this is right, merge it". So the goal was never to remove humans. It was to move them to the one place where they add something: the decision.

## What it is

The migration factory is a small program, a few thousand lines of Python and a SQLite file. You give it a **brief**: what moves where, why, and the rules of the house (what counts as a difference, who owns what, what a PR must say). It plans the work into **specs**, one per future pull request. Then it runs agents.

Not one agent. Several, with different jobs, and that is the whole point:

- A **worker** takes one spec, gets its own branch and its own checkout of the real repo, and does the work with the real tools: dbt, the actual staging environment, real queries against the warehouse. It ends by writing the PR description and a pile of evidence.
- Five **gates** then read that work. Each one is a separate agent with a narrow question, and none of them sees the others' opinions:
  - **Code**: does the diff do what the description says?
  - **Reconciliation**: re-derive the numbers yourself and compare.
  - **Runtime**: did this actually run on staging? Show me.
  - **Leaf coverage**: go find every dashboard, metric and export that reads this table, and compare your list with the worker's.
  - **Decision readiness**: could the owner decide from the first screen of this PR alone?
- Only when **all five approve the same revision** does the factory open a pull request. Before that, nothing leaves the machine.

![how a spec moves through the factory](../../assets/images/posts/20261110/pipeline.png)

If a gate says no, the spec goes back to the worker with the gate's words, and a new revision goes through the gates again. Gates whose inputs did not change carry their verdict over, so a wording fix does not re-run a staging deploy.

Here is one spec's life, sped up:

![one spec's life through the gates](../../assets/images/posts/20261110/gates.gif)

## Wait, why five gates?

Because one agent reviewing its own work is worth nothing, and I learned that the expensive way.

The first version had the worker produce the evidence and a single reviewer agent read it. The reviews were glowing. Then I started opening the PRs myself and found claims like "byte-identical" above a comparison that was not. The reviewer had read the worker's summary of the comparison, not the comparison.

So the gates are **blind**. The reconciliation gate does not get the worker's numbers. It gets the spec and the branch, and it runs the old and the new query itself. The leaf-coverage gate does not get the worker's list of downstream consumers; it hunts for them on its own and then diffs the two lists. A missed leaf or a phantom leaf is a fail. It costs more. It also catches things, which the cheap version did not.

The same idea applies to the PR itself. There is a **cold reader**: a tiny, cheap agent that gets only the PR title and the first screen of the description, with no context at all, and has to say what changes, why, and what it is being asked to do. If it cannot, the PR does not ship. More on that below.

## Prove it where someone reads it

The thing I insisted on, and the thing that took the longest to get right, is **where** the proof happens.

A table diff tells you what changed. It does not tell you whether it matters. Aggregation does not preserve small differences linearly: a row-level diff can be noisy while the metric on the dashboard is identical, or perfectly clean while the metric moves. So the factory does not stop at the table it touched. It walks down to the **leaves**: the metric in the catalog, the tile on the certified dashboard, the export that leaves the warehouse. It recomputes those both ways and reports in the reader's units. "2 of 7 tiles move by 0.4% on 3 days, here is why, here is who notices."

This is the same thing I wrote about in [PR reviews for SQL code](/PR-reviews-for-SQL-code) five years ago: review the result before the code. AI did not change what makes a good review. It made it easy to produce code that needs one.

## The PR nobody could read

The first PRs were enormous. 4,000 to 6,000 words, every comparison inline, no folds. Complete, and useless. I asked for a small mandatory read with everything else folded one click away, and the descriptions came down to about 1,300 words.

Still not good enough. A colleague who had no context opened one and told me the beginning "reads like it's answering in the middle of something. Why what? Internally yes to what?" He was right. The description opened with labels that answered questions nobody had seen: **Why**, **Internally, yes:**, **Externally, no:**. Every gate had read that opening with the spec and the brief in context and filled in the gaps without noticing. Only a stranger saw it.

![the first screen, before and after](../../assets/images/posts/20261110/firstscreen.png)

That is where the cold reader came from. The rule now is one sentence a stranger can read, then the verdict, then what changes for readers, then the ask. Everything else folds. First screens went from about 1,300 words to about 400, and the cold reader runs on every revision.

It also failed in an instructive way. The first version failed the PR on any phrase the reader could not interpret. Most of those phrases were the factory's own labels ("Parity", "Register metric"), which no worker could change, so the PR looped until it ran out of rounds. The fix was to fail only on a real misunderstanding (the reader cannot say what changes, why, or what it is asked to do) and to turn the factory's own labels into sentences. Reviewers never complained about "Parity". The stranger did, and the stranger was right.

## Decide, don't ask

The second thing I had to beat out of the agents was the question habit. An early PR had seven items of the form "Owner's call on X?" and "Do you accept Y?". A reviewer who gets seven questions does not review. They schedule a meeting.

So the rule is: make the call a careful engineer would make, write it down under "Decisions I made" with the alternative you rejected and how to overturn it, and move on. The only things that may become a question for a human are a published number with no policy in the brief, a change outside the repo, or production access. And even those are phrased as a decision with an opt-out: "I set X. Reply 'use Y' to change it." A PR proceeds with those. It only holds on something that would break a reader or lose data.

The other half of that rule: the next steps go to the **asset owner**, not back to the migration team. If the agent cannot do a step from where it sits (a browser-only tool, a deploy-time action), it writes the owner a runbook line, with the command, instead of "migration owner, please handle". Nothing kills a migration faster than a PR that sends work back to the people who opened it.

## After the merge

Merging is not the end. The old table still exists, readers have not moved, the first production run has not happened. The factory tracks that as a chain of small specs after each merge: wait for the first production run and check it, verify the readers moved, drop the old table on the date the brief says. Each step has a verifier, and the PR lists them so the owner knows what will happen next without being asked to do it.

## The part I underestimated: staying on the PR

Opening a good PR turned out to be the easy half. Keeping it alive was the hard one.

A PR sits for days. CI goes red because the branch fell behind main. The code-review bot posts findings. A reviewer asks a question in the conversation tab. In the first version, the factory noticed some of this and ignored the rest, and a user who tried it opened a PR, watched CI fail on a stale branch, and asked, reasonably, whether the thing was supposed to fix that.

So now there is a loop. Every open PR is read at most every five minutes: CI, the bot, reviews, comments, mergeability. CI red on a stale branch means merge main and re-run, no agent involved. A real failure gets a worker with the log excerpt, three attempts per commit, then it asks. Every human comment gets an answer, posted in the thread after a check that it mentions nobody. Every branch gets main merged in every twelve hours. And there is one status comment per PR, edited in place, that says in plain words what the factory is doing and why: "CI red on lint: a worker is fixing it (round 1 of 3)". That comment is the sign of life people were missing.

The factory never merges, never requests reviewers, never resolves a human's thread. Those are the humans' moves.

## What it cost, and what it caught

Numbers from the first real migration, rounded: about 35 metrics to rename and rebuild, each a PR. A PR cost the factory on the order of $50 to $150 in agent time plus a few dollars of warehouse queries, with the expensive ones being the ones that went through many revisions. The gates sent back roughly one revision in three. Most of those were real: a number claimed identical that was not, a downstream reader the worker had not found, a description that said "no change for readers" above a chart that moved.

The reviews from the actual code owners were short. That was the goal.

## Where this goes

The factory is migration-agnostic by design. Nothing about a specific migration lives in it; that comes from the brief and from the repo's own documentation. The second migration (moving the last readers of a deprecated set of views onto a new storage layer, across three repositories) ran on the same code with a different brief, and a third team is now trying it on their own backlog.

I don't think the interesting part is the agents. Agents writing SQL is table stakes now. The interesting part is the shape around them: blind checks, proof at the leaf, a PR a stranger can read, decisions instead of questions, and a loop that stays on the PR until a human says yes. That shape is what makes it possible to hand a thousand-row to-do list to a machine and get back pull requests that people merge.

If you are running a platform team with a migration backlog, that is the thing I would copy first. Not the agents. The gates.

Special thanks to the colleagues who reviewed the first PRs and told me, politely, that they could not read them.
