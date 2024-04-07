---
title: "Merging sites and changing hosts"
description: "Something a little different. Not a guide, just thoughts and opinions about a recent controversy over Netlify, and a decision about the site I made as a result."
pubDate: 2024-02-28
tags:
  - miscellaneous
---

## Sections

1. [Merging sites](#merge)
2. [Netlify's PR disaster](#netlify)
3. [Moving to Cloudflare](#cloudflare)
4. [References](#ref)

<div id='merge' />

## Merging sites

In case you happen to be someone that's visited my blog more than once, you may or may not have realized that I actually ran two versions of it -- one at `arieldiaz.codes` and the other at `fullmetalbrackets.com` -- which had different site designs, but identical content. For a while now I had been considering just merging the two and only maintaining a single site, and I finally took the plunge and did that. I chose `fullmetalbrackets.com` because I just like the name (it's my username on GitHub and other tech-related things) and, frankly, it gets more hits than `arieldiaz.codes` does. I suppose it makes sense that a `.com` domain would always get more traffic, and rank higher in Google search results, than a `.codes` domain. What finally made me commit to merging the sites into one is changing hosts from **Netlify** to **Cloudflare**. But why did I do that?

<div id='netlify' />

## Netlify's PR disaster

If you keep yourself abreast of goings-on in the world of web development, you may have read about Netlify's terrible, horrible, no good, very bad PR day as a result of <a href="https://www.reddit.com/r/webdev/comments/1b14bty" target="_blank">a post on Reddit's r/webdev subreddit</a> which was <a href="https://news.ycombinator.com/item?id=39520776" target="_blank">cross-posted to Hacker News</a> and went viral.

I encourage you to read either link for full details, but basically, someone's simple static site hosted on Netlify's free tier had a 3.44 MB mp3 file on it that got DDOS'd. This caused the site to rack up 190 TB of bandwidth in 4 days, and subsequently the person running the site was billed $104,500 for going over the 100 GB monthly bandwidth cap. It certainly does not help that Netlify charges $55 per 100 GB of bandwidth usage above the free allowance, one of the most expensive prices for bandwidth in web hosting, possibly the most expensive when compared to their competitors. Already, this is not a good look for Netlify, but it gets worse.

When the site's owner reached out to Netlify support, they confirmed it was a DDOS and advised that in these situations, they lower the bill to 20% -- that's $20,900 for a DDOS that the site owner has no way of preventing, and which Netlify did nothing to mitigate. They then offered to lower the bill to 5% of the total -- $5225. That's a lot of money to surprise bill someone for a site on Netlify's ostensibly free tier. Although in truth, Netlify does not truly have a free tier, but is pay-as-you-go which is free only for the first 100 GB of bandwidth each month. If your site goes viral or, as happened to this person, is DDOS'd -- which you cannot control and which Netlify does nothing to mitigate for free plan users, it turns out -- Netlify will not shut off or even throttle the site once the bandwidth passes 100 GB. Instead, it now seems clear, Netlify will allow it to happen and happily bill you for it after the fact.

Comments on the original Reddit post suggested that the story be posted to Hacker News, and as expected, it went so viral that Netlify's CEO himself got involved and graciously null and void the bill. However, the CEO's response in the Hacker News post (which you can read at the Hacker News link above, his comment is the top one) is itself fairly scary to anyone hosting, or thinking of hosting, their hobby project or blog on Netlify. To quote Netlify CEO Bob Funk, _"It's currently our policy to not shut down free sites during traffic spikes that doesn't match attack patterns, but instead forgiving any bills from legitimate mistakes after the fact."_ The comments in response to this by Hacker News visitors have been, understandably in my opinion, not great.

First of all, the email from Netlify support to the affected site owner (which you can see in the original Reddit post linked above) confirms that, based on the traffic coming from user agents using Google Cloud addresses and from "ancient" devices like 2010 iPads and Windows 98 computers, it was clearly a DDOS attack. Who or why, does not matter, and probably won't be discovered or acted on anyway. It could have been a script kiddie in China wanting to troll someone for no other reason than because they can. But if Netlify support correctly identified the situation as a DDOS, why could they only reduce the bill to 5% without escalation? If Netlify's policy is to forgive any bills "from legitimate mistakes after the fact" as claimed by Mr. Funk, why did the CEO have to get involved in this situation for it to happen? What if the site owner hadn't posted on Hacker News, gone viral and gotten the CEO's attention, would they have just been stuck with an over $5000 bill for a DDOS attack that Netlify basically ignored?

A Reddit comment dug up an old post on Netlify's support site, <a href="https://answers.netlify.com/t/limit-bandwidth-to-avoid-high-billing-caused-by-ddos/13086" target="_blank">where a potential customer asks about Netlify's unlimited pay for usage system</a> and their concerns that traffic spikes would lead to surprise bills. In <a href="https://answers.netlify.com/t/limit-bandwidth-to-avoid-high-billing-caused-by-ddos/13086/5" target="_blank">a reply from a Netlify support team member</a>, they essentially brush off the concerns of a free site being DDOS'd or going viral unintentionally, confirming there's no safety net for free users when they get an uncontrolled and unintended spike in traffic, instead suggesting you go with a paid tier or move to another web host if you think this will happen to you. As if someone running a simple blog or hobby project would always know ahead of time the kind of traffic they are going to get. Not everyone with a website wants to go viral, and it's ridiculous to suggest everyone needs to assume ahead of time that their site will get DDOS'd. The support team member's response suggests "investigating options to mitigate the fallout from a DDOS attack or viral content on your own" without so much as pointing them in the right direction. Netlify themselves have no tools to mitigate huge traffic spikes for free sites, nothing in the site configuration to block certain traffic or cause a 503 error upon hitting a threshold, which one would think is the bare minimum. It's almost as if Netlify would rather bill a hapless victim and get paid, then push them into a paid plan, or simply force the victim to move their site to a competitor.

As a result of this situation, the CEO's response to it, and these old support articles showing they will not help you, the latter is exactly what will happen -- free plan users will migrate en masse to competitors that won't take advantage of them if they are attacked, many of which offer basic DDOS protection and rate limits for their free tier. After all, what business in their right mind would risk being on the hook for a huge, but unintentional traffic spike from a freeloader that is most likely using their free tier to learn or for a proof of concept? Vercel, GitHub Pages, and Cloudflare Pages all offer actual protection against this for free users by default specifically to prevent such an occurrence. Netlify's awful way of handling this will not only scare off many free users, who may have eventually scaled to a paid plan, but it will also be a huge warning signs to those already in a paid plan or who were thinking of using Netlify for their app or business. I would not be surprised if this will end up costing Netlify a lot more than the ridiculous $104,500 they wanted to bill.

<div id='cloudflare' />

## Moving to Cloudflare

I decided to delete my sites from Netlify, merge them into one like I've been considering, and host it on Cloudflare Pages. I had already been <a href="/blog/self-host-website-cloudflare-tunnel" target="_blank">experimenting with self-hosting a site and exposing it to the internet through a Cloudflare Tunnel</a>, and I like it a lot. It only made sense to use their excellent Cloudflare Pages product (self-hosting was a fun experiment but I'd rather just let Cloudflare handle that), since it's free plan is very generous -- no bandwidth limits, many options to protect your app or site through their Web Application Firewall, built-in DDOS mitigation and web analytics (Netlify charges $9/month for analytics), and many more ways of configuring to your liking. Advanced features like Load Balancing and Argo Smart Routing can be added a la carte starting at $5/month, a very low price for such things. Compared to Netlify, using Cloudflare as a web host is a no-brainer, even more so after this debacle laid bare how useless Netlify is at protecting their users.

Right now some features from my old sites are missing, namely the contact form (which was mostly used for spam and so won't return) and the "was this helpful" feedback form at the bottom of blog posts, the latter of which I will eventually re-instate since I was getting some good feedback from it. Both of these were using <a href="https://docs.netlify.com/forms/setup" target="_blank">Netlify Forms</a>, one of Netlify's cool unique features, but not cool enough to risk being ruined by their stupid policies towards free users.

If you actually sat here and read all of this, I hope that it was educational for you and that you will think twice about using Netlify in the future. I can say unequivocally that I will never use them again myself.

## References

- <a href="https://www.reddit.com/r/webdev/comments/1b14bty" target="_blank">The original Reddit post from the person who was billed $104,500 for a DDOS attack</a>
- <a href="https://news.ycombinator.com/item?id=39520776" target="_blank">The post on Hacker News which went viral (with CEO's response and subsequent angry comments)</a>
- <a href="https://answers.netlify.com/t/limit-bandwidth-to-avoid-high-billing-caused-by-ddos/13086" target="_blank">Relevant Netlify support question and answers from 2020 (also with recent comments stemming from the over-billing situation)</a>
