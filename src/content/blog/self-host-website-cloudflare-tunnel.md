---
title: "Complete guide to self-hosting a website through Cloudflare Tunnel"
description: "In this guide I demonstrate how to self-host a static web blog and expose it to the internet via a Cloudflare tunnel."
pubDate: 2023-12-29
updatedDate: 2024-01-05
tags:
  - Self-Hosting
  - Cloudflare
---

## Sections

1. [What and How](#what)
2. [The website](#site)
3. [Setting up the Nginx container](#nginx)
4. [Set up domain in Cloudflare](#domain)
5. [Set up the Cloudflare tunnel](#tunnel)
6. [Set up a redirect](#redirect)
7. [Configure HTTP response headers on Cloudflare](#headers)
8. [References](#ref)

<div id='what' />

## What and How

You can very easily set up and host a website via Netlify, Cloudflare Pages, or GitHub Pages, or many other options. Self-hosting a website instead means your website lives and operates out of a device that lives in your home or on a cloud provider like Digital Ocean.

First, requirements:

1. You need to create a free Cloudflare account.
2. You need to own a domain. Look on Namecheap and Porkbun (or any domain registrar you prefer) for cheap domains, like those ending with `.cc` or `.us` -- they can usually be bought for less then $10 and often for as low as $4 or $5. (This is the price for the first year, to hook you, but annual domain renewals can cost more after that first year, so do your research.) Alternately you could set up something like <a href="https://www.duckdns.org" target="_blank">DuckDNS</a> to avoid buying a domain, but you're on your own there -- domains are so cheap I've never bothered.
3. You'll need a website. I won't be explaining how to build a website here, you can just code one from scratch with HTML and CSS if you know how, or you can use a static site builder like <a href="https://astro.build" target="_blank">Astro</a> or <a href="https://nuxt.com" target="_blank">Nuxt</a>. Feel free to <a href="https://github.com/fullmetalbrackets/" target="_blank">check out one of my sites on GitHub</a>, fork it, change it to your liking, and use that. They're open source for a reason.
4. You will need to install Docker and all it's dependencies, the Cloudflare tunnel runs as a Docker container and we'll also be using an Nginx container as the webserver. You can use Nginx "bare metal" if you prefer, but I won't explain how here.

<div id='site' />

## The website

Like I said, I'm not explaining how to build a website here. Assuming you used a static site generator like **Astro** (what I use for this site) or **Nuxt**, use the necessary commands to build the site for deployment -- most likely this will be `npx run build`, `yarn build`, or something along those lines. Most static site builders output to a `/dist` or `/public` folder, which is what will be exposed to the internet.

Make a note of the full path to your website's output directory, so for example `/home/bob/sites/my-cool-blog/dist` or the like.

<div id='nginx' />

## Setting up the Nginx container

Websites need a **webserver** to serve their pages to be viewed on a browser. I use an Nginx docker container since it just makes everything easier and, importantly, repeatable. (Ideally I can just move the website files and configuration to any other device and easily recreate it.) I'll be using **Docker Compose** for this, again to make things easier and repeatable. Within the root directory of your site, create the file `docker-compose.yaml` and add the below to it:

```yaml
version: "3.8"

services:
  site:
    restart: unless-stopped
    container_name: site
    image: nginx:1.23.3-alpine
    volumes:
      - /home/bob/sites/my-cool-blog/dist/:/usr/share/nginx/html/
    ports:
      - 8888:80
```

Make sure the local port, `8888` above, does not conflict with any other self-hosted services you may have. Feel free to change it to anything else.

Next we need to create a `nginx.conf` file and add the below to it:

```bash
worker_processes  1;

events {
  worker_connections  1024;
}

http {
  server {
    listen 8888;
    server_name   _;

    root   /usr/share/nginx/html;
    index  index.html index.htm;
    include /etc/nginx/mime.types;

    gzip on;
    gzip_min_length 1000;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
      try_files $uri $uri/index.html $uri.html;
    }
  }
}
```

Now use the command `docker compose up -d` to download the Nginx container image and run it using the parameters from the compose file and configuration file. Based on the settings above, Nginx will serve the static files from **/dist** directory on the machine's **network port 8888**. You should be able to access it by going to it's IP address and adding the port, for example `http://192.168.1.100:8888`. If you only want to self-host a site that you can access from within your home network, and you don't want to expose it to the internet, then you're done! Otherwise, read on to expose it to the internet with a Cloudflare Tunnel, without need to open ports on your router.

<div id='domain' />

## Set up domain in Cloudflare

As I said, you'll need a Cloudflare account and a top-level domain that you own. Login to Cloudflare account and do the following:

1. Go to **Websites** on the sidebar if you’re not already there, and click the **Add a site** button.

2. Enter your domain and click **Add site**, then click on the **Free plan** at the bottom and click **Continue**.

3. After waiting a few moments for the DNS quick scan, you should see your domain’s DNS records appear. Click on **Continue**.

4. Cloudflare will now present you with the URLs to two nameservers, something like `adam.ns.cloudflare.com`. Leave this page open, we’ll come back to it.

5. In a new tab, go to the registrar that owns your domain and login, go into your domain’s DNS settings, delete any default DNS nameservers and add both of the URLs provided by Cloudflare. Make sure to save all the changes.

6. Back in Cloudflare on the page showing the nameservers, click **Done, check nameservers**. It could take a few hours for the DNS changes to propagate, but usually it will take a few minutes. In the meantime, follow the **Quick Start Guide** in Cloudflare.

7. Leave **Automatic HTTPS Rewrites** checked as-is, and activate the checkbox for **Always Use HTTPS**.

8. Leave **Brotli** on. On the summary, click **Finished**.

9. Next go to **SSL/TLS** -> **Overview** on the sidebar, and set the encryption mode to **Full (strict)**.

10. Click on **Overview** on the sidebar to go back to the domain's main page. If you still see _Complete your nameserver setup_, you can try using the **Check nameservers button**. It can take a few hours, but in my experience it usually takes more like 20 minutes.

11. Once your DNS changes have propagated, the **Overview** page will say: _“Great news! Cloudflare is now protecting your site!”_ Now go to **DNS** -> **Records** on the sidebar, and delete any `A` and `CNAME` records -- the tunnel will create the appropriate DNS records automatically, and we're finally ready to set it up.

<div id='tunnel' />

## Create and configure the Cloudflare tunnel

Go to the _Cloudflare Zero Trust dashboard_ by clicking **Access** on the sidebar, then click on **Launch Zero Trust** to open it in a new tab. Once at the Zero Trust dashboard, do the following:

1. On the sidebar, go to **Access** -> **Tunnels**.

2. Click the **Create a tunnel** button, give it a name, and click **Save tunnel**.

3. The next page will provide a docker command to run, but rather than copying and pasting the command as is, we'll again use **Docker Compose** to run `cloudflared`. All we will need is the token Open the `docker-compose.yaml` file and add the following so it looks like the below:

```yaml
version: "3.8"

services:
  site:
    restart: unless-stopped
    container_name: site
    image: nginx:1.23.3-alpine
    volumes:
      - /home/bob/sites/my-cool-blog/dist/:/usr/share/nginx/html/
    ports:
      - 8888:80

  tunnel:
    restart: unless-stopped
    container_name: tunnel
    image: cloudflare/cloudflared:latest
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=
```

Add the **Cloudflare tunnel token** to the `TUNNEL_TOKEN=` environmental variable, the use `docker-compose up -d`. Once the container is up and running, check Cloudflare — reload the page if necessary or wait a few minutes, your tunnel will eventually show as **Healthy** status. Once it does, click the **Next** button.

Now you'll be in the _Route Traffic_ page, under the **Public Hostnames** tab do the following:

1. Leave the **Subdomain** empty, it's unnecessary for our purposes here.
2. For **Domain** type in your domain.
3. Leave the **Path** empty as well.
4. Under _Service_, for **Type** select **HTTP** (not HTTPS) from the dropdown menu.
5. For **URL**, put the full LAN (internal) IP address of the machine that will host the site, and append the port you set for the docker container -- for example `192.168.1.100:8888`. (Using `localhost:8888` like the example says may work, but I always just use the full IP.)

you should be able to visit `https://your-domain.com` to hit your website!

<div id='redirect'>

## Set up a redirect

Right now, going to `your-domain.com` should work, but you may notice that going to `www.your-domain.com` does not. Normally you'd set up an A record in your webhost's DNS settings, but Cloudflare Tunnels work a little differently -- they don't use A records. Instead, we'll set up a CNAME for `www`, point it at the tunnel ID, and create a redirect rule.

First, let's add the DNS record.

1. On the Cloudflare dashboard, click on your domain, then on the sidebar open the **DNS** dropdown and click **Records**.
2. On the next page, click the **Add record** button.
3. Under **Type** choose _CNAME_.
4. Under **Name** type in `www`.
5. Under **IPv4 address** put in your tunnel ID. (If you need the ID, just copy and paste it from your primary CNAME record.)
6. Click the **Save** button.

Now for the redirect rule.

1. On the Cloudflare dashboard, click on your domain, then on the sidebar open the **Rules** dropdown and click **Redirect Rules**.
2. Click the **Add rule** button, and on the next page give your rule a name.
3. In the **If...** section, under _When incoming requests match..._ click the radio button for **Custom filter expression**.
4. Below _When incoming requests match..._, ignore the dropdowns and instead click on **Edit expression**.
5. In the Expression Editor, type in `(http.request.full_uri contains "www.your-domain.com")`. (Obviously change it to your actual domain.)
6. In the **Then...** section, for **Type** choose _Dynamic_ from the dropdown.
7. Under **Expression** type in `concat("https://","your-domain.com",http.request.uri.path)`. (Again change to your actual domain.)
8. Leave the **Status code** as 301 and click **Deploy**.

Now when you go to `www.your-domain.com` it should redirect to `your-domain.com`.

<div id='headers' />

## Configure HTTP response headers on Cloudflare

Though optional, it's always good practice to set up your HTTP response headers on any website you host. If you check your site on <a href="https://securityheaders.com/" target="_blank">securityheaders.com</a> you'll probably have an F grade. A lot of tech blogs don't bother with this, most that I have checked get a D+ at best, so don't think it's required by any stretch. However, if you feel like going that extra step, here is how:

1. Login to Cloudflare and on the sidebar go to **Rules** -> **Transform Rules**, choose the **Modify Response Header**, then click **Create Rule**.
2. Name the rule (e.g. "Security Headers"), scroll down to **If...** and choose **All incoming requests**, scroll down to **Then...**.
3. In the **Select item...** dropdown choose **Set static** -- click the **Set new header** button six times, and choose **Set static** for all of them. Cut and paste the below **header names** and **values** into each rule you create.

| header name                 | value                                                |
| --------------------------- | ---------------------------------------------------- |
| `x-content-type-options`    | `nosniff`                                            |
| `x-frame-options`           | `SAMEORIGIN`                                         |
| `x-xss-protection`          | `1; mode=block`                                      |
| `strict-transport-security` | `max-age=31536000; includeSubDomains; preload`       |
| `referrer-policy`           | `no-referrer-when-downgrade`                         |
| `content-security-policy`   | `upgrade-insecure-requests; block-all-mixed-content` |
| `permissions-policy`        | `autoplay=(), geolocation=()`                        |

Once that is done, click the **Deploy** button. Wait a few minutes, then check your security headers again, and now it should be a higher grade. To get A+ you'll need to add more detailed values for the `content-security-policy` headers (<a href="https://content-security-policy.com" target="_blank">see here</a>), but you can break Cloudflare Analytics and other features if you don't do it right, so I haven't bothered with it.

<div id='ref' />

## Reference

- <a href="https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/" target="_blank">Cloudflare Docs - Add a site</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/remote/" target="_blank">Cloudflare Docs - Tunnels</a>
- <a href="https://developers.cloudflare.com/fundamentals/basic-tasks/manage-subdomains#set-up-redirects" target="_blank">Cloudflare Docs - Manage subdomains, Set up redirects</a>
- <a href="https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard" target="_blank">Cloudflare Docs - Create redirect rule</a>
- <a href="https://blog.cloudflare.com/transform-http-response-headers" target="_blank">Cloudflare Blog - Modifying HTTP response headers with Transform Rules</a>
