---
layout: post
title: 'Data org during a crisis'
tags: [data]
featured_image_thumbnail: assets/images/posts/corona-400x200.jpg
featured_image: assets/images/posts/corona.jpg
featured: true
hidden: true
---


Is your data org really in good shape to face a serious threat to your business.

<!--more-->

As you are all fully aware, we are currently facing a global pandemic. We are living through a really unprecedented time. Most of us are currently in lockdown, except for the true heros, the medical staff. Most of us, did not see this coming. Never last year, we have planed for this in our investment planning sessions. But it happened, we are in it currently, and to be honest I am really impressed by how as a Data org, at Shopify, we are reacting.

Keep in mind, in no ways, I consider our work above people that are currently saving lives. I simply want to look at why I think our Data org is doing a fantastic job right now.

### Let's roll back a bit

Anyone that worked for long enough in most industries, most companies, most jobs, knows that a significant portion of our work is planned in advance. We (or someone above us) know that in the next few months we should work on X,Y,Z. That allows planning, coordination between teams, make sure any pre-requisite work gets done beforehand, etc. But even in these circumstances, we find reason to not deliver, whether it is on time or features. As data folks, we frequently hit delays because data is not yet available or we are not sure how exactly 1 every 100423 rows we see a _NULL_ in that column.

Then something like COVID happens, and that is a massive game changer, for everyone. Employees, Customers (Merchant in our cases), customer of customers (buyers), manufacturers, carriers, payment providers, etc., etc., etc. Litteratly everyone got shook at some extend.

At this point, leadership, looked at us and asked.

>How we can best help our Merchants

That question is so wide, we are dealing with 1 Million + merchants in almost every country on the globe. But regardless the complexity, within few days, the entire data org launched a taskforce to address that exact question.

It has been almost 1 month, since that day, very high quality insights are being presented daily to the company. I am still super proud and impress by how we reacted.

I wanted to understand, how can we have been so successful with so little preparation to build this?

## Autopsy of a success

So, how could we turn around so quickly? When usually we needed weeks to produce such insights. How could we do it in days?

Here is why we were able to achieve it.

### 1 - Modelled Data

One of the first things we have to do when we onboard (at least when I joined). It is to get our copy of [The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modelling](https://www.oreilly.com/library/view/the-data-warehouse/9781118530801/) By Ralph Kimball. If you work in data, you should be aware of this. Sadly that is not about a fancy deep neural net (sarcasm), but about how you should model your data. How can you take your raw data and put it in a format that is query-able by anyone? This book does not focus about technologies and infra but data schemas. How should your table join together? Where should each column be?

I am not trying to say that this is the only good way to structure your data. For what it's worth, it could be the 10th best strategy it would not matter. The only things that count is that we all agreed, as a data org to use this philosophy of modelling to build Shopify's data warehouse. Because of this agreed rule. I can easily, very easily surf through data produce by another team.

I understand when to switch between dimension and fact tables. I know that I can safely join on dimensions because, they handle unresolved rows with a standard status, in other words, I don't have sneaky NULL that would silently destroy rows after my `JOIN`s. I can trust that all the filtering that needs to be done, was done for me.

Key benefits:

 1. No need to know and understand raw data from another team.
 1. I understand quickly the output format of other teams.
 1. Data is compatible between teams

### 2 - Rigorous, consistent and centralized ETL

At this point, you should already understand. If I can work with data from other teams, it needs to be available. YES. That is key #2. You need access to all the data. ALL of it. When time counts, you do not have time to ask for access.

One of the key success is the ability to be able to find every data sets. On Shopify side, couple of things are in place in order to find and understand data sets:

 1. All the data is available on a Presto Cluster (to all the company, not only Data scientists), except obviously PII information.
 1. We have 1 modelling framework, build on top of Spark and it is on a GitHub repo that everyone can access.
 1. We have some internal tools to find those.
 1. Data Modelling is unit tested

So the company has spent years building the most robust data pipeline I ever saw. Everyone uses it. So we don't have the hippie guy in the accounting department that uses that weird stack that you can only get working when 3 planets are aligned. No, all of it is super standardized. Once again, it might not be the best in the world and it may not have the fanciest features. But because everyone is using it. Everyone understands the code of everyone, I know how to browse, Ian's code. I can find where Ben has put is the latest model. Etc.
I can simply pick a table name, and I can see 100% of the code that built that model. That makes things... scalable.

One of the benefits of this pipeline, it does not let job fail in silence. What can be pretty painful on a Friday 4 pm when it sends you a slack message because a dataset you made 4 years ago just failed, also what makes sure at any time, you can trust that data you play with is fresh and accurate.

As a company with a software heavy bias, we are developing skills influenced by our developer friends. So, all (not some... ALL) of our data jobs are units tested. We test all the use cases we can think of. Error, edge cases, etc. This slow down development a lot, but find so many errors. It is easy to lose the count on JOIN that once in a while double the number of rows because of a specific scenario. You can now test your data models.

Key benefits:

 1. Trust in data
 1. Data discoverability

### 3 - Data quality

As explained earlier, we have a framework to make sure our data is `up to date`. But anyone with a bit of experience knows that nothing is perfect. Failure does occur. But when it does we handle it with accountability and ownership. We run and document RCAs (Root Cause Analysis). Where we try to understand what we did wrong, how could we have mitigate or prevent this? What could we put in place to catch those situations before it catches on fire? These sessions are blame free... actually they are human blame free. The goal is to find the series of evenement that led to the situation, not blame the hippie guy in accounting.

We also communicate data disruptions. When something is broken, we let others know. When we can we try to propose a workaround, sometimes we can't but at least we try as much as possible?

Key benefits:

 1. Data reliability

### 4 - Vetted Dashboard

A bit like for the data pipeline, we have 1 main visualization engine. All the official reports are centralized on an internal website. So before jumping in the code like a university student 3 hours before a huge deadline. We can go a see what they have already published. In most cases, a significant portion of the metrics you can think of are already available for anyone in the company.

If ever, it is almost what you want but not exactly. It is centralized, so I have access to the base code for the dashboard. So you can start from there and go where you need.

Key benefits:

 1. Discovery speed
 1. Reuse of work (No need to calculate something, they already did it)

### 5 - Vetted data points

All data points that need to be published externally or that are significant (we are taking a big decision on them). Are what we call vetted data points. So they are stored somewhere. With the context we need to understand them. Usually, the original questions, the answer, the SQL code to generate the result. One of the fundamentals in those, result should not change over time. So if I ask you, how many merchants were on the platform in Q1 2019, the answer will be the same today or in 4 years from now. That may sound trivial but it is harder than it looks.

Key benefits:

 1. Ability to reproduce

### 6 - Everything is peer reviewed

ALL of our work is peer reviewed, by 2 other data scientist. Even my boss and my boss's boss go through this. Dashboards, vetted data points, Data Models, Unit Test, data extraction, PII tagging, etc. This is once again, a gain benefit of working closely with developers. But can you even imagine the level of trust if you know that at least 3 persons looked at the query? When we do work that touches more than 1 team, we involve reviewer from both teams. When we touch raw data, we add developers as reviewers. All this really improve the overall quality of the data.

Key benefits:

 1. Data quality
 1. Trust in data

### 7 - Deep understanding of the Product

Now, my favourite part. In order to do our job, during the COVID crisis or to do one of last summer. We must have a very deep understanding of the product. We must fall in love with the problem. There is no way we can be any good if we only look at the data. Our ability to understand why X was created and not Y, that in the US, this product act differently than in Canada is key

All this knowledge makes us able to slice and dice quickly on the right angles. Having this knowledge during a crisis like we are living now, allow us to focus on key areas. To look at metrics that we think could be vital for our merchants.

The data have frequently found problems in the product, before it gets to the customer because of our perfect spot between data and product. We have, the best point of view possible here. We just have to make sure, we do not over focus on the data aspect.

Key benefits:

 1. Problem understanding
 1. Context understanding

### 8 - Communications

What is the point of any insights if you can't communicate it? To be honest, my philosophy is, when you discover something, only half the work is done. You now need to communicate it to the right person. You have to make sure they really understand the insights. In other words, you should never throw a graph or a statistic to anyone. You must give them a text, an English text that explain the findings **and makes a recommendation**. I know many people are super uncomfortable with this, but this is key in having the business take the right actions. You can't expect non-data people to understand a survival analysis. That is your tool to understand the data, not the result.

In my team, every time anyone wants to communicate something. We peer review the message. Because we don't work on the same problems, you get a review with someone with low context. If they cannot understand your message, it is most likely because it is not ready yet. We frequently forget how much context we have on a problem when we just finish working on it. What we think is obvious might not be so obvious for others. This help us produce usable communications.

Key benefits:

 1. IMPACT

### 9 - Cross data team collaboration

Now, that goes into the details on how we are organized at Shopify, but each data team more or less live within a product. On a daily basis, we are pretty self-contained. Benefits, we are expert about our data and our product. We can explain it inside out. We really understand what `enable` means on the column `status` of that table. Downside, we have less visibility on other products and data sources. We usually have a very good collaboration between team, but the interaction is more or less limited to some questions here and there and some more involved collaboration when we do a project between two products.

But for the COVID Impact analysis, we have created a full-cross team project, where we have one champion per data team. On a daily basis we meet to share findings and start deep dives that may require or affect multi-products. Over the past weeks, I have worked with a bunch of people I never met. But this cross data team is unbelievable. Because of all items I mentioned above, we all understand each other and within hours this team was running full speed. All the team has only 1 goal, make it better for our Merchants and Shopify, no one cares about it's own little product.

Key benefits:

 1. IMPACT
 1. Team spirit

### 10 - Company-wide philosophy about data

Now, depending on where you work this could be the elephant in the room. What if you tell the CEO of your company, something different, some insights that is a game changer? Do they listen? At Shopify they do. I am not saying they do everything we say. They don't because data is not the only thing that matters. Dev, legal, UX, marketing, product, etc. All of them matters. But at Shopify, when you communicate an insight, leaders really listen. They consider anything that could help our merchants.

If you followed the news, Shopify did announce many things to help merchants during this world pandemic. To some extent, for many of those, data insights had a significant role in the decision-making.

The attitude our company, our leaders have toward data is really making our work move from interesting to impactful.

Key benefits:

 1. IMPACT

## Conclusion

Of course, like other places, Shopify is not perfect. There are small bumps here and there. But overall, all the efforts we have put in the last 10 years, to build a solid Data Warehouse. The effort our data team has put in place to make all of the above possible. All of this made us able to leverage years of data work to build massive insights within days. When the COVID impact team started, no one needed to start from scratch. We reused existing dashboard or vetted data points. We used modelled data to calculate new things with fewer than 50 lines of SQL.

Your foundation is key for crisis times, and I am lucky to work in a company that cares about foundation work.
