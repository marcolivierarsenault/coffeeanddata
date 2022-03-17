---
layout: post
title: 'PR Reviews for SQL code'
tags: [data, data_science]
featured_image: assets/images/posts/review.jpg
---

This is my personal guide on how I review my peer SQL code.  

<!--more-->

As I mentioned before, [at Shopify, all our work is peer reviewed](https://coffeeanddata.ca/how-to-thrive-in-the-face-of-disruption-tips-from-shopify-data-team). This includes dashboards and SQL code. One of the most used tools for data scientists at Shopify is [Mode](https://modeanalytics.com). If you never worked with it, Mode is a simple dashboarding tool where you write SQL to get your dataset and then you can use some drag and drop charts to build the dashboard. 

Someone at Shopify figured out a way to connect Mode with Github, so now when a Data scientist creates or modifies a Mode dashboard we can review it, as we would review any piece of code. Now having the ability to review code is one thing, doing it efficiently to catch mistakes is another one. 

If I simply open the PR and start reading the query, I end up reading it like I read a story. By the end of the query, I usually understand what they wanted to do but I haven’t caught anything incorrect in the process. <br/><br/>

## State of the art

There are tons of guides online on how to review code, but most if not all of it is for more traditional languages and “normal” software development. I could not find anything related to SQL and data sciences, at least not the way I needed it. 

What is so different about SQL? Why can’t other guides/resources do the trick? I think it is not current practice to review SQL queries, at least not so thoroughly. First, the mindset is completely different. In SQL, you are either doing an analysis and you are trying to tell a story, convey in English what the data is telling you. Or you are building a self-serve dashboard, a one-page view that will help anyone understand the health of your product/project, etc. 

So, over the last years I have built my checklist on what I am looking for when I review my peer’s work. Keep in mind that I did not find all of these, some comes from colleagues, others from professional experiences.<br/><br/>

## PR Review list

My list is divided in two main categories. First `the result`, this is where I review the analysis itself, I care about the problem and the result, not what is in between. Then there is the actual code `the SQL` where I go in depth of the SQL itself. 



### The result

This category is more subjective and I also feel it is the most undervalued. This is where you can make the difference between average work and impactful work. 


1. **The problem**: This sounds overly simple but trust me, this might be the most ignored aspect, especially for more junior data scientists. Did you really understand the problem? The way we work at Shopify is stakeholders open Github issues. Most data scientists simply read it and start implementing it, as is, assuming whatever is in there, comes from God itself. The truth is, the person that opened that issue most likely tried to explain the best they could what they were looking for, but they are not the data scientist, you are. Stop for a minute, try to understand the real problem behind the issue, then ask yourself what you can do, as a data scientist, to solve the problem and discuss it with the original stakeholders. **Most of the time you will come up with a different angle on the problem that might be really beneficial.** <br/><br/>IMO, this is the item you need to work on if you want to move from being a SQL query shop, to a real business partner. <br/><br/>To review this, I read the original issue and discuss with the data scientist to see if they understand the problem deeply. For areas I have deep knowledge, this is a bit easier, for areas I don’t, I usually look around for a Product Manager to see if we can chat about the problem. 

1. **Does the result answer the problem**: We talked about the problem a lot, does this artifact help understand the problem and the solution. Here, I am usually try to first look if this makes me understand what is going on, then I put myself in the shoes of a developer/PM/Fiance/GM etc. and try to determine if they have the components needed, is there too little or too much information on this report? <br/><br/>One antipattern I am looking for is the, `I am going to show you everything I have done`. Instead of focusing on the result or interesting elements, some people want to prove they have worked hard and try to show everything, even charts that show nothing. (ex: a chart that shows that Merchant Country has no impact.)  Unless the point was to prove that, this should not be there. 

1. **No pie chart**: I am not even going to explain this point. 

1. **Graph selections**: This one is hard to explain and highly subjective, but are those the right graphs? Could the number/insights be clearer if shown differently? There are a lot of good books around this. Charts need to tell a story, the insight should be obvious, if you need to know where to look, it is probably not the proper visualization. 


1. **For Dashboard**: When I talk about a dashboard I refer to reusable/self-serve dashboard. Usually used to track KPI, product health, products early and late metrics, etc. 

    1. **Is it reusable**: That might sound a bit funny, but I make sure they are reusable? If we can find a good way to generalize the dashboard, we will probably save a lot of work/request in the future. If the dashboard simply does that one thing the stakeholder asked for, the dashboard will most likely never be used again. <br/><br/>When a stakeholder comes with a request for a very precise dashboard, I first look if the data already exists, if it does I send them to the existing dashboard. If it does not, I reverse engineer the question and ask myself, what generic dashboard would have answered that question. That second dashboard is what I need to build. 

1. **For Static analysis**: Those are also called deep dive, one off, etc. Those are to answer a specific question that should not come back in the future. Example questions: can we prove the value of product A on our customer? or Does product A increase LifeTime Value (LTV) of our customer, etc.


    1. **Is the result clear for non data scientists?** This part is so important, you need to remove your data mindset and put your average person mindset. You are so close to your analysis at this point you forget all the context you have. Anyone in the company should be able to read this and they would all come to the same conclusion. You should avoid any data/statistical terms as much as possible. If you want to also describe the analysis for some more data nerdy persons, add it in annex. But the bulk of the report should be to tell the story. 


    1. **Does it have strong conclusions?** My least favourite report (and also the one I see the most) is the long bullet point style list of data facts. Something like _Product A as a penetration of 5% in country A_ or _The average buyer spends $3 more on their orders_<br/><br/>I want to read why those numbers matter. Is 5% high or low. What are other similar products doing in this market, or compare it with other countries? You need to put a mental model in the reader's mind, because if you don’t they will and there is a lot of chance they will do it wrong. It is your analysis, you should be the one imposing the reference points, the why it matters and the why I should care. 

    1. **Does it have a recommendation?** This is your best, most likely only chance to really be impactful. **You need a bold recommendation.** It does not need to be shocking or unexpected, but you should start and finish your analysis with the recommendation of data. `I recommend that we kill product A because XYZ.` A lot of data scientists are very uncomfortable with this, but if you don’t do it one of the 2 things will occur. Either they will undervalue the result and go against what data says, because it was not clear enough in your analysis, or they will agree with you and they will make the call and nobody will realize the work you did on this. <br/><br/>**If you want to be an impactful partner with your stakeholders, you must provide clear recommendations.**



### The SQL

This section is in no particular order, I just make sure all of those are verified. 
<br/><br/>
- **Join order**: Some DB have great optimizers, but nothing beats taking care of the JOIN order manually. So, your biggest dataset should always be on the left (or above in the FROM, JOIN order) example:
```SQL
SELECT *
FROM big_table
JOIN medium_table USING (_key1)
JOIN small_table USING (_key2)
```
There is no point in measuring this exactly to the row or the real size of the table. That being said, if there are significant differences in the table sizes, it is really worth ordering for performance reasons. One easy way to look at this in a world of facts and dimensions is to make sure the fact tables are first, then the dimensions. 
<br/><br/>
- **Exploding JOINs**: Exploding joins are when you think you have a 1:1 relationship between 2 tables. You join them, then suddenly you have some duplications. This type of error is really hard because most of the time it is completely silent. The other tricky aspect of this is when the error is off only by a couple of percent. Because for most of the table you do have this 1:1 relationship, but there is a corner case that you did not think of, then suddenly your result is higher by a couple of percent, which makes it very hard to detect. <br/><br/>I make sure every table grain is what’s expected. In other words, I read the query and don’t assume the grain of the table in the joins. If I am lucky, the dataset has a `unique keyset`, this is an internal mechanism at Shopify, when we build a dataset that ensures the grain is respected. If I have this, and it is aligned with the JOIN, then I am good to go. <br/><br/>If I don’t have this, I usually query it like this:
```SQL
SELECT grain, count (*)
FROM table
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10
```
If the first row has `1` in the second column, we are good to go, the grain is respected. 
<br/><br/>
- **Imploding JOINs** : What we just talked about, can be reversed for INNER JOINs. If you JOIN table_a and table_b make sure you are not losing rows when you thought you had a 1:1 relationship. Example table_a has 100 rows with unique id, table_b has the same unique id but only 99 rows. You will silently lose 1 row. <br/><br/>I usually test that with this simple check:
```SQL
SELECT count (*)
FROM table_a
JOIN table_b
   ON table_a.id = table_b.id
```
Should give the same result as:
```SQL
SELECT count (*)
FROM table_a
FULL OUTER JOIN  table_b
   ON table_a.id = table_b.id
```
If you end up with the same count on both of those queries, you are most likely OK. 
<br/><br/>
- **Input data**: Are they using the right input data, does modeled data already exist? Usually we try to go too fast with a dataset we already know. We don’t look around for existing modelled data that would help answer the question. When I review queries that use JOIN too much or when they use unmodeled data. I spend a couple of minutes searching existing datasets. If something already exists, you need a very good reason not to use it. Likely, someone with more business knowledge built it and all this context is probably included in the modelled dataset. Using it will prevent you from omitting small details that will make a difference at the end. 
<br/><br/>
- **Clear and logical CTE**: The CTEs in the query should tell a story. They should be logical and ordered properly. When possible they should be sequential, you should not need to scroll up and down all the time to understand what is going on. <br/><br/>I also make sure the grain of each CTE makes sense that they are clear. CTEs should also have clear and self-explanatory names. Just by reading the name I should be able to guess what it does and what grain I get out of this CTE.<br/><br/>When CTE are more convoluted, I frequently copy all the CTE in a fresh query file, and I display the output of the one I am not sure of the result. So I do `SELECT * FROM CTE_1` just to fully understand what gets out of some of those CTE. 
<br/><br/>
- **Where clause on LEFT JOIN**: When there is LEFT JOINs I make sure there is no WHERE clause on the right table. Because if there is one, you basically reverted it back to an INNER JOIN. Example:
```SQL
SELECT *
FROM table_a
LEFT JOIN table_b USING (_key1)
WHERE table_b.country = ‘US’
```
This is the equivalent of 
```SQL
SELECT *
FROM table_a
JOIN table_b USING (_key1)
WHERE table_b.country = ‘US’
```
Since any NULL from table_b gets deleted by the WHERE. 
<br/><br/>
- **Read documentation**: For tables I am not familiar with I take 3 minutes and I read the documentation, which first helps me to review the query, but also provide me with better context in the future. 
<br/><br/>
- **Known gotchas**: All tables have their own small gotchas. Typical Shopify example, make sure you filter on shops that are currently customers. You probably don’t care about a shop that left Shopify 10 years ago in your analysis. 
<br/><br/>

### The secret trick

This is what I have learned and that saves me the most time. I do not start reviewing the code until I am 100% aligned with the result. **Too many times, I have invested 1 or 2 hours in the SQL first, to only realize I did not agree with the analysis itself**, or I thought the way they presented the result was not clear. With the way Mode works, changing the way you want to show the results may require serious redesign of your query. So now, I never review the code unless I am happy with the final result. 
<br/><br/>

## Conclusion

All of this is in no way an exhaustive list, but I try to keep those points in mind when I go through some of my colleagues’ work. Over the past years, that helped me to stay consistent with PR reviews and usually when I am OK with most of this list,I have caught most of the serious issues with the query. 

Special thanks to [Tristan Boudreault](https://www.linkedin.com/in/tristanboudreault/) for some of the suggestions. 
