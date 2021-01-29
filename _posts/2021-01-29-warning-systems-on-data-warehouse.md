---
layout: post
title: 'Warning systems on data warehouse'
tags: [data_eng]
featured_image_thumbnail: assets/images/posts/warning.jpeg
featured_image: assets/images/posts/warning.jpeg
featured: true
hidden: true
---


The story of how and why I built Whistleblower, a system that allows us to set warnings on any table in our environment.

<!--more-->

----

For the past couple of years, myself and a bunch of others at Shopify were looking for a smart way to set warnings on specific tables. Why warnings? The reason is quite simple, we spend a lot of time building quality front room datasets, as I explain in this [previous blog](how-to-thrive-in-the-face-of-disruption-tips-from-shopify-data-team). That being said, those datasets, for many reasons, can start to degrade over time. Let me walk you through the problem, what we tried before and how we solved it. 

## The problem

Yes at Shopify we care a lot about data set quality, we do peer review of all of them, we document them as much as possible. When we release a dataset, they are perfect. That being said we work in an environment that changes all the time. Then, at some point, the dataset quality will drop. Here are a couple of examples:

- **Some data is not available anymore**: Looks easy when you look at it on its own but when it is part of a larger dataset, hidden under 6 JOINs it is not that trivial to identify and fix. 
- **Change in raw data**: The assumptions you had when you built your dataset may change. It is possible that data points start returning a new type of value, or outside a pre-established range (from 0 to 1, as an example), maybe something that could not be null before, can be null now. 
- **Change in business rules**: Some of our dataset does model or replicate business logic, commercial contracts, SLAs, etc. When those contracts change, we need to modify the dataset to include the new reality. 

When those 3 things happen, there are two major steps. First we need to realize and identify the change, second we have to fix or deprecate the dataset. As the first one deserves a lot of attention, and Shopify as great tools to find, I don’t want to talk about it too much. I really want to focus on the second one here, because as simple as it sounds, it is another story in real life. 

Every single time we had this situation hit the team we had to ask ourselves, “OK we need to fix XYZ, but we don’t have time. Option A) we delete the dataset, Option B) we fix it”. After a rapid brainstorm session, we can’t go with A because it powers some other asset and we can’t go with B because we don't have time to do it. So we end up leaving the dataset as is, even if we know that it is broken. We cannot prioritize other works and the impact of the error is not huge (for now). 

Conclusion: Let’s warn user of the dataset so they are aware of the mistake and we add the issue in the backlog

## The real problem
The real problem is that one day, someone will query your dataset. This person will not be aware of the issue and will draw the wrong conclusions. When they contact you because they ,and half their boss, are freaking out with the result, you tell them the worst possible answer, ooo yes sorry, we knew it is a bug. 

## What we tried up to now
As we said, we faced those issue couples of times, here are a couple of things we tried already:

- **Broadcast the bug**: Send a nasty `@here` on Slack or a widespread email to let everyone know your dataset has a bug. That is great if someone was about to use it. Because other than that, there are very little chances someone will remember in 6 weeks from now and you just annoyed a ton of people with your broadcast.
- **Documentation**: Like most other places, we have our own documentation repository. You can go there and add a note on this particular dataset, but unless someone goes to read it, nobody will see. Also, all existing dashboards or data scientists that frequently use your dataset won’t go read the doc every time they run a query/report.
- **Figure out who uses it**: This is essential to understand how bad the bug is. It will help you understand how much priority you need to give the repair, but first, in the meantime, it does not fix anything, second even if there are not many dependencies, it does not mean anybody will use it in the future. 

## Solution

So I was looking for a way to solve this problem, especially after a nasty situation like explained above where some people really stressed over the result of a totally valid query. We needed a way to warn the users that this dataset had a specific problem. 

After some digging I realized that some smart data engineers had set the [Presto](https://prestodb.io/) [event listener](https://prestodb.io/docs/current/develop/event-listener.html) to be sent on a specific kafka topic. In other words, every query on our Presto cluster was generating a Kafka event. 

Note: Presto is the default engine to query our datasets at Shopify. 

“I realized I could build a software that would monitor this Kafka Topic, do some REGEX to identify if the query was about the table would be a bug I could send a Slack message to the user.“

Why Slack, Slack is the main communication tool at Shopify, people monitor this way more than their email box. So a Slack message would be the best way to warn them. I had a plan


## Implementation
At Shopify we have something called Hackday. 3 days in a row where we stop “normal” work and we work on special projects. Everybody chose its own project. I decided to give it a try. It has been a couple of years since I did professional software development, but I was sure I could hack something up. 

My application was basically those 4 steps:

1. Listen the Kafka topic
1. Do some Smart Regex to figure out if it was my table
1. Find the Slack handle and send a Slack message to the user. 
1. Have all of this run somewhere. 

So 1 was solved by this Presto-Kafka topic, I could simply listen to it. 2 could be solved with a basic webpage where data scientists could add warnings on specific tables and use Regex. For #3 and #4 I was really impressed by the dev culture and environment at Shopify. There was already a web service available to turn a user’s email (which I was getting from the Kafka message) to a Slack handle. I could also easily connect to Slack via their API. For the latest part, it was easier than I could even think of. Basically if I could find a way to do this in Ruby on Rails, I could deploy my application with basically 1 click. 

## Result
To this day, I am still impressed by the result. If you query any dataset with a warning within 3 seconds of the query being completed, you receive a Slack message like this one.
![whistleblower](assets/images/posts/whistleblower.png#center)

Data scientists can now easily add a warning message on any table:

![new rule](assets/images/posts/new_rule.png#center)

### Features
I kept developing features on the tool. I added:
- Snooze option: So your users don’t get worn every time they query the table.
- Specific column filtering: If all your dataset is ok, except 1 column, you can only warn users that use this column. 
- Regex in the table name, maybe there is more than one table affected. You can set a regex-style table name. 


## Stats
After roughly 3 months, Whistleblower has 
- Sent over 1300 warnings sent to 148 unique users. 
- Scanned roughly 43 000 Presto Query/day. 
- 300 warnings sent **Afterhour**. 

I am super happy about those, especially the 300 warnings afterhour. That means 300 times, someone received a warning with indication when most likely he could not get support because other team members were not there to help. 

That tool is great, I can now sleep better at night knowing if ever someone queries those tables they will get warned and not take any bad decisions with the result. 



Sidenote: It is really impressive how many people contact you when you call an internal project Whistleblower :P 
