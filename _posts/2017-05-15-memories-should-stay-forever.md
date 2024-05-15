---
title: Memories should stay forever
layout: post
image: assets/images/posts/20170515/hard_drive.jpg
featured_image: assets/images/posts/20170515/hard_drive.jpg
tags: [misc, perso]
---
Not so long ago, I had the chance to become a father. And one of the … "privilege" of having a baby is the time you have to think during all these nights when he won’t let us sleep.

So, during one of these nights, I realized that I was rapidly adding up the pictures and other different type of memories and I should have a good way (actually a way because I had no strategy whatsoever) to store them. After a couple of hours on my mobile, what I thought was a trivial issue is actually more complex.

<!--more-->

Here was my requirements for the archiving solution:

  1. Should stay valid as long as my children lives.
  2. Require no or almost no maintenance.
  3. Relatively cheap, I can invest couple of bucks but I am not planning to pay CGI 5000$ a month for that.

## Local Hardware backup

My first tough was to look for some hardware media support that I could use to archive my pictures. I have looked at the following media.

### CD/DVD

I naively tough CD and DVD would be the perfect solution. I could burn it and it would last forever. After some research I read from <a href="https://www.clir.org/pubs/reports/pub121/sec4.html" target="_blank" rel="noopener nofollow">Council on Library and Information Resources</a>, that you can expect them to stay good for more or less 30 years.

>“Expectations vary from 20 to 100 years for these discs.” <cite>― CLIR ―</cite>

That wouldn’t make it for my first requirement.

### Mechanical Hard Drive

Mechanical Hard Drive is not known to be super reliable for this type of cold storage. Online you can find many different strategies to keep the data valid but you always need some sort of management and duplication on many drives because a drive won’t last more than 1–2 decades.

Let’s say that I am a bit lazy and there is no way I will do this every year. So, once again, thanks but not thanks.

![usb](assets/images/posts/20170515/usb.jpg#left)

### Flash Drive (SSD, USB Key)

 At this point I had high hope for this one … but it is only good for 10 years. After this I wonder if a good, consumer ready, solution existed. There is no way I am going to buy one of these old tape drive machine, and to be fair I don’t even know if they last for long.

### M-DISC

![usb](assets/images/posts/20170515/cd.jpg#right)

After some research I came across the “<a href="https://en.wikipedia.org/wiki/M-DISC" target="_blank" rel="noopener nofollow">M-DISC</a>”, a new type of CD/DVD with no organic layer. Who knew there was an organic layer in normal CD/DVD. This M-DISC pretend they can store your data up to a thousand years.

Obviously nobody tested them for that long but it seems to be the best way up to now. You simply need a CD/DVD burner that is compatible (you can find some on Amazon for 20 CAD$) and the actual M-DISC (20$ for 5 DVD (4.7GB)).

### Cloud

![cloud](assets/images/posts/20170515/cloud.jpg)

Cloud is right now a very popular way to store data for a long time. You usually pay couple of dollars per month, and they take care of your data. Microsoft Azure, Amazon Glacier or Google Cloud Coldline offers that type of service.

They all offer a cold storage for more or less 0.01 US$/GB/Month. They charge some fees to recover your data, and all offers different delay from a couple of seconds to couple of hours to get access to the data.

After all that research, I was kind of given up on my cool plan and I decided to go with the default cloud option. Talking about that with my <a href="https://www.linkedin.com/in/fredericnadeau/" target="_blank" rel="noopener">friend</a>, he pointed out a very nice project called Storj.

### STORJ

Storj is a very cool and geek open source project to store your files. In a nutshell it is a network of “Farmers” that offer you to store data on their machines. As a user, every time you want to upload a file the software pick your file, cut it in pieces, encrypt all these pieces and send it to different farmers. For redundancy purposes, each shard (small piece) is sent to, at lease, three different places.

Here is a quick video from their website that explains the solution.

<iframe src="https://player.vimeo.com/video/102119715?color=ffffff&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
<p><a href="https://vimeo.com/102119715">Storj: Decentralizing Cloud Storage</a> from <a href="https://vimeo.com/user30243596">Storj</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

#### Security

Obviously everything is encrypted. I am no security expert and you can get more details <a href="https://www.storj.io/blog/how-storj-increases-object-storage-security-exponentially" target="_blank" rel="noopener nofollow">here</a> about the underling details of their encryption mechanism. You are responsible for your own keys, if you lose them it’s too bad, no recovery possible. Their is no central management, it&#8217;s a real distributed solution.

#### Farming

Now that I was a user I loved it so much that I decided to become a farmer and offer 500 GB from my tower at home. After a couple of minutes, I had the software installed and configured, the storj could start.

They pay you in SJCX a counterparty currency on the bitcoin network. In other words, they pay you in bitcoin. After a month and a half, I received 15 of these coins, which worth today around 12 CAD$ (0.77 each). I currently host 78 GB on my machine.

This is not that much money, but it’s way more than I need to pay my own usage of the storj.

#### Overall

I really enjoy this Cloud Storj. It provides a very good network of more or less 15 000 farmers that DO NOT depend on any central entity. <a href="https://aws.amazon.com/message/41926/" target="_blank" rel="noopener nofollow">Failure, like what Amazon S3 had earlier this year</a>, is less likely to happen in a decentralized service.

The other benefit of such service is the complete confirmation, after a look at their source code, that my data is not used at all by any company.

### Conclusion

I have decided to store my pictures on Google&#8217;s cloud and Storj. As much as I like Storj I don’t trust it enough for now to rely only on this. In a couple of years, when Storj has proved that it’s not going away, I will remove my data from Google’s servers, if that is even possible.
