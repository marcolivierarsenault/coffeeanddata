---
title: Spark JOIN using REGEX
layout: post
featured_image: assets/images/posts/regex.jpg
tags: [big_data, data_pre-processing, data_science]
---
A more technical post about how I end up efficiently JOINING 2 datasets with REGEX using a custom UDF in SPARK

<!--more-->

### Context

For the past couple of months I have been struggling with this small problem. I have a list of REGEX patterns and I want to know which WIKIPEDIA article contains them.

What I wanted to end with was a table with the following columns:

* Wikipedia Article ID
* Wikipedia Article Text
* Matching Pattern (or null if no pattern got triggered)

<table class="wp-block-table is-style-regular">
  <tr>
    <td>
      ID
    </td>
    <td>
      Text
    </td>
    <td>
      Pattern
    </td>
  </tr>
  
  <tr>
    <td>
      1
    </td>
    <td>
      This Wikipedia:Statistics page measures&#8230;
    </td>
    <td>
      &#8216;\bbot.*generated\b&#8217;
    </td>
  </tr>
  
  <tr>
    <td>
      1
    </td>
    <td>
      This Wikipedia:Statistics page measures…
    </td>
    <td>
      &#8216;\bgompertz\b&#8217;
    </td>
  </tr>
  
  <tr>
    <td>
      2
    </td>
    <td>
      In the context of network theory,&#8230;
    </td>
    <td>
      &#8216;\bpower law\b&#8217;
    </td>
  </tr>
  
  <tr>
    <td>
      3
    </td>
    <td>
      In probability theory and statistics
    </td>suce
    <td>
      null
    </td>
  </tr>
</table>

My list of REGEX was roughly 500 pattern long. Some were simple word search, but others were more complex REGEX. I needed a good way to search for these patterns and find a way to get them in the mentioned format. Some sort of **LEFT OUTER JOIN.**

### Setup

Since there are a lot of articles on Wiki. Apparently, [5.8 millions of them](https://en.wikipedia.org/wiki/Wikipedia:Size_of_Wikipedia). I decided to use a tool capable of paralleling the research, I have decided to use [Spark](https://spark.apache.org/) from the Apache foundation. Now a days, you can select your favourite cloud provider and there is a high chance you can get a cluster with not much more than 1 click, which I did.

Now that I had my working setup I started to look online on how to do that.

The first thing I found online was to do a LEFT OUTER JOIN with **rlike**.

<pre><code class="language-python">wiki.join(regex, expr("text rlike pattern") how='left_outer')</code></pre>

That looked promising, on a small set it was doing exactly what I wanted.

![success](assets/images/posts/success.gif#center)

After I naively just launched the join for all the dataset&#8230; and I waited for a long time. Actually as long as it took me to realize my cluster went out of memory. From that point, I looked online for many hours, tried many solutions and I could not find anything relevant on how to solve that problem.

![disapointed](assets/images/posts/disapointed.gif#center)

Since that was nothing really important, I did not touch it for a couple of months and one day at work, I was talking about it with one of my colleagues and he figured out the problem.

### The issue

Here is what he said:

&#8221; First, and foremost, non-equijoins perform poorly in Spark because they can only be evaluated using a **broadcast nested loop join**&nbsp;or a&nbsp;**cross join**.

Let’s assume that **articles** contains 1,000,000 rows and **patterns** contains 500 rows. The smaller dataset (**particle** in this case) will be broadcast. To evaluate this join, **particle** will effectively be scanned 1,000,000 times and the join predicate will be evaluated 500,000,000 times. What makes it even worse is that the pattern will be compiled 500,000,000 times.&#8221;

>'This basically spells disaster.' <cite>― Michael ―</cite>

### The Solution

And then, after finding the issue he came back to me a couple of days later with a custom UDF

<pre class="line-numbers"><code class="language-python">def findMatchingPatterns(regexes: ArrayList[String]): UserDefinedFunction = {
  udf((value: String) => {
    for {
      text <- Option(value)
      matches = regexes.asScala.filter(r => Pattern.matches(r, text))
      if matches.nonEmpty
    } yield matches
  }, ArrayType(StringType))
}
</code></pre>

and to use it, simply need to query it like this:

<pre class="line-numbers"><code class="language-python">from utils.scala_functions import find_matching_patterns
from pyspark.sql import functions as F

regexes = regex.agg(F.collect_list(F.col("pattern"))).collect()[0][0]
regexes = sc.broadcast(regexes)

articles = articles \
    .withColumn("patterns", find_matching_patterns(F.col("text"), regexes.value)
    .withColumn("patterns", F.when(F.col("patterns").isNull(), F.array(F.lit(None))).otherwise(F.col("patterns"))) \
    .withColumn("pattern", F.explode(F.col("patterns")))
</code></pre>

### Result

I tried it, and within couple of hours I had exactly what I wanted.

![mission_accomplished](assets/images/posts/mission_accomplished.gif#center)

I decided to do a small benchmark. After both datasets loaded and cached in Spark, I selected only 20 000 articles to try both methods. By using the same exact samples here are the results:

* First technique, _rlike_: 3 articles per seconds
* Second technique, _UDF_: ~5 000 articles per seconds

I know most of this delay is due to cache, reading and other memory management, but still what a difference.

### Conclusion

I do not usually write this type of blog post, but since I looked for a solution and could not find anything, I thought it worth sharing back.

I would like to thank [Michael Styles](https://www.linkedin.com/in/mstyles/) for his help on this project.
