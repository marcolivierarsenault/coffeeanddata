---
layout: post
title: 'Using data science to save money on my next trip to Mexico'
tags: [visualisation, dataprep]
featured_image_thumbnail: assets/images/posts/mexique-400x200.jpg
featured_image: assets/images/posts/mexique.jpg
featured: true
hidden: true
---

How am I using basic data work to ensure I am getting a good price on my trip.

<!--more-->

It has been 4 years since my wife and I took some vacation in a sunny place. Last time, for our honeymoon, we spent some quality time in Mexico. We enjoyed 10 days in a very nice all-inclusive resort in Riviera Maya. Since then, a house, two kids, a new job and many other things. After some reflexion we decided that it was time to go back on the beach. So, next December (2019) we (my wife, our 3 years old, our 4 months old and I) will be heading to Riviera Maya once again.

Don’t worry, I am not turning my Data blog into a travel and lifestyle blog. I want to share with you how I am making sure I am getting the right price for the trip.

So here is where it is interesting, when we signed the contract this summer (in June) the contract said, if the price go down, I could, once, ask for a price match. Since the trip was +-6 months away, that looked like a very interesting feature. BTW, this is one of the factors that made us pick that travel company. To be upfront with the numbers, we paid _4317 CAD$_ for the full family.

## THE NO SO EASY PART

After a couple of weeks, I went back to check the price. It was still the same. Then I realize, how can I track the price. There is no way I can take the time to go, click through a series of web interfaces to query the price. That would represent an annoying 2-3 minutes a day and I just don’t have that time.

Here is what it looks like to get the price update:

<iframe width="560" height="315" src="https://www.youtube.com/embed/-P5g_FFkqZQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

<br/>

Obviously, the travel company does not feel like it would be a great feature to track the price. After a couple of time searching for it, there is just no way to do this. At least with a tool on the website.

Then what if it is below my original price, do I take this price or I wait a bit more. Because remember, I can only do a price match once. It would be really useful to have all the historic prices, then if/when it gets below original price, I could look at the trend and take a more informed decision.

So now I would need to spend couple of minutes daily to fetch the price, and then couple of more to copy the value into some sort of spreadsheet. Anyone that did something like this knows that it works kinda of OK for the first few days, maybe weeks. But at some point you start missing days, do copy paste error, etc.

Manual process in data is more or less the equivalent of no process.

## JUST SCRIPT IT

My idea was, I can just get the URL, download the HTML from python or something and do some regex magic to extract the price.

![Dumb](https://media.giphy.com/media/d8KOpGnzaAEI7JiVUp/source.gif#center)

Of course, it could not be that easy. First thing, the URL does not really change. All of the price things are some sort of modal on top of the other page. So copying the URL basically brings you back to the home page.

![Network tool](assets/images/posts/network.gif#right)

Now when I started to look at Chrome Developer tools, I assumed I could see somewhere the data coming in. Data has to come in right... right...
Here is the network view...  

Not as simple as I would have liked.  

<br>  
<br>  
<br>  

After a couple of times digging in each of these files, I found the golden nugget.  

![Json-File](assets/images/posts/json_file.png#center)

Seems like we are on the right track. We have what seems to be a JSON file and the custom URL to get it. OBVIOUSLY, when I use this URL directly in a new page it is not working. I receive the equivalent of a page unavailable. Really it seems like they don’t want us to do this. They have set many roadblocks to prevent us from doing it. *Thanks Obama*.

Then, I found a very neat option in chrome Dev tools.

![Json-File](assets/images/posts/curl.png#center)

Copy as cURL. You end up with a very long command you can paste in your terminal and get the JSON.

Finally, something is working. I now have a way to extract the price.

<pre><code class="language-python">
import json
from botocore.vendored import requests

url = 'https://voyagesarabais.com/recherche-sud/getpricedetails?search%5Bgateway%5D=YUL&search%5BdateDep%5D=2019-12-15&search%5Bduration%5D=7day%2C8day&search%5BdestDep%5D=o&search%5BnoHotel%5D=p7&search%5Broom1%5D=a%3A4%3A%7Bi%3A0%3Bs%3A2%3A%2240%22%3Bi%3A1%3Bs%3A2%3A%2240%22%3Bi%3A2%3Bs%3A1%3A%223%22%3Bi%3A3%3Bs%3A1%3A%221%22%3B%7D&search%5Broom2%5D=&search%5Broom3%5D=&search%5Broom4%5D=&search%5Broom5%5D=&search%5Broom6%5D=&search%5Bflex%5D=N&search%5Bflexhigh%5D=3&search%5Bflexlow%5D=3&search%5Broomcallgroup%5D=%5B%7B%22_priority%22%3A9%2C%22nb_rooms%22%3A1%2C%22nb_adults%22%3A2%2C%22non_adults%22%3A%5B%223%22%2C%221%22%5D%7D%5D&search%5Bpricemax%5D=9000&search%5Bpricemin%5D=1&search%5Ballinclusive%5D=Y&search%5Bbeach%5D=&search%5Bcasino%5D=&search%5Bfamily%5D=&search%5Bgolf%5D=&search%5Bkitchenette%5D=&search%5Boceanview%5D=&search%5Bminiclub%5D=&search%5Bspa%5D=&search%5Bwedding%5D=&search%5Badultonly%5D=&search%5Bnoextrasingle%5D=&search%5Bvilla%5D=&search%5Bstar%5D=4.5&search%5Bstarmax%5D=4.5&search%5Bdirectflight%5D=&search%5Btourtodisplay%5D=CAH%2CVAT%2CVAC%2CVAX%2CSGN%2CSQV%2CSWG%2CWJV&search%5Buuid%5D=&search%5BnbRoomsMax%5D=&search%5BhotelDistanceMax%5D='

payload = 'data=QXjaDVS1EqNQAPyXaymCS4l7cL1cAQQn8ILD11%2F6ndlZ%2FfMX%2FufEXTaHeV6sCyracChEFTl8XHzw9NfD8TjxcBJOrgXgabDpEkZOeyGaNsfYlfsXoxaj57LBWgZjpB2mpeDKsJ0iUmI5VVjv9eCeA34db0A8ASRklG9DJjZAVk8j%2BK58ctfscX7FxXppW62OhAMznyYwpeGqU9FoU%2F71SDiO7fk5Dz99S3CAd5RDB9lKTvzmSahBld5gdaz9vfedPConEhM4dpuBiIxpZ6fKZK7O1BDnBvU9Ba%2FHZJXiRNuFCNhRlvZh1lH4WrciCbh5GUW8r4vsjq6xDRJzTvsb3EGJM%2BplJMNkBcma09TrMezjOqFNtOCZ3EHBE8rwpbzA%2Bnp43SKN3No4fVcGdg1hSW1er0e8zHKV7qNEleUPVGcJ4YniN6lPWIA%2BfixcisbTUpO8HgR78ue3i0dZlwJXGyhYhxfWoz5wCrQL5JbnZadk2pILWEdT4RKiXbKcxemTi4mF7paMniWP190lJHXy8eZgV7QqaTnvx%2BwQYGNWsd5jPomwNojiNgn3zh%2B1E2XIxO7ri%2FfN7PXIehG2oplT9oHbTGqkNtPKtiQq9UsjliPEktUIbyc0%2Be8RqapxzPExGO%2BP8Qts0dbCnm7UJ3A15plV51xQq1Y6d07xJjZ4BhGiIHKw9uosLjWpHmidnaEsg%2Fle4JjPGvaZT3tgFAS6cjix2u53EIB4JwwyuGLJSxGCYa8HTz7Tm8WL741X0NfeAcIkpt6ssUJHChKkaf96kAMEG0PDxHs%2B7wDQs%2F2FQgVRsDful59Uhdw7UAWKp4yiQU25FNUlpGoG%2F1nlZGD7lDW2fb7RviM%2FQjpny6Hcxmd6JoeYuHtGOa6VdW3dcMVAxir5FXtwqb2fog0PfNydAw9EuBQwiAbzivCMaLJTr2f%2BXt4SMOadF6fZ29rn66FBIYemXUNzpHDqUoX4FlcaXO9ucgZAisAS66Mbh5xeEK7V0r33Z8oMzAnFHUeen8hoDtq2ahi3JY%2FQC5DqhEiB0eRNkC7bGPaGKXIAoq%2F1ToN4sHN8BpgKd56efidkDlK%2FyJtTid7itoGQUcLMrT0feaY455Znrfb28az3t9C8B9k63ya8BRcaX3QMkDIvsQHxciv33ROC4cA3WhqqcuUkPxRSuz9xACrzlEvXLM4QP0qBFEOvB7qeKyBXqppLE1DFLEPhc0zRyiWY30YwlgSpcQhzmmifBd8wXgLAYpouOFpYn%2BTqDEweseIKO3G2c3gbFJC5yOPGgTVLBsG7KYk%2BkCJpEW984kihzE6lTENZ32CHseFA%2FXCTZUG5FZ3M12VmtH2hKXC1IZ2UAQ4foyB1Qdi35QQJv9Ef235UyPN4c%2FeOeKR9eIlGlL9GiWhogoOEpUnE%2BDdTnKQXFWwgRRHGNXaonLog6ZNhoLCluUWOc8j6a%2BZ793ZojmWm39gkBnx0YWPFstDXoQSkIsIlwr4oN%2F8%2BhfU6N%2F%2Bd0J%2F%2Fb5zoDz0%3D&type=packageplus'

headers = {
'Cookie': 'Cookie: _gcl_au=1.1.596656575.1560126807; _ga=GA1.2.1347033583.1560126807; _fbp=fb.1.1560126807161.1014257493; _gaexp=GAX1.2.NFE8cllqRy-hy2p_zsZ_9A.18143.0; G_ENABLED_IDPS=google; is_all_inclusive_checked=1; PHPSESSID=0odjk0bsqoalhh20ijg3hgcqs2; _hjid=d29cb0cd-017e-4453-a112-b8ae863dbb89; _gid=GA1.2.1378798265.1565464684; _gac_UA-6397631-1=1.1565464692.CjwKCAjw1rnqBRAAEiwAr29II9bpU1twn6ZPzisvGTap3gofl973SwBnRO6CkYdpJF4F3qEYN9FTDBoCPRwQAvD_BwE; _gat_UA-6397631-1=1',
'Origin': 'https://voyagesarabais.com',
'Accept-Encoding': 'gzip, deflate, br' ,
'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8' ,
'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36' ,
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' ,
'Accept': '*/*' ,
'Referer': 'https://voyagesarabais.com/recherche-sud?gateway=YUL&dateDep=2019-12-15&duration=7day,8day&destDep=o&noHotel=p7&allinclusive=Y&beach=&casino=&family=&golf=&kitchenette=&oceanview=&miniclub=&spa=&weeding=&adultonly=&noextrasingle=&villa=&directflight=&tourtodisplay=CAH,VAT,VAC,VAX,SGN,SQV,SWG,WJV&uuid=&nbRoomsMax=&hotelDistanceMax=&star=4.5&starmax=4.5&pricemin=1&pricemax=9000&flex=N&&bedrooms[0][0]=40&bedrooms[0][1]=40&bedrooms[0][2]=3&bedrooms[0][3]=1',
'X-Requested-With': 'XMLHttpRequest',
'Connection': 'keep-alive'
}

r = requests.post(url, data=payload, headers=headers)
parsed_response = json.loads(r.text)

#### you can now access your value in parsed_response as a dict
totalPrice = parsed_response['totalprice']
</code></pre>

As you can see the query is pretty nasty. Really, it is like if they do not want us to extract the prices automatically. At least, now, we have a pretty nice dictionary to work with.

## WHAT TO DO WITH THIS VALUE NOW

Now that we can access the value, how do we extract it. I have decided to create a AWS Lambda function that run every 6 hours to extract the price. With this price, 4 times a day, we do 3 things:

We check if price is good. Since I paid a bit more than 4300, if price would go below 4k$, I send myself an email. To make sure I can act quickly if needed.

1. I store the value (with the timestamp) in a database. (DynamoDB)
1. I store the value (with the timestamp) in AWS S3
1. Why 2 and 3, I was not sure how I would use it, since AWS have some rules about what can access what and because storage is shockingly cheap, I stored it twice.

## THE PRICE

So sadly, the price did not go below 4300$ yet, and to be fair I doubt it will. The trip is now priced at 4700/5000 depending on the days.

![Json-File](assets/images/posts/prix.png#center)

To build this view, I have used the fantastic tool call [Dash](https://plot.ly/dash/) which allows you with fewer than 100 lines of code build this visual. If you are interested, you can go see the app here: [https://voyage.coffeeanddata.ca](https://voyage.coffeeanddata.ca).

## DISCOVERIES

![Network tool](assets/images/posts/no_data.png#right)

For a couple of days I did not collect any new data points. In fact the cURL command was getting back a 404 from the server. Took me a while to realize that I had no new data.

Because I did not implement any validations in my code. The Lambda script would simply silently fail and I would not collect new data points.

So I added a validation in my code that sends me an email when the cookie needed to be updated. I assume the cookie has some expiration encrypted in it. So simply getting a new token seems enough.

## Pick wisely

The other interesting points I got from the data up to now is this part of the curve:

![Json-File](assets/images/posts/data_jump.png#center)

For a couple of days in a row, the price surged by 200$ at around 7am in the morning. This is something I will be careful with, next time I look to book a trip.

## CONCLUSION

Sadly, I did not save any money…yet. I am flying for Mexico in more than 2 months so I will keep tracking the price on my website. Travel companies seems to be making some effort to prevent us to automatically extracting the price.

The price looks to be very volatile, I would be curious to understand what influence the price on an hourly basis.

---  

<br/>
If you are interested all the code is available in my Github repo: [https://github.com/marcolivierarsenault/triptracker](https://github.com/marcolivierarsenault/triptracker)

You can check my web app here: [https://voyage.coffeeanddata.ca](https://voyage.coffeeanddata.ca)
