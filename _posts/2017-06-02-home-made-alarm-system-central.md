---
title: Home made alarm system central
layout: post
featured_image: assets/images/posts/20170602/alarm.jpg
tags: [misc, perso, iot]
---
Last year, my wife and I purchased our first house. The house came with a very standard alarm system installed by one of the main distributors in Montreal. As soon as I moved in, they made sure to call me and to offer me a monitoring services for something like 12$ / months. Not that I am cheap, but I don’t feel like paying this, especially that my home insurance company said that I would save only 3$/month if I have it monitored.

<!--more-->

So, as a good geek, I have decided to create my own monitoring system. This blog post I will bring you to my "hacking" journey to get my custom monitoring company.

## Goal

My goal was kind of simple, to be notified when there is an alarm so I can take action (go check or call the police, etc.). The best would be to receive a text message on my mobile and an email.

I would also be cool if I can query the system to know if the system is locked or not. So I can remotely check if I forgot to arm it.

What I **don’t want**, to be able to remotely arm or disarm the system. I don’t trust my security skills.

## Start Point

To start, I did not have what-so-ever manual to configure or understand the system. I first needed to reinitiate the alarm panel and reconfigure it with my own NIP. Not that I don’t trust the previous owner but I feel better with a fresh system. After couple hours on google, I found some install/configuration guide for the system. Just so you know, the system is a <a href="http://www.paradox.com/Products/default.asp?PID=6" target="_blank" rel="nofollow noopener">Paradox MG5000</a>.

Now that this part was done, I can at least have an annoying alarm bell that will go on if the intruder gets in.

### Now the fun begins

![board](assets/images/posts/20170602/board.jpg#right)

After some research, I found on the main circuit (the one hidden in the basement, not the front panel) there is a 4-pin connector labelled SERIAL. I then use a multimeter, some logic and some help from friends to deduce the protocol used. The pinout of the port looked like this, from top to bottom: 12V - GND - 5V - 5V.

With all this I could assume the protocol was TTL. So I got myself (actually I borrowed one) a TTL-USB cable to start sniffing their protocol.

_On this picture, which is actually a picture of my system, you can see the port under the grey cable._

### Sniffing

Now I could see the packets getting pushed by the system board I did lots of tests and I found this reference sheet online. It took a lot of time to get that, looks like engineering at Paradox don’t feel like sharing their protocol.

![protocol](assets/images/posts/20170602/protocol.png)

This was actually very useful. It happens to be 95% valid on my system. So after some more test I could really establish the protocol that was working for me.

## Monitoring System

Now that I know what to look for and how. I needed a good platform to get the packet, analyze them and send alarms via SMS or email to myself. After looking at many platforms including Raspberry pi, ESP8266, Arduino I found <a href="https://www.particle.io/products/hardware/electron-cellular-dev-kit" target="_blank" rel="noopener">Particle Electron.</a>

This device is a small prototype board (Arduino like) with a build in 3G modem and a battery system. This is perfect. To work I don’t need Internet and/or power. I the case of a very mean thief that cuts my uplink and or power source everything would still work.

The code is pretty simple, it looks the packets in a basic state machine engine and track the arm/disarm status. If it receives and alarm messages it sends an alarm to the Particle Cloud.

### Custom board

Now that I have the brain (Electron) and the cable, I made a small circuit board to be able to connect everything together.

![board](assets/images/posts/20170602/custom_board.jpg)

On this board you can see:

* The 3G Antenna: The thing with the 3M logo
* Electron device: The thing with the flashing light
* TTL 5V converter: The device in red (right to the battery)
* The battery
* White cable is the power
* Grey cable is the connection from the alarm system

## The Code

All the message getting in and out of the Electron goes via the Particle cloud. This is a very easy to use (Easy for programmers, not my grandma level). The firmware push everything to the cloud and you as a programmer you access a Web API to get data and you receive alarm via web hook (API callback)

So now I needed something to monitor the web hook

### First try - home server

I have developed a very simple containerized application that would query the Particle cloud and tell me if the system was armed. Second aspect was an API callback waiting for the alarm from the Particle cloud. When it would receive the alarm it sends me an email.

![protocol](assets/images/posts/20170602/particle_logs.png#left)

That worked for a while, but because I do lots of stuff with my home server I sometimes forget to restart the container on docker update.

That cause the service to be down and I missed some alarms (Don’t worry test alarms, not real intruders).  

<br>  
<br>  
<br>  
<br>  
<br>  

### Second Try

After all these failed attempts, I decided to change my strategy for the alarm part. I started to use AWS cloud options to relay the alarm to an email and a sms.

Where is what it looks now:

![architecture](assets/images/posts/20170602/architecture.png)

Adding AWS was easy, almost too easy. I have configured an entry point on AWS API Gateway that listens for the alarm from the Particle Cloud. When it receives it, it calls a lambda function (small piece of code) that calls the AWS notification service, where I configured my email and phone number.

To show you the simplicity here is the code of the lambda function. It’s the only place where I have code in AWS, the rest was configuration with clicks in their web page.

<pre><code class="language-python">
console.log('Loading function');

var AWS = require('aws-sdk');
AWS.config.region = ’us-east-1’;

exports.handler = (event, context, callback) =&gt; {
var sns = new AWS.SNS();
sns.publish({
Message: 'THERE IS AN ALARM',
Subject: 'System d\'alarme Maison',
TopicArn: 'arn:aws:sns:us-east-1:209788288140:sendEmailAndSms'
}, function(err, data) {
if (err) {
console.log(err.stack);
return;
}
console.log('push sent');
console.log(data);
context.done(null, 'Function Finished!');
});

callback(null, 'Alarm Sent');
};

</code></pre>

From what I saw up to now, it cost more or less 1 cents per alarm, which is really cheap.

## Conclusion

It took me more or less 20 hours to do all this. Most of the time was to try to understand how the existing alarm system works. It’s a really interesting challenge to reverse engineer a product to hack some new features.

Thanks to <a href="https://www.linkedin.com/in/eric-tremblay-03b276a2/" target="_blank" rel="noopener">Eric </a>for the help with the electric part.

## References

* All my code is available on my <a href="https://github.com/marcolivierarsenault/AlarmSystemMonitoring" target="_blank" rel="nofollow noopener">Github account</a>
* <a href="https://www.particle.io/" target="_blank" rel="nofollow noopener">Particle</a>
* <a href="https://aws.amazon.com/" target="_blank" rel="nofollow noopener">AWS</a>
