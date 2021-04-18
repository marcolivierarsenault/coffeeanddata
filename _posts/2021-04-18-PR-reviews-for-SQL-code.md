---
layout: post
title: 'PR Reviews for SQL code'
tags: [data, data_science]
featured_image_thumbnail: assets/images/posts/warning.jpeg
featured_image: assets/images/posts/warning.jpeg
featured: true
hidden: true
---

This is my personal guide on how I review my peer SQL code. 

<!--more-->

As I mentioned before, at Shopify, all our work is peer reviewed. This includes dashboards and SQL code. One of the most used tools for data scientists at Shopify is Mode(======URL======). If you never worked with it, Mode is a simple dashboarding tool where you write SQL to get your dataset and then you can use some drag and drop charts to build the dashboard. 

That being said, someone at Shopify figured out a way to connect Mode with Github, so now when someone creates or modifies a Mode dashboard we can review it, like we would review any peace of code. Now having the ability to review code is one thing, doing it efficiently to catch mistakes is another one. 

If I simply open the PR and start reading the query, I realized that I end up reading it like I read a story. By the end of the query, I usually understand what they wanted to do but I haven’t caught anything valuable in the process. 

 ## State of the art

There are tons of guides online on how to review codes, but most if not all of them are for more traditional languages and “normal” software development. I could not find anything related to SQL and data sciences, at least not the way I needed it. 

What is so different about SQL? Why can’t other guides/ressources do the trick? I think this is not current practice to review such work, at least not so thoroughly. First, the mindset is completely different. You are either doing an analysis and you are trying to tell a story, convey in  english what the data is telling you. Or you are building a self-serve dashboard, a one page view that will help anyone understand the health of your product/project etc. 

So, over the last years I have built my checklist on what I am looking for when I review my peer’s work. Keep in mind that I did not find all of these, most comes from colleagues,  others from professional experiences.

## PR Review list

My list is divided in two main categories. First the result, this is where I review the analysis itself, I care about the problem and the result, not what is in between. Then there is the actual code where I go in depth of the SQL code itself. 


### The result

This category is more objective and I also feel it is the most undervalued. This is where you can make the difference between average work and impactful work. 

The problem: This sounds overly simple but trust me, this might be the most ignored aspect, especially for more junior data scientists. Did you really understand the problem? The way we work at Shopify is stakeholders open github issues. Most data scientists simply read it and start implementing it, as is, assuming whatever is there is from god itself. The truth is, the person that opened that issue, most likely tried to explain the best they could what they were looking for, but they are not the data scientist,  You are. Stop for a minute, try to understand the real problem behind the task, then ask yourself what can data do to solve the problem and discuss it with the original stakeholders. Most of the time you will come up with a different angle on the problem that might be really beneficial.

FYI, this is the item you need to work on if you want to move from being a SQL query shop, to a real business partner. 

To review this, I read the original issue and discussed with the data scientist to see if they understand the problem deeply. For areas I have deep knowledge, this is a bit easier, for areas I don’t, I usually look around for a Product Manager to see if we can chat about the problem. 

Does the result answer the problem: We talked about the problem a lot, does this artefact help understand the problem. Here I am usually trying to first look if this makes me understand what is going on, then I put myself in the shoes of a developer/PM/Fiance/GM etc and try to determine if they have the component needed, if there is too little or too much information. 

One antipattern I am looking for is the, `I am going to show you everything I have done`. Instead of focusing on the result or interesting elements, some people want to prove they have worked hard and try to show everything, even charts that show nothing. (ex: a chart that shows that Merchant Country has no impact)  Unless the point was to prove that, this should not be there. 

No pie chart: I am not even going to explain this point. 

Graph selections: 

For Dashboard:
Is it reusable?
For Static analysis: 
Is the result clear for non data scientists?
Does it have strong conclusions?
Does it have a recommendation?

### The SQL

Join order: Some DB have great optimizator, but nothing beats taking care of the JOIN order manually. So, your biggest dataset should always be on the left (or above in the FROM, JOIN order) example

```SQL
SELECT *
FROM big_table
JOIN medium_table USING (_key1)
JOIN small_table USING (_key2)
```

Exploding Joins:

Input data: Are they using the right input data, does modeled data already exist?

Clear and logical CTE:

CTE and final query grain:

Where clause on LEFT JOIN:

Read documentation:
 for tables I am not familiar with

Known gotchas:

Clear and understandable names for variables and CTEs:


### The secret trick

This is what I have learned and that saves me the most time. I do not start reviewing the code until I am 100% aligned with the result. Too many times, I have invested 1 or 2 hours in the SQL first, to only realize I did not agree with the analysis itself, or I thought the way the presented the results was not clear. With the way Mode works, changing the way you want to show the results may require serious re-design of your query. So Now, I never review the code unless I am happy with the final result. 
