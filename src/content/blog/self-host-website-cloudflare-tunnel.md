---
title: "Complete guide to self-hosting a website through Cloudflare Tunnel"
description: "Self-hosting a static web blog has never been easier thanks to Cloudflare Tunnel. In this guide I explain how to expose a static website self-hosted on a Linux server inside my home network to the internet using Nginx and Cloudflare Tunnel, and securing it with various other free Cloudflare services."
pubDate: 2023-12-29
updatedDate: 2025-02-10
tags:
  - cloudflare
---

## What and How

You can very easily set up and host a website via <a href="https://netlify.com" target="_blank" data-umami-events="tunnel-guide-netlify">Netlify</a>, <a href="https://pages.cloudflare.com" target="_blank" data-umami-events="tunnel-guide-cf-pages">Cloudflare Pages</a>, or <a href="https://pages.github.com" target="_blank" data-umami-events="tunnel-guide-gh-pages">GitHub Pages</a>, <a href="https://vercel.com" target="_blank" data-umami-events="tunnel-guide-vercel">Vercel</a>, <a href="https://surge.sh" target="_blank" data-umami-events="tunnel-guide-surge">Surge.sh</a>, or many other free or paid options. Honestly, it's never been easier to have a website and there's never been more free options.

Self-hosting a website, however, is a whole other can of beans -- instead of letting one of these companies host your website in their infrastructure, your website will live and operate out of a server in your home, or on a cloud provider like Digital Ocean, Oracle or Hetzner. This means you have only yourself to rely on for maintaining the server, making sure it's secure and has the latest updates, etc. Cloudflare Tunnel removes a lot of the hassle, and even enhances it with other free Cloudflare services like Web Application Firewall and Web Analytics. (Note that these are also available if you host your website Cloudflare Pages.)

First, requirements:

1. You'll need to create a free <a href="https://cloudflare.com" target="_blank">Cloudflare</a> account.

2. You need to own a domain. I suggest <a href="https://domains.cloudflare.com" target="_blank" data-umami-events="tunnel-guide-cf-domains">Cloudflare</a> itself, alternately <a href="https://porkbun.com" target="_blank" data-umami-events="tunnel-guide-porkbuns">Porkbun</a> or <a href="https://namecheap" target="_blank" data-umami-events="tunnel-guide-namecheap">Namecheap</a>. (Or literally any domain registrar you prefer.) You can get cheap domains, like those ending with `.cc` or `.us`, often for less then $10 or even as low as $4 to $5. This is the price for the first year, to hook you, but annual domain renewals can cost more after that first year, so do your research. _Cloudflare_ sells their domains at cost, so the renewal is usually only a couple dollars more than the initial price, which is why I usually prefer them. Alternately you could set up something like <a href="https://www.duckdns.org" target="_blank" data-umami-events="tunnel-guide-">DuckDNS</a> or some other Dynamic DNS to avoid buying a domain, but you're on your own there -- domains are so cheap I've never bothered.

3. You'll need a website. I won't be explaining how to build a website here, you can just code one from scratch with HTML and CSS if you know how, or you can use a static site generator, of which there are many. If you want to get a quick website up and running I suggest <a href="https://astro.build" target="_blank" data-umami-events="tunnel-guide-astro">Astro</a> since it has a good blog template and is easy to learn. (It's what I used to build this blog!)

4. _A Linux server_. I specifically use _Debian 12_, but these instructions should work for any distro. This might be possible on Windows using WSL2 and Docker Desktop, but I wouldn't suggest it.

5. Though they can be run bare metal, I like to run both _Cloudflare Tunnel_ and _Ngnix_ as Docker containers so that everything is portable and easily repeatable. So you'll need to install Docker and all it's dependencies, which I'll explain below.

## The website

Like I said, I'm not explaining how to build a website here. Assuming you used **Astro** as I suggested, use the command `npx run build` or `yarn build` to build the site for deployment. It will output to a `/dist` directory, these static files are what we will serve to the internet.

Make a note of the full path to your website's output directory, for example `/home/bob/sites/my-cool-blog/dist`.

## Install Docker and set up the Nginx container

For the most hassle-free method of installing Docker, I suggest using their official install script with the following command:

```bash
curl -fsSL https://get.docker.com | sh
```

Next we'll setup _Nginx_ as our **webserver**, websites need a webserver to serve their pages to be viewed on a browser. I use the <a href="https://hub.docker.com/_/nginx" target="_blank" data-umami-events="tunnel-guide-nginx-docker">official Nginx docker container</a>, ol' reliable. I'll be using `docker compose` to set it up. Within the root directory of your site, create the file `compose.yaml` and add the below to it:

```yaml
services:
  site:
    restart: unless-stopped
    container_name: site
    image: nginx:mainline-alpine-slim
    volumes:
      - /home/bob/sites/my-cool-blog/dist/:/usr/share/nginx/html/
    ports:
      - 8888:80
```

I like to use the `mainline-alpine-slim` tag for the Nginx image because it's the smallest and most up to date, but there are <a href="https://hub.docker.com/_/nginx/tags" target="_blank">many other tags</a> if you prefer. Make sure the local port, `8888` above, does not conflict with any other self-hosted services you may have. Feel free to change it to anything else.

Still in the site's root directory we want to create a `nginx.conf` file and add the below to it for a basic configuration:

```nginx
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

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> If you changed the local port in the `compose.yaml` file, make sure you change it in the `nginx.conf` too.

Finally, still in the site's root directory, use the command `docker compose up -d` to download the Nginx container image and run the webserver using the parameters from the compose file and configuration file. Based on the settings above, _Nginx_ will serve the static files from **/dist** directory on the machine's **network port 8888**. You should be able to access it by going to it's IP address and adding the port, for example `http://192.168.1.100:8888`.

If you only want to self-host a site that you can access from within your home network, and you don't want to expose it to the internet, then you're done! Otherwise, read on to expose it to the internet with a Cloudflare Tunnel, without need to open ports on your router.

## Add a domain in Cloudflare

Create your <a href="https://dash.cloudflare.com/sign-up" target="_blank" data-umami-events="tunnel-guide-cf-signup">free Cloudflare account</a> if you haven't already. **If you bought a domain on Cloudflare, you can skip to the next section since it is auto-configured already.** If your domain is from another registrar, we'll need to add it to Cloudflare:

1. On the Cloudflare dashboard _Account Home_, click the **+ Add a domain** button.

2. Enter your domain, leave _Quick scan for DNS records_ selected, and click **Cotinue**.

![Adding a domain to Cloudflare.](../../img/blog/cloudflare-domain.png 'Adding a domain to Cloudflare')

3. Click on the **Free plan** at the bottom and click **Continue**.

![Cloudflare free plan.](../../img/blog/cloudflare-free.png 'Cloudflare free plan')

4. You'll see your DNS records, if there are any. Don't worry about this right now and click on the **Continue to activate** button.

![DNS management page.](../../img/blog/cloudflare-dns-records1.png 'DNS management page')

5. You'll see a pop-up window saying you should set your DNS records now, click on **Confirm**.

![Add DNS records pop-up.](../../img/blog/cloudflare-dns-records2.png 'Add DNS records pop-up')

6. Now you'll be provided some instructions to update the nameservers on your domain's registrar, _open a new tab and follow those instructions_. Once you've added the Cloudflare nameservers at your registrar, go back to Cloudflare and click on **Continue**.

7. Now you'll have to wait a few minutes for the changes to propagate, then click on **Check nameservers** and reload the page. If it's still shows _Pending_ next to the domain at the top, just keep waiting and reload again after a few more minutes.

8. Once the domain is _Active_, you're ready to set up the Cloudlare Tunnel.

## Create and configure the Cloudflare tunnel

In the Cloudflare dashboard, from your domain's _Overview_ page, click on **Access** on the sidebar, and then on the next page click **Launch Zero Trust**. Once you're in the Zero Trust dashboard, do the following:

1. On the sidebar, go to **Network** and choose **Tunnels** from the dropdown.

![Creating a Cloudflare Tunnel.](../../img/blog/cloudflare-tunnel1.png 'Creating a Cloudflare Tunnel)

2. Click on **Add a tunnel**, then on the next page choose **Select Cloudflared**.

![Selecting a connector type.](../../img/blog/cloudflare-tunnel2.png 'Selecting a connector type)

3. On the following page name your tunnel, then click **Save tunnel**.

![Naming the Tunnel.](../../img/blog/cloudflare-tunnel3.png 'Naming the Tunnel')

4. Finally you'll be given a `docker run` command for _cloudflared_, but we'll use `docker compose` instead. All we will need from here is the _tunnel token_.

![Docker run command for Cloudflared.](../../img/blog/cloudflare-tunnel4.png 'Docker run command for Cloudflared')

5. Open the `compose.yaml` file we created earlier and edit it to look like the below:

```yaml
services:
  site:
    restart: unless-stopped
    container_name: site
    image: nginx:mainline-alpine-slim
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

6. Add the _tunnel token_ to the `TUNNEL_TOKEN=` environmental variable, then save the file and let's run docker compose again. (It will automatically add `cloudflared` and restart the `nginx` container.)

```bash
docker compose up -d
```

7. Once the container is up and running, at the bottom your connector status should be **Connected**. Once the tunnel is Connected, click the **Next** button.

![Connector showing status Connected.](../../img/blog/cloudflare-tunnel5.png 'Connector showing status Connected')

6.  Now you'll be in the _Route Traffic_ page, under the **Public Hostnames** we have to add some things. For our purposes (hosting a site at the root of `your-domain.com`) you should leave the **Subdomain** empty. If you prefer for your site to be accessible at, say, `blog.your-domain.com` then set that subdomain here.

7. For **Domain** type in `your-domain.com`.

9. Leave the **Path** empty, unless you want the URL to be something like `your-domain.com/blog`.

10. Under _Service_, for **Type** select `HTTP` (not HTTPS) from the dropdown menu.

11. For **URL**, put the full LAN (internal) IP address of the machine that will host the site, and append the port you set for the docker container -- for example `192.168.1.100:8888`. (Don't use `localhost:8888` despite what the example says, that never works for me.)

![Route traffic page.](../../img/blog/cloudflare-tunnel6.png 'Route traffic page')

12. When done filling everything in, click **Save**.

Now you will be back at the **Tunnels** page. Under **Your tunnels**, the tunnel you just created should appear and still show **Healthy** status.

![Tunnel showing Healthy status.](../../img/blog/cloudflare-tunnel7.png 'Tunnel showing Healthy status')

Finally, we need to configure SSL for the website!

1. From the _Cloudflare Zero Trust_ dashboard, click on the **back arrow** next to your account name at the top of the sidebar to return to the regular Cloudflare dashboard.

2. Click on your domain and then click on **SSL/TLS** on the sidebar.

3. You'll now be in the _SSL/TLS Overview_, click the **Configure** button.

![SSL/TLS encryption page.](../../img/blog/cloudflare-ssl1.png 'SSL/TLS encryption page')

4. Select _Automatic SSL/TLS (default)_ then click **Save**.

![Configuring encryption mode.](../../img/blog/cloudflare-ssl2.png 'Configuring encryrption mode')

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> If you run into any HTTPS errors later when trying to access your site, come back to this page and try instead to select _Custom SSL/TLS_ and choose **Full (Strict)** or **Full** instead. _Automatic_ should work in most cases, though.

Now you should be able to visit `https://your-domain.com` and see your website!

## Set up a redirect

Right now, going to `your-domain.com` should work, but you may notice that going to `www.your-domain.com` does not. Normally you'd set up an _A record_ in your webhost's DNS settings, but Cloudflare Tunnels work a little differently -- they don't use A records. Instead, we'll set up a _CNAME_ for `www`, point it at the tunnel ID, and create a redirect rule.

First, let's add the _CNAME record_.

1. On the Cloudflare dashboard, click on your domain, then on the sidebar open the **DNS** dropdown and click **Records**.

2. On the next page, click the **Add record** button.

3. Under **Type** choose _CNAME_.

4. Under **Name** type in `www`.

5. Under **IPv4 address** put in your tunnel ID. (If you need the ID, just copy and paste it from your primary CNAME record.)

6. Click the **Save** button.

Now for the **redirect rule**.

1. On the Cloudflare dashboard, click on your domain, then on the sidebar open the **Rules** dropdown and click **Redirect Rules**.

2. Click the **Add rule** button, and on the next page give your rule a name.

3. In the **If...** section, under _When incoming requests match..._ click the radio button for **Custom filter expression**.

4. Below _When incoming requests match..._, ignore the dropdowns and instead click on **Edit expression**.

5. In the Expression Editor, type in the following:

```
(http.request.full_uri contains "www.your-domain.com")
```

6. In the **Then...** section, for **Type** choose _Dynamic_ from the dropdown.

7. Under **Expression** type in the following:

```
concat("https://","your-domain.com",http.request.uri.path)
```

8. Leave the **Status code** as 301 and click **Deploy**.

Now when you go to `www.your-domain.com` it should redirect to `your-domain.com`.

## Configure HTTP response headers on Cloudflare

Though optional, it's always good practice to set up your HTTP response headers on any website you host. If you check your site on <a href="https://securityheaders.com/" target="_blank" data-umami-events="tunnel-guide-securityheaders">securityheaders.com</a> you'll probably have an F grade. A lot of tech blogs don't bother with this, most that I have checked get a D+ at best, so don't think it's required by any stretch. However, if you feel like going that extra step to get an A+, here is how:

1. Login to Cloudflare and on the sidebar go to **Rules** -> **Transform Rules**, choose the **Managed Transforms** tab.

2. Under **HTTP response headers** click the switch for **Add security headers** to enable it.

3. Next choose the **Modify Response Header** tab and click **Create Rule**.

4. Name the rule (e.g. "CSP headers"), scroll down to **If...** and choose **All incoming requests**.

5. Scroll down to **Then...** and in the **Select item...** dropdown choose **Set static** -- click the **Set new header** button again to add a second rule, and choose **Set static** for it as well.

6. We're going to add two rules. In the first rule, for **header name** type in the `content-security-policy` and for **value** type in `upgrade-insecure-requests`.

7. For the second rule, for **header name** type in `permissions-policy` and for **value** type in `geolocation=(self)`.

Note that for the `permissions-policy` I've chosen to disable everything since I don't use these features on my blog. If you plan to use something, for example geolocation, you'd have to instead use `geolocation=self`. (See more about <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy" target="_blank" data-umami-events="tunnel-guide-mdn-permission-policy">Permission Policy at MDN Docs</a>.)

Once that is done, click the **Deploy** button. Wait a few minutes, then check your security headers again, and now it should be A+.

## Reference

- <a href="https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/" target="_blank" data-umami-events="tunnel-guide-docs-add-site">Cloudflare Docs - Add a site</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/remote/" target="_blank" data-umami-events="tunnel-guide-docs-tunnels">Cloudflare Docs - Tunnels</a>
- <a href="https://developers.cloudflare.com/fundamentals/basic-tasks/manage-subdomains#set-up-redirects" target="_blank" data-umami-events="tunnel-guide-docs-subdomains-redirects">Cloudflare Docs - Manage subdomains, Set up redirects</a>
- <a href="https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard" target="_blank" data-umami-events="tunnel-guide-docs-redirect-rule">Cloudflare Docs - Create redirect rule</a>
- <a href="https://blog.cloudflare.com/transform-http-response-headers" target="_blank" data-umami-events="tunnel-guide-cfblog-transform-headers">Cloudflare Blog - Modifying HTTP response headers with Transform Rules</a>

### Related Articles

> <a href="/blog/setup-cloudflare-tunnel-to-access-self-hosted-apps/" data-umami-event="tunnel-guide-to-tunnel-selfhosted-apps">Setup a Cloudflare Tunnel to securely access self-hosted apps with a domain from outside the home network</a>

> <a href="/blog/expose-plex-with-cloudflare/" data-umami-event="tunnel-guide-related-expose-plex-tunnel">How to securely expose Plex from behind CGNAT with Cloudflare Tunnel</a>