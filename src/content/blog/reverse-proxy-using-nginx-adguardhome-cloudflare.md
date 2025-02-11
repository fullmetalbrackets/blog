---
title: "Setting up a reverse proxy for HTTPS with a custom domain using Nginx Proxy Manager, AdGuard Home and Cloudflare"
description: "I've used a reverse proxy to access my self-hosted apps and services for years, and used Pi-Hole as my home network DNS for even longer, but recently switched to AdGuard Home. That meant redoing all my DNS records within AdGuard so I could get my reverse proxy back up and running, and I decided to write down the steps I took. When done, we'll be able to access our apps and services through a custom domain, with unique sub-domains for each app or service, with full HTTPS and accessible only locally."
pubDate: 2025-01-28
updatedDate: 2025-02-03
tags:
  - self-hosting
---

## Sections

1. [Pre-Requisites and Caveats](#pre)
2. [Setting up AdGuard Home as network DNS server](#adguard)
3. [Adding DNS rewrites in AdGuard Home](#dns)
4. [Add a domain in Cloudflare](#domain)
5. [Install and configure Nginx Proxy Manager](#nginx)
6. [References](#ref)

<div id='pre' />

## Pre-Requisites and Caveats

I wrote previously about <a href="/blog/reverse-proxy-using-nginx-pihole-cloudflare/" target="_blank" data-umami-event="reverse-proxy-adguard-to-pihole-proxy">how to set this up using Pi-Hole</a>, but I recently bought a <a href="https://www.gl-inet.com/products/gl-mt6000" target="_blank" data-umami-event="reverse-proxy-adguard-glinet">GL.iNet Flint 2 router</a> which has AdGuard Home built-in, so it seemed a waste not to use it. (Also for as great as Pi-Hole is, I have had to redo it multiple times over the years due to database errors or just a dead mini SD card or USB drive, etc.) So, this guide will be mostly based on my old one, with just the parts dealing with Pi-Hole replaced with AdGuard Home, since setting up Nginx Proxy Manager and Cloudflare work the same as always.

This guide uses specific third-party services, namely <a href="https://cloudflare.com" target="_blank" data-umami-event="reverse-proxy-adguard-cf-site">Cloudflare</a>, <a href="https://adguard.com/en/adguard-home/overview.html" target="_blank" data-umami-event="reverse-proxy-adguard-agh-site">AdGuard Home</a> and <a href="https://nginxproxymanager.com" target="_blank" data-umami-event="reverse-proxy-adguard-npm-site">Nginx Proxy Manager</a> to set up a secure local-only reverse proxy. The same is possible with other tools, apps and services including <a href="https://pi-hole.net" target="_blank" data-umami-event="reverse-proxy-adguard-pihole-site">Pi-Hole</a> (which as I mentioned, I previously used for many years) or <a href="https://nextdns.io" target="_blank" data-umami-event="reverse-proxy-adguard-nextdns">NextDNS</a> instead of *AdGuard Home*, <a href="https://caddyserver.com" target="_blank" data-umami-event="reverse-proxy-adguard-caddy">Caddy</a> or <a href="https://traefik.io" target="_blank" data-umami-event="reverse-proxy-adguard-traefik">Traefik</a> instead of *Nginx*, any other DNS provider instead of *Cloudflare*, etc. I'm only writing about my preferred tools that I've used multiple times to set everything up and keep it running for over a year.

This guide will require a owned custom top-level domain (TLD), such as a `.com` or `.cc` or `.xyz`, etc. Certain TLDs can be bought for super cheap on <a href="https://namecheap.com" target="_blank">Namecheap</a> or <a href="https://porkbun.com" target="_blank">Porkbun</a>, but be aware in most cases after the first year or two, the price will see a steep jump. I again prefer <a href="https://domains.cloudflare.com" target="_blank" data-umami-event="reverse-proxy-adguard-cf-domains">Cloudflare</a> for purchasing domains, since they always price domains at cost, so you won't see any surprise price hike one year to the next. An alternative I won't be getting into is using dynamic DNS, as I've not had to use it myself, so I honestly wouldn't even know how to begin to set that up.

<div id='adguard' />

## Setting up AdGuard Home as network DNS server

In my case, AdGuard Home already comes installed and ready to use on the GL.iNet Flint 2 router, requiring only toggling it on from the router's web admin UI to activate. If you want to run it bare metal on a server, see <a href="https://github.com/AdguardTeam/AdGuardHome#getting-started" target="_blank" data-umami-event="reverse-proxy-adguard-agh-getting-started">their getting started guide</a>. If you want to run AdGuard Home in a Docker container, this `compose.yaml` should work for you as a base.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> Please note, I have never run AdGuard Home in a Docker container myself, I'm just using common sense defaults to get up and running fast. Using `network_mode: host` allows all necessary network ports, including `53` for DNS (which **must** be available for DNS resolution to work), port `3000` for the _web UI_, , `853` for _DNS over TLS_, etc.
>
> Check out <a href="https://hub.docker.com/r/adguard/adguardhome" target="_blank" data-umami-event="reverse-proxy-adguard-agh-docker">the Docker Hub page for AdGuard Home</a> if you want to expose specific ports, or want to make other changes not covered here.

```yaml
services:
  adguardhome:
    image: adguard/adguardhome
    container_name: adguardhome
    network_mode: host
    restart: unless-stopped
    volumes:
      - /local/path/adguardhome/work:/opt/adguardhome/work
      - /local/path/adguardhome/conf:/opt/adguardhome/conf
```

When ready, use command `docker compose up -d` to download and run the container as a daemon in the background. (If you're already running a stack of containers, you can add the above to your existing compose file.)

Next you'll need to set the IP address of AdGuard Home as the _DNS server_ in your router. (If you're setting this up on the _Flint 2_, skip this part because it's automatically configured.) Each router is different, but generally you're looking for the *DNS server* setting, usually located within a router's *DHCP settings*. If your router lets you set a custom DNS server, enter the _IP address_ of the machine running **AdGuard Home** here, e.g. `192.168.0.50`.

However, not all routers let you set a custom DNS server (this is especially common in ISP-provided routers), in which case you are out of luck -- you will have to manually set the AdGuard Home IP address as the DNS in network settings on a per-device basis. If this is undesirable or unfeasable, and if your router lets you turn off it's DHCP server, you might consider using *Pi-Hole* instead since it can act as a DHCP server for your network.

Once AdGuard Home is being broadcast as the network's DNS server by the router, your devices will gradually begin querying it as they renew their DHCP leases. You can usually force a renew by restarting a device, or just reboot the router and it should propagate the changes to all devices.

<div id='dns' />

## Add DNS rewrites in AdGuard Home

Next, we'll go into the _AdGuard Home web UI_ and add the DNS rewrites we need for Nginx Proxy Manager. The web UI should be accessible via your browser at `http://<ip-address>:3000`.

1. In the AdGuard Home web UI, click on **Filters** on the navigation bar at the top, and choose **DNS Rewrites** from the dropdown menu.

2. Click on the **Add DNS rewrite** button.

3. Add a your domain as a wildcard like `*.domain.com`, and under that the IP address of the server running your services, e.g. `192.168.0.50`, then click on **Save**.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> If you want to proxy services from more than one server, create specific entries for each one rather than using a wildcard -- for example, `service1.domain.com` would point to `192.168.0.50`, `service2.domain.com` would point to `192.168.0.100`, etc.
>
> This is also the case you want to proxy something straight to `domain.com` rather than a sub-domain, make sure to create a specific DNS rewrite for it, e.g. `domain.com` pointing to `192.168.0.200`.

That's all you have to do with AdGuard Home. Next, we'll be using Cloudflare to get the TLS certificates for our custom domain.

<div id='cloudflare' />

## Add a domain in Cloudflare

You'll need to create a free account on Cloudflare. (Feel free to use another DNS provider if you prefer.) You can add a domain bought from another registrar to Cloudflare by following the below instructions, or if you purchase a domain on Cloudflare it will automatically be configured and you can skip this section.

To add an existing domain to Cloudflare:

1. On the Cloudflare dashboard _Account Home_, click the **+ Add a domain** button.

![Adding a domain to Cloudflare.](../../img/blog/cloudflare-domain.png 'Adding a domain to Cloudflare')

2. Enter your domain, leave _Quick scan for DNS records_ selected, and click **Cotinue**.

3. Click on the **Free plan** at the bottom and click **Continue**.

![Cloudflare free plan.](../../img/blog/cloudflare-free.png 'Cloudflare free plan')

4. You'll see your DNS records, if there are any. Don't worry about this right now and click on the **Continue to activate** button.

![DNS management page.](../../img/blog/cloudflare-dns-records1.png 'DNS management page')

5. You'll see a pop-up window saying you should set your DNS records now, click on **Confirm**.

![Add DNS records pop-up.](../../img/blog/cloudflare-dns-records1.png 'Add DNS records pop-up')

6. You'll be provided some instructions to update the nameservers on your domain's registrar, open a new tab and follow those instructions. Once you've added the Cloudflare nameservers at your registrar, go back to Cloudflare and click on **Continue**.

7. Now you'll have to wait a few minutes for the changes to propagate, then click on **Check nameservers** and reload the page. If it's still shows _Pending_ next to the domain at the top, just keep waiting. In the meantime, we need to do some additional setup.

8. From your domain's _Overview_ scroll down and you'll see a section at the bottom-right called **API** with a _Zone ID_ and _Account ID_. Under that, click on **Get your API token**.

9. Click the button **Create Token**, then click the **Use template** button next to _Edit DNS Zone_.

10. Under _Permissions_, leave the first entry as is, click on **+Add more**.

11. For the new Permission, choose in order from the dropdown menus **Zone**, **Zone** and **Read**.

12. Under _Zone Resources_, leave the first two dropdown menus as is, and in the final dropdown all the way to the right, **select your domain**. Scroll past everything else,without changing anything else, click on **Continue to summary**, and finally on the **Create Token** button.

13. On the next page you'll see your **API token**, make sure to _save it somewhere because it will not be shown again_. We will need this **API token** for to provision the TLS certificates in Nginx Proxy Manager.

14. Once your domain is _Active_ in Cloudflare, you can move on to the next section.

<div id='nginx' />

## Install and congifure Nginx Proxy Manager

If you don't have Docker installed already and need to do it from scratch, I suggest using Docker's own install script by running the command `curl -fsSL get.docker.com | sudo sh`. I'll be using `docker compose` to install and run _Nginx Proxy Manager_, it's the easiest way to run long-term containers.

Create a `compose.yml` file, use the below as a base. (If you are also running AdGuard Home as a container, I'd suggest putting them both on one compose file.)

```yaml
services:
  nginx-proxy-manager:
    container_name: nginx-proxy-manager
    image: "jc21/Nginx-proxy-manager:latest"
    ports:
      - 81:81 # web UI port
      - 80:80
      - 443:443
    volumes:
      - /opt/docker/nginx:/data
      - /opt/docker/letsencrypt:/etc/letsencrypt
    restart: unless-stopped
```
> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> Make sure that ports `80` and `443` are available on your server and not being used by anything else! _Nginx Proxy Manager_ needs port `80` for _HTTP_ and port `443` for _HTTPS_.

This compose file uses <a href="https://docs.docker.com/engine/storage/#bind-mounts" target="_blank" data-umami-event="reverse-proxy-adguard-docker-bind-mounts">bind mounts</a> to store container data in specific directories on the host, as I find this easier to migrate than <a href="https://docs.docker.com/engine/storage/#volumes" target="_blank" data-umami-event="reverse-proxy-adguard-docker-volumes">volumes</a>. (If you save your site on <a href="https://github.com" target="_blank">GitHub</a> you can just clone it and install it anywhere.)

Be sure to type in your own local path to where you want the data from Nginx Proxy Manager to live in your server, e.g. `/home/bob/docker/..` etc. and run the following command within the same directory where the compose file is located:

```bash
docker compose up -d
```

If you are running **Portainer** and want to create the container(s) from within it's UI -- rather than creating the compose file and using commands in the terminal -- do the following:

1. In the _Portainer_ web UI, go into your environment and click **Stacks** from the sidebar.

2. Click the **+ Add Stack** button at the top-left. Name the stack, copy and paste the contents of the `compose.yaml` above into the web editor.

3. Once done, scroll down and click the **Deploy the stack** button.

Whichever method you use, wait a few moments while the image is downloaded and the container is created. Once it's up and running we can login to the Nginx Proxy Manager web UI at `http://<ip-address>:81` where the IP is the server running Nginx Proxy Manager.

![Nginx Proxy Manager login screen.](../../img/blog/nginxproxy1.png 'Nginx Proxy Manager login screen')

Go into the Nginx Proxy Manager web UI at `http://<your-ip-address>:81`, login with the default email `admin@example.com` and password `changeme`, and as soon as you login go to _Users_ on the nav bar, and change (ideally) both the email and password of the administrator account.

To add proxy hosts click on **Hosts** on the navigation bar at the top, then click the **Add Proxy Host** button.

We'll create an entry for Plex first, which is running as a container on the same host at port 32400. You'll begin in the **Details** tab.

![Creating a proxy host.](../../img/blog/nginxproxy3.png 'Creating a proxy host')

1. Under _Domain Names_ type in `*.domain.com` and click the `Add *.domain.com` dropdown that appears. Make sure to include the `*` as this will create a wildcard certificate for use with all subdomains.

2. Leave _Scheme_ as `http`.

3. For _Forward Hostname/IP_ type in your server IP.

4. For _Forward Port_ type in `32400`.

5. Toggle on **Websockets Support** and **Block Common Exploits**, but leave caching off.

6. Go to the **SSL** tab, click under _SSL Certificate_ and select **Request a new SSL Certificate** from the dropdown.

![Configuring SSL on proxy host.](../../img/blog/nginxproxy4.png 'Configuring SSL on proxy host')

7. HTTPS should work with _Force SSL_ toggled off, but feel free to toggle it on if you prefer.

8. Toggle on **Use a DNS Challenge**, then under _DNS Provider_ choose `Cloudflare` from the dropdown.

9. Under _Credentials File Content_ you'll see see `dns_cloudflare_api_token=` followed by numbers. **Replace these numbers with your Cloudflare API token.**

10. At the bottom, type an email address (you'll get emails when your certificate is about to expire), toggle on that you agree to the Let's Encrypt TOS, and click **Save**.

Assuming you set up and entered your Cloudflare API token correctly, after a minute or two an SSL certificate will be provisioned and the proxy host will be created. Now you should be able to go to `https://plex.domain.com` and see your Plex UI with full HTTPS.

To add additional proxy hosts, repeat the process as above (changing the forward port to the one used by each specific app you are proxying), but when you get to the _SSL tab_ choose your now existing `*.domain.com` certificate from the dropdown, then proceed to choose _Cloudflare_ as DNS provider and enter the _API token_. This process has to be done each time you add a new proxy host.

Always make sure the full URL you want to use (`subdomain.domain.com`) is added to the _CNAME Records in Pi-Hole_ (or whatever DNS server you use in your home network) pointing to the server running Nginx Proxy Manager as target.

If something does not work as intended (503 error or the like), fiddle with the proxy host options -- try both `http` and `https` scheme, try toggling _Force SSL_ on and off, double-check your API token is correct, etc. You can also check the Nginx Proxy Manager container logs with the terminal command `docker logs nginx-proxy-manager`. (Or whatever `container_name` you used in the compose file when creating the container.)

Barring any errors, once you set up all your proxy hosts in Nginx Proxy Manager you should have full HTTPS when going to your services via `https://subdomain.domain.com`.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> One last thing, if you want to want to access the AdGuard Home web UI via HTTPS as well, be sure to use its default HTTPS network port *3001* in Nginx Proxy Manager.

## Related Articles

> []()

> [](//)

<div id='ref' />

## Reference

- <a href="https://adguard.com/en/adguard-home/overview.html" target="_blank" data-umami-event="reverse-proxy-adguard-agh-site">Website of AdGuard Home</a>
- <a href="https://nginxproxymanager.com" target="_blank" data-umami-event="reverse-proxy-adguard-npm-site">Website of Nginx Proxy Manager</a>
- <a href="https://github.com/NginxProxyManager/nginx-proxy-manager" target="_blank" data-umami-event="reverse-proxy-adguard-npm-gh">GitHub of Nginx Proxy Manager</a>

## Related Articles

> <a href="/blog/reverse-proxy-using-nginx-pihole-cloudflare/" data-umami-event="reverse-proxy-adguard-related-reverse-proxy-pihole">Setting up a reverse proxy for HTTPS with a custom domain using Nginx Proxy Manager, Pi-Hole and Cloudflare</a>

> <a href="/blog/self-host-website-cloudflare-tunnel/" data-umami-event="reverse-proxy-adguard-related-tunnel-guide">Complete guide to self-hosting a website through Cloudflare Tunnel</a>
