---
title: 'Distribution&#8217;s 5th Symphony'
layout: post
featured_image: assets/images/posts/20180208/symphony.jpg
tags: [data]
---
I would like to share with you a small tool I have discovered this year which is very useful; Violin Plot!

<!--more-->

## The Intro

## Violin Plot

Violin plots are a nice tool that we can find in many different visualisation libraries. What do they do they show and compare distributions. It&#8217;s, in my own opinion a better way to compare distributions. Here is a quick example

{% include image-caption.html imageurl="assets/images/posts/20180208/seaborn-violinplot-2.png#center"
title="seasboarn" caption="Seaborn Violin plot (Source: seaborn.pydata.org)" %}

As you can see here you can easily compare the value from the for categories (Thur, Fri, Sat, Sun).

In a more precise way, the Violin plot is a mix of [Box Plot](https://seaborn.pydata.org/generated/seaborn.boxplot.html#seaborn.boxplot) and [Kernel density plot](https://seaborn.pydata.org/generated/seaborn.kdeplot.html)

### The Set list

![cutted](assets/images/posts/20180208/cutted-1.png#right)

1. The thin bar represent the 95% confidence interval
2. The thick bar represent the second and third Quartile
3. The white dot represent the Median (The value in the middle)
4. Top and Bottom point represent your min and max
5. The coloured area represent the density or the distribution of the population

&nbsp;

&nbsp;

## The Masterpiece

I have used them for hyper-parameter tuning. When you do hyper-parameter tuning using grid [search](http://scikit-learn.org/stable/modules/grid_search.html) from scikit-learn you get a array of result. I you look simply at the absolute minimum, you can easily end up with an anomaly or a corner case. But looking at the tendance you can get a way better result.

  1. Value will tend to be better in general
  2. The sparse between good and bad will be smaller.

![violon2](assets/images/posts/20180208/Violon2.png#center)

In the above picture it is clear that if you pick a value above 3, you end up with highly variable values. Even if you potentially can get a better result with one of the values > 3, you get no stability and the % chances you get something bad is big.

In this case the value 3 is very good because. First it is a better score than 1 and 2, but it&#8217;s also a lot more compact, thus you can expect a small variance in your results.

&nbsp;

## Where to buy tickets

You can get violin plot in most of the popular visualization libraries. Here is a short list:

* [Seaborn](https://seaborn.pydata.org/generated/seaborn.violinplot.html): The one I have used in this article.
* [Plotly](https://plot.ly/python/violin-plot/): Another very popular lib.
* [Matplotib](https://matplotlib.org/examples/statistics/violinplot_demo.html): I do not like this one, personal taste.
* [GGplot2](http://ggplot2.tidyverse.org/reference/geom_violin.html): For R lovers 😉

## The critics

In conclusion, this is a very nice tool when you need to compare distribution. I honestly think this tool is undervalued and underused.

Happy plotting,
