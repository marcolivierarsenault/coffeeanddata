---
title: 'Spark &#038; AI Summit 2019'
layout: post
featured_image: assets/images/posts/sparksummit.jpg
tags: [data]
---
My review of the latest Spark and AI Summit hosted in San Francisco on April 24th and 25th 2019.

<!--more-->

Last week was hosted the latest edition of the Spark Conference. It was the first time for me attending the conference. Here is a breakdown of the different aspect of the conference.

## The big news

Databricks, organizer of the conference and the main contributor of Spark announced couple of items:

### Koalas

They announced a new project called Koalas, a native &#8220;Pandas&#8221; interpreter for Spark. You can now automagically port your Pandas code to the distributed world of Spark. This will be a fantastic bridge from people used to the Pandas environment. Many online classes/Universities teach Data Science using Pandas. Now new data scientists will fill a bit less lost.

I don&#8217;t think this will be useful only for new data scientists. As you probably know, data science is a world full of script sparse around your company. People create script to do various tasks, on various environments using various framework. If your main environment is Spark, you will be to align the execution environment of your Pandas and have one less to care about.

Koalas is available as a free open-source project [here](https://github.com/databricks/koalas). The project is still in pre-release version (0.1)

### Delta Lake

{% include image-caption.html imageurl="assets/images/posts/delta.png#center"
title="delta" caption="delta.io" %}

Delta, one of the main components of Databricks (the paid version of Spark) just got open-sourced. This is a very good news for people using the standard version of Spark.

All the details of the product is available on <https://delta.io/>

### MLFlow

{% include image-caption.html imageurl="assets/images/posts/mlflow.jpeg#center"
title="mlflow" caption="mlflow.org" %}

MLFlow the end to end lifecycle model management from Databricks will be bumped to version 1.0 in may.

The following components will be added to the already existing offering:

* MLFlow Workflow, allow to package multi step project in one pipeline
* MLFlow Model Registery, Registery to publish models, versions, see who is using it

That seems like an interesting process for anyone that produce model commercially.

Funny story about that one, a [colleague](https://www.linkedin.com/in/pascalpotvin/) worked on a similar, in-house project > 2 years ago. So I could say that, it does fit a real need in the industry.

## Best talks

Here is my personal list of favourite talks I attended to:

### Smart Join Algorithms for Fighting Skew at Scale

By: Andrew Clegg, Yelp

[This talk](https://databricks.com/sparkaisummit/north-america/sessions-single-2019?id=30) about how to handle skew in large datasets was the talk I was the most looking for, actually one of the reasons I wanted to attend the conference&#8230;. and I wasn&#8217;t disappointed.

Andrew proposed a very simple but unbelievably efficient way to handle skew. I can already see where to apply this knowledge in my work. TLDR: he proposed to subdivides your really frequent data into smaller chunks by adding a random integer at the end of the ID, and doing and creating all the possible newID, in the smaller table.

For more details, you can check their his slide deck [here](https://docs.google.com/presentation/d/1AC6yqKjj-hfMYZxGb6mnJ4gn6tv_KscSHG_W7y1Py3A/edit?usp=sharing).

### Apache Spark Data Validation

By: Patrick Pisciuneri and Doug Balog (Target)

[They shared Target](https://databricks.com/sparkaisummit/north-america/sessions-single-2019?id=100) data validation framework which should be open sourced soon. The framework allows to do data validation after being produced.

If code has unit tests, data need something like this. We all know that when you process a dataset you have a set of assumptions, they might be true when you create your pipeline, but many months after it is likely the data &#8220;truth&#8221; may be slightly different and then your pipeline may fail on the data. Even worst it might process it without failing without you being aware of it. Such framework will help keep data sanity.

Framework is available on [Github](https://github.com/target/data-validator).

## The nice touch

I really like the spotlight they gave to ML/AI ethics. They allocated a prime spot into Thursday keynote for a talk about ethics. I think this topic is not discussed enough, or at least not with enough priority.

Kudos to Databricks for that one.

## The intangible

As you all know, conference is about 2 things, talks and networking. This conference seems to have understood it and made a lot of effort to enable networking. They basically had content/activities from 8 am to 11 pm all day to have people stay on site.

I had so many interesting discussion with other data scientists from various industries. To me that is the key point of the conference.

## Conclusion

I really loved the conference, the sales pitches were balanced. Most of the technical talks were pure Spark talk from the industry without sales intentions. Networking was fantastic. Technical content was high quality. Congrats to the organizer.

As far as I know they will publish videos from some of the talk on their site: [https://databricks.com/sparkaisummit/north-america](https://databricks.com/sparkaisummit/north-america)
