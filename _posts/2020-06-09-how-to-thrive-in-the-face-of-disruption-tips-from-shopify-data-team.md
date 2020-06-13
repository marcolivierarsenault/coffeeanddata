---
layout: post
title: 'How to thrive in the face of disruption: Tips from Shopify’s Data Team'
tags: [data]
featured_image_thumbnail: assets/images/posts/computer.jpg
featured_image: assets/images/posts/computer.jpg
featured: true
hidden: true
---


Learn how the Data Team has helped Shopify make great decisions during COVID-19.

<!--more-->

----

We currently face a global pandemic. People are in pain around the world. Daily life has been disrupted. Many face monumental financial damage or unemployment. Small businesses are struggling to find creative solutions to adapt and stay afloat — and they need to do so quickly.

At Shopify, we have a mission to make commerce better for everyone, but we did not expect 2020 to start out with a global pandemic. Shopify is a mini-economy — with merchants, partners, buyers, carriers, payment providers all interacting — and planning helps us build products that positively impact the entire system. When COVID-19 happened, those plans went out the window. We had to go back to the drawing board and ask:

>How can we best help our merchants during this crisis?

With over one million merchants in over 175 countries around the globe, there is no one-size-fits-all answer. They are each being impacted in different ways. Layer on the complexity of the mini-economy and it feels like we were faced with an impossible question. Regardless, within a few days of going into lockdown, Shopify’s Data Team had launched a COVID-19 task force to address that seemingly impossible question.

Since then, we’ve played a critical role in helping the company make great decisions in support of our merchants during this unprecedented time. While it pales in comparison to work being done to save lives, I am really impressed by the way the entire team has responded. We’ve provided Shopify with high quality, daily insights as things change rapidly. Here are the factors that enabled us to respond so quickly and effectively in support of Shopify and the merchants who use our platform.

### 1 - Modelled Data

One of the first things we do when we onboard (at least when I joined) is get a copy of [The Data Warehouse Toolkit](https://www.oreilly.com/library/view/the-data-warehouse/9781118530801/) by Ralph Kimball. If you work in Data at Shopify, it’s required reading! Sadly it’s not about fancy deep neural nets (sarcasm) or technologies and infrastructure. Instead it focuses on data schemas and best practices for dimensional modelling. It answers questions like, “How should you design your tables so they can be easily joined together? Which table makes the most sense to house a given column?” In essence, it explains how to take raw data and put it in a format that is queryable by anyone.

I am not saying that this is the only good way to structure your data. For what it’s worth, it could be the 10th best strategy. That doesn’t matter. What counts is that we agreed, as a Data Team, to use this modelling philosophy to build Shopify’s data warehouse. Because of this agreed upon rule, I can very easily surf through data models produced by another team. I understand when to switch between dimension and fact tables. I know that I can safely join on dimensions because they handle unresolved rows in a standard way — with no sneaky nulls silently destroying rows after joining.
This approach has a number of key benefits for working faster and more collaboratively. These are crucial as we continue to provide insights into the rapidly changing environment brought on by COVID-19.

_Key benefits_

1. No need to understand raw data’s structure.
1. Data is compatible between teams.

### 2 - Data consistency and open access

We have a single data modelling platform. It is built on top of Spark in a single GitHub repo that everyone at Shopify can access, and everyone uses it. There’s no hippie in accounting with their own magical stack that only works when 3 planets are aligned. With everyone using the same tools as me, I can gather context quickly and independently: I know how to browse Ian’s code, I can find where Ben has put the latest model, etc… I simply need to pick a table name and I can see 100% of the code that built that model.
What is more, all of our modelled data sits on a Presto Cluster that is available to the whole company, and not just data scientists (except PII information). That’s right! Anyone at the company can query our data. We also have internal tools to discover these data sets that we’ll talk about in an upcoming blog post. That openness and consistency makes things scalable.

_Key benefits_

1. Data is easily discoverable
1. Everyone can take advantage of existing data

### 3 - Rigorous ETL

As a company focused on software, the skills we’ve developed as a Data Team were influenced by our developer friends. All (that’s right all) of our data pipeline jobs are unit tested. We test every situation that we can think of: errors, edge cases, and so on. This may slow down development a bit, but it also prevents many pitfalls. It is easy to lose track of a JOIN that occasionally doubles the number of rows under a specific scenario. Unit testing catches this kind of thing more often than you’d expect.
We also ensure that the data pipeline does not let jobs fail in silence. While it may be painful to receive a Slack message at 4 pm on Friday about a five-year-old dataset that just failed, the system ensures you can trust the data you play with to be consistently fresh and accurate.

_Key benefits_

1. Better data accuracy and quality
1. Trust in data across the company

### 4 - Vetted dashboards

Like our data pipeline, we have one main visualization engine. All finalized reports are centralized on an internal website. Before blindly jumping into the code like a university student three hours before a huge deadline, we can go see what others have already published. In most cases, a significant portion of the metrics you’re looking for are already accessible to everyone. In other cases, an existing dashboard is pretty close to what we’re looking for. Since the base code for every dashboard is centralized, this is a great starting point.

_Key benefits_

1. Better discovery speed
1. Reuse of work

### 5 - Vetted data points

All data points that form the basis for major decisions or that need to be published externally are what we call vetted data points. They’re stored together with the context we need to understand them. This includes the original question, its answer, and the code that generated the results. One of the fundamentals in producing vetted data points is that the result should not change over time. For example, if I ask how many merchants were on the platform in Q1 2019, the answer should be the same today and in 4 years from now. Sounds trivial — but it’s harder than it looks! By having it all in a single GitHub repo, it’s discoverable, reproducible, and easy to update each year

_Key benefits_

1. Reproducibility of key metrics

### 6 - Everything is peer reviewed

All of our work is peer reviewed, usually by at least two other data scientists. Even my boss and my boss’s boss go through this. This is another practice we gleaned by working closely with developers. Dashboards, vetted data points, dimensional models, unit tests, data extraction, etc… it’s all reviewed. Knowing several people looked at a query invokes a high level of trust in the data across the company. When we do work that touches more than one team, we make sure to involve reviewers from both teams. When we touch raw data, we add developers as reviewers. These tactics really improve the overall quality of data outputs by ensuring pipeline code and analytics meet a high standard that is upheld across the team.

_Key benefits_

1. Better data accuracy and quality
1. Higher trust in data

### 7 - Deep product understanding

Now for my favourite part: All analyses require a deep understanding of the product. At Shopify, we strive to fall in love with the problem, not the tools. Excellence doesn’t come from just looking at the data, but from understanding what it means for our merchants.
One way we do this is to divide the Data Team into smaller sub-teams, each of which is associated with a product (or product area). A clear benefit is that sub-teams become experts about a specific product and its data. We know it inside and out! We truly understand what `enable` means in the column `status` of some table.

Product knowledge allows us to slice and dice quickly at the right angles. During COVID-19, this has allowed us to focus on metrics that are vital for our merchants. Deep product understanding also allows us to guide stakeholders to good questions, identify confounding factors to account for in analyses, and design experiments that will really influence the direction of Shopify’s products.
Of course, there is a downside, which I call the specialist gap: sub-teams have less visibility into other products and data sources. I’ll explain how we address that soon.

_Key benefits_

1. Better quality analysis
1. Emphasis on substantial problems

### 8 - Communication

What is the point of insights if you don’t share them? Our philosophy is that discovering an insight is only half the work. The other half is communicating the result to the right people in a way they can understand.

We try to avoid throwing a solitary graph or a statistic at anyone. Instead, we write down the findings **along with our opinions and recommendations**. Many people are uncomfortable with this, but it’s crucial if you want a result to be interpreted correctly and spur the right actions. We can’t expect non-experts to focus on a survival analysis. This may be the data scientist’s tool to understand the data, but don’t mistake it for the result.

On my team, every time anyone wants to communicate something, the message is peer reviewed — preferably by someone without much background knowledge of the problem. If they cannot understand your message, it’s probably not ready yet. Intuitively, it might seem best to review the work with someone who understands the importance of the message. However, assumptions about the message become clear when you engage someone with limited visibility. We often forget how much context we have on a problem when we’ve just finished working on it, so what we think is obvious might not be so obvious for others.

_Key benefits_

1. Stakeholder engagement
1. Positive influence on decision making

### 9 - Collaboration across data teams

For the COVID-19 task force, we created a fully cross-functional team with one champion per data sub-team to close the specialist gap I mentioned. We meet to share findings on a daily basis and collaborate on deep dives that may require or affect multiple products. Over the past weeks, I have worked with many people I’ve never met, and they’ve all been incredible! Because we share the same assumptions about the data and underlying frameworks, we understand each other. Within hours this team was running at full speed. Everyone has been successfully working together towards one goal — making things better for our merchants — without being constrained to their specific product area.

_Key benefits_

1. Business-wide impact
1. Team spirit

### 10 - Positive philosophy about data

If you share some game-changing insights with a big decision maker at your company, do they listen? At Shopify, leaders might not action every single recommendation from Data because there are other considerations to weigh, but they definitely listen. They’re keen to consider anything that could help our merchants.

Shopify has [announced several features](https://www.shopify.ca/blog/shopify-reunite-2020) ([plus these](https://www.shopify.ca/covid19)) to help merchants during lockdowns like [gift card](https://www.shopify.ca/blog/gift-cards-all-plans) features for all merchants and the [launch of local deliveries](https://www.shopify.ca/blog/local-delivery)
. The Data Team provided many insights that influenced these decisions.

At the end of the day, it is the data scientists job to make sure insights are understood by the key people. That being said, having leaders that listen help a lot. Our company’s attitude towards data transforms our work from interesting to impactful.

_Key benefits_

1. Impactful data science

## Conclusion

Shopify isn’t perfect. However, our emphasis on foundations and building for the long term is paying off during this period of distress when data is more critical than ever.

When the COVID-19 task force started, no one on the Data Team needed to start from scratch. We leveraged years of data work to uncover valuable insights within days. Some we got from existing dashboards and vetted data points. In other cases, modelled data allowed us to calculate new metrics with fewer than 50 lines of SQL. Shopify’s culture of data sharing, collaboration, and informed decision making ensured these insights turned into action. Foundational work pays off in times of turmoil. I am proud that our investment in foundations is positively impacting the Data Team and our merchants.

----

**NOTE:** This post was originally posted on [Shopify Data blog](https://engineering.shopify.com/pages/data-science-engineering)

I would also like to thanks the team of fantastic folks at Shopify who help with the edditing of this blog post.
