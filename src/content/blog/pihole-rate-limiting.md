---
title: "Disable query rate-limiting on Pi-Hole to fix DNS"
description: "Sometimes DNS issues in Pi-Hole are a result of the DNS query rate-limiting enabled by default, which can be disabled altogether by editing a single file."
pubDate: 2023-07-18
tags:
  - Pi-Hole
---

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> Credits to <a href="https://pi-hole.net/blog/2021/02/16/pi-hole-ftl-v5-7-and-web-v5-4-released/#page-content:~:text=Rate%2Dlimiting%20can%20easily%20be%20disabled" target="_blank">this post on the official Pi-Hole blog</a> and <a href="https://www.reddit.com/r/pihole/comments/osm2fn/psa_if_you_are_having_random_dns_resolution" target="_blank">this post by u/Thom\_\_Cat in r/pihole Subreddit</a>

Edit the FTL config file:

```bash
sudo nano /etc/pihole/pihole-FTL.conf
```

Change the line for rate-limiting:

```bash
RATE_LIMIT=0/0
```

This solved random DNS errors I was having after I getting several rate-limiting warnings in _Pi-Hole diagnosis_.
