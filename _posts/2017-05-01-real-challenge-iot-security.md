---
title: The real challenge in IoT security
layout: post
image: assets/images/posts/20170501/iot_cmcs.png
featured_image: assets/images/posts/20170501/iot_cmcs.png
tags: [misc, ericsson, iot]
---
## About Me

Before writing about my main topic. I want to take a couple of lines to introduce myself. I am an IT Engineer working since I got my bachelor’s degree (4 years ago) for the same company, Ericsson Canada, I have worked, up to now, in two different teams. In the first one, I was in a hands-on research team in the telecom world. For the past 6 months, I am now working in a data science team as a data scientist (Interesting and exciting career move).

<!--more-->

During these years I had the chance to work with one guy that with time became my friend. That friend started a technological blog, <a href="https://thelonenutblog.wordpress.com/" target="_blank" rel="nofollow noopener">The Lone Nut</a>, way before I even start my degree (that is a good clue to understand that he is an experienced colleague). I always like that blog and wanted to do the same. We work in a very “advance” word (The telecom space) and sometimes I feel that it can bring something to the community to share some experience and understand some reality of this very specific world.

So, that being said, I will, with a similar objective, try to start my own blog. I don’t know if I will be able to keep up with his posting pace but I will try to post once every couple of weeks.

### IoT

What a crazy buzzword. I am not planning to explain and try to prove how big and cool Internet of Things (IoT) is or will be. Every manufacturer now pretends to build IoT type of devices. They all want to jump aboard this massive trend that, they hope, will help them generate _gazillions_ of dollars. IoT being a relatively young area, in comparison with M2M, there is still a lot of issues and things to solve about it. One of them is **security**.

### Security

I hope you are not discovering that security in the IoT world is an issue. There are already millions of devices “on the field” and security is a big issue. Most of these devices are done by manufacturers that only want to keep up with competitors. There are tons of examples of security issues in the IoT world. I will include some example in the reference section.

Security is a major concern and needs a real solution and we can&#8217;t expect device manufacturers to take care of it because, no offence, they are not expert in security, they are expert in cars or water meter or smart locks but not in security.

### A solution

First, I am not pretending to be a security expert or anything close. But I am actually not so bad at telecom and IoT devices needs connectivity to send there so valuable ones and zeros. One of the projects I worked on (<a href="https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2016020726" target="_blank" rel="nofollow noopener">CMCS</a>) in the past is an advance connectivity service for IoT devices. I don’t want to enter in detail about that service, but one of the main characteristics was all the security benefits.

That services brings a very high security pipe between your devices and some application server or cloud application. If the device is completely secure from a network perspective, we are convinced that device security would be way better. It would bring the same level of security as a cellular call.

## The Real Issue

After talks with many different players in the industry going from device manufacturers, telecom operators, IoT service providers, Academics, Consumer, etc. I realized that solutions exist. Yes there is our solution, but there are tons of solutions. Some very specialized that covers a small piece of the puzzle, some more generic that covers, or try to cover all the puzzle.

So if there is known solutions currently available why don’t they are in use today. It’s simple. **It’s not a priority**. Even if technology geeks like us care a lot about it, the average consumer doesn’t. The goal of the device manufacturer is to sell devices. They will do whatever makes their customer happy on a budget and features point of view. The current reality is the consumer doesn’t care enough. They care if you ask them in a survey or on the street, but when it comes to paying more for the same device to be secure it is another game.

Sadly security is not seen as a feature. People assume things are secure, the same way they assume they are reliable (which is another interesting subject). They assume everything they buy is secure and safe until something happens and only then they realize the importance of security.

## Final toughs

As much as I think security is a key issue, for the security to be implemented for real in IoT one of the two following things needs to happen:

  1. Consumer ready to drop some bucks and to give up on some features. That will require a key thing called, **Education**. When people are educated about the risks like they are with other concepts like drinking and driving, most of them will be more careful when they will select their brand-new connected whatever.
  2. Government to impose rules like they did in telecom industry. But the massive issue with this one is the Internet in Internet of things. By conception the Internet is made to do whatever you want, with no “legal rules” whatsoever. You can design your own protocols as long as you play with the rest of the stack under you, you are fine. This also means that the market decide what service and protocol to use and usually without really knowing the consequences.

In the meantime, I will keep on using and developing IoT related services and I will try to be as secure as possible.

## References

  1. <a href="https://thelonenutblog.wordpress.com/" target="_blank" rel="nofollow noopener">The Lone Nut (My colleague Blog):</a>
  2. IoT Security issues: <a href="http://gizmodo.com/a-creepy-website-is-streaming-from-73-000-private-secur-1655653510" target="_blank" rel="nofollow noopener">1</a>
  3. CMCS: <a href="https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2016051237" target="_blank" rel="nofollow noopener">Patent 1</a> &#8211; <a href="https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2016020726" target="_blank" rel="nofollow noopener">Patent 2</a> &#8211; <a href="https://arxiv.org/abs/1507.08233" target="_blank" rel="nofollow noopener">Publication</a>
  