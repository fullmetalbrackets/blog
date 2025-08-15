---
title: "How to expose Plex to share your library with others from behind CGNAT with Cloudflare Tunnel"
description: "Exposing Plex to share your library with other users normally involves port forwarding from the router, which is very insecure and not recommended. If your home network is behind CGNAT - very common with most ISPs nowadays -- you can't even port forward if you wanted to. Here's how I did it in a fairly secure way that limits access by using Cloudflare."
pubDate: 2024-07-15
updatedDate: 2025-08-15
tags:
  - cloudflare
---

## What and Why

Plex is a self-hosted media server that lets you stream your owned (or downloaded, or otherwise acquired) media from other devices on the same network, through a web-based GUI (access via browser) or dedicated app. (Say, on a smart TV or Roku device.) Plex has a built-in feature to share your media library externally, but that requires opening a port on your router and forwarding it to the Plex server. Setting aside that port forwarding can be dangerous if you don't know what you're doing, it won't work anyway if your home network is behind Carrier-Grade Network Address Translation, or CGNAT. Many ISPs use this, and so many homelabbers may find themselves unable to expose their services.

There are many solutions to get across CGNAT, using Cloudflare Tunnel for Plex fairly hassle-free. (However, it is technically against Cloudflare's terms of service. Details below.) Cloudflare Tunnel provides a secure connection to a network resource behind CGNAT and without exposing your public IP, by running a `cloudflared` daemon on your server. As a by-product, the traffic flows through Cloudflare's CDN and gets all the features that come with that, including security through their Web Application Firewall. In this post I will demonstrate how I have been sharing my Plex library through a Cloudflare Tunnel and only allowing access from specific IP addresses.

> You're probably much better off following <a href="/blog/expose-plex-tailscale-vps/" target="_blank" data-umami-event="expose-plex-cloudflare-to-tailscale-vps">this blog post share your Plex library sharing through CGNAT with Tailscale</a> instead of using a Cloudflare Tunnel as I write about in this article. Technically speaking, **Cloudflare Tunnel is NOT intended for routing video and audio streams**, it's intended purpose is exclusively for routing HTTP traffic for webpages. In fact, the <a href="https://www.cloudflare.com/service-specific-terms-application-services/#content-delivery-network-terms" target="_blank" data-umami-event="expose-plex-cloudflare-tos">Cloudflare Service-Specific Terms for their CDN</a> specifically state:
>
> _"Unless you are an Enterprise customer, Cloudflare offers specific Paid Services (e.g., the Developer Platform, Images, and Stream) **that you must use in order to serve video and other large files via the CDN**. Cloudflare reserves the right to disable or limit your access to or use of the CDN, or to limit your End Users’ access to certain of your resources through the CDN, **if you use or are suspected of using the CDN without such Paid Services to serve video** or a disproportionate percentage of pictures, audio files, or other large files."_
>
> In addition, <a href="https://developers.cloudflare.com/support/more-dashboard-apps/cloudflare-stream/delivering-videos-with-cloudflare/" target="_blank" data-umami-event="expose-plex-cloudflare-docs">the section of the Cloudflare documentation about delivering videos with Cloudflare</a> spells this out:
>
> _"Over time we recognized that some of our customers wanted to stream video using our network. To accommodate them, we developed our Stream product. Stream delivers great performance at an affordable rate charged based on how much load you place on our network. Unfortunately, while most people respect these limitations and understand they exist to ensure high quality of service for all Cloudflare customers, **some users attempt to misconfigure our service to stream video in violation of our Terms of Service**."_
> 
> Be aware that by using Cloudflare Tunnel, you are routing traffic through Cloudflare's CDN (can't have one without the other) and so using it with Plex violates their terms of services and may cause Cloudflare to limit or potentially outright ban your account. Cloudflare can see all traffic routed through their CDN and know when that traffic is video streaming. They may not care if it's just you streaming a Plex movie remotely once in a while and not using much bandwidth, but constant usage by multiple IPs will almost certainly rouse their attention and can lead to action being taken against you.
>
> I switched to <a href="/blog/expose-plex-tailscale-vps/" target="_blank" data-umami-event="expose-plex-cloudflare-to-tailscale-vps">sharing my library via Tailscale and a free Oracle Cloud instance</a>, which has worked great for over a year, and as a result I highly recommend it. By following the below guide to share your Plex library through a Cloudflare Tunnel, **you are going against the Cloudflare terms of service and risking your Cloudflare account**, so think carefully about this warning and whether it's worth it. You've been warned!

## Pre-Requisites

This guide will assume you are already running Plex, and you're just looking to add a Cloudflare Tunnel so that you can share your library with other users. To that end, you will need a <a href="https://cloudflare.com" target="_blank" data-umami-event="expose-plex-cloudflare-cf-site">Cloudflare account</a>.

You will either be running the Cloudflare Tunnel on the same server as Plex (preferable) or on another machine on the same network that has access to the Plex server. This guide assumes that all hardware is running _Linux_, since that is the only OS I've used to run either Plex or `cloudflared`. Other options are available, and you should be able to tweak these instructions to work on other platforms.

In addition, the usage of Cloudflare Tunnel requires owning a domain. (Using a Dynamic DNS like DuckDNS or No-IP will not work.) If you need to purchase one, I suggest <a href="https://namecheap.com" target="_blank" data-umami-event="expose-plex-cloudflare-namecheap">Namecheap</a>, <a href="https://porkbun.com" target="_blank" data-umami-event="expose-plex-cloudflare-porkbun">Porkbun</a> or Cloudflare themselves.

Finally, I'll be using _Docker_ in order to run the `cloudflared` daemon as a container. You can run the daemon bare metal, but I prefer doing it as a container for that additional layer of abstraction, and so I can easily shutdown and restart the Cloudflare Tunnel as needed.

So if you have not already, install docker with the following command: (This will execute a bash script to install Docker with all dependencies and add-ons.)

```bash
curl -fsSL https://get.docker.com | sh
```

## Add a domain in Cloudflare

Create your <a href="https://dash.cloudflare.com/sign-up" target="_blank" data-umami-event="expose-plex-cloudflare-signup">free Cloudflare account</a> if you haven't already. **If you bought a domain on Cloudflare, you can skip to the next section since it is auto-configured already.** If your domain is from another registrar, we'll need to add it to Cloudflare:

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

5. Create a `compose.yaml` file, copy and paste the below into it:

```yaml
services:
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

> If you run into any HTTPS errors later when trying to access your site, come back to this page and try instead to select _Custom SSL/TLS_ and choose **Full (Strict)** or **Full** instead. _Automatic_ should work in most cases, though.

Now you should be able to visit `https://your-domain.com` and see your website!
Now you should be able to go to `https://plex.your-domain.com` and you should reach the Plex UI and be prompted to login! However, right now Plex is fully exposed to the entire internet. We need to use Cloudflare's WAF to restrict access to only who we want!

## Configure security settings

First, we're going to enable some security features to block bots.

1. On the Cloudflare dashboard, go to **Security** -> **Bots** on the sidebar, and enable **Bot fight mode**.

![Enable bot fight mode on WAF.](../../img/blog/plex-cf0.png 'Enable bot fight mode on WAF')

2. Next, go to **Security** -> **WAF** on the sidebar.

3. Click the _Custom rules_ tab and then the **Create rule** button.

4. Name the **Rule** as `Block bots`, then scroll down to _When incoming requests match..._.

5. For **Field** choose `Known Bots`.

6. Under _Then take action..._ choose `Block` as the action.

7. Click on **Deploy** to finish.

![Creating WAF custom rule to block bots.](../../img/blog/plex-cf1.png 'Creating WAF custom rule to block bots')

For this next part, you will need the specific IP addresses of your external users, because we're going to make Cloudflare block _everyone_ except for those IP addresses. In most cases, even when ISPs don't offer a static IP, a specific customer's IP address rarely changes, so you should be safe doing this. On the rare occassion where a user's public IP address changes, you can just come in here and update it. Sometimes prioritizing security means dealing with inconvenience.

Now, we're going to create a rule that blocks EVERYONE except specific IPs.

1. On the Cloudflare dashboard, go to **Websites** and choose your domain.

2. On the sidebar, go to **Security** -> **WAF**.

3. Click the _Custom rules_ tab and then the **Create rule** button.

4. Name the **Rule** as `Restrict IPs`, then scroll down to _When incoming requests match..._.

5. For **Field** choose `IP Source Address`.

6. For **Operator** choose `does not equal`.

7. For **Value** type in the public IP address.

8. Repeat these steps for each IP address you want to allow access.

9. Under _Then take action..._ choose `Block` as the action.

10. Click on **Deploy** to finish.

![Creating WAF custom rule to restrict allowed IPs.](../../img/blog/plex-cf2.png 'Creating WAF custom rule to restrict allowed IPs')

Next, I like to create an additional rule that lets external users' IPs _skip_ the WAF altogether. This ensures those IPs can get in, and has the side-effect of making connections from these IPs show up as events in WAF, which is nice for monitoring. (They will show as _Skipped_ in the Events activity log.)

1. On the Cloudflare dashboard, go to **Websites** and choose your domain.

2. On the sidebar, go to **Security** -> **WAF**.

3. Click the _Custom rules_ tab and then the **Create rule** button.

4. Name the **Rule** as `Allow IPs to skip WAF`, then scroll down to _When incoming requests match..._.

5. For **Field** choose `IP Source Address`.

6. For **Operator** choose `equals`.

7. For **Value** type in the public IP address.

8. Repeat these steps for each IP address you want to allow access.

9. Under _Then take action..._ choose `Skip` as the action and enable the checkmarks for all WAF components.

10. Click on **Deploy** to finish.

![Creating WAF custom rule for allowed IPs to bypass WAF.](../../img/blog/plex-cf3.png 'Creating WAF custom rule for allowed IPs to bypass WAF')

Now let's set the order of these rules in WAF.

1. On the Cloudflare dashboard, go to **Security** -> **WAF** on the sidebar.

2. Click the _Custom rules_ tab and then the **Create rule** button.

3. Drag and drop the rules so that _Allow IPs to skip WAF_ is first, _Restrict IPs_ is second and _Block bots_ is third.

Finally, let's disable caching to minimize CDN usage by our external users and ensure all content always comes directly from the origin.

1. On the Cloudflare dashboard, go to **Websites** and choose your domain.

2. On the sidebar, go to _Caching_ and click _Cache rules_.

3. Click on **Create Rule**.

4. Name the **Rule** as `Disable caching`, then scroll down to _When incoming requests match..._.

5. For **Field** choose `Hostname` for field

6. For **Operator** choose `Equals`

7. For **Value** use your domain, e.g. `plex.your-domain.com`. (Leave out the HTTPS.)

6. Under _Cache eligibility_ choose _Bypass cache_.

7. Click on **Deploy** to finish.

![Creating cache rule to bypass CDN caching.](../../img/blog/plex-cf4.png 'Creating cache rule to bypass CDN caching')

## Configure Plex

One last thing! Although your external users can now stream your library by logging in to the the Plex web UI at `https://plex.your-domain.com`, using Plex apps will not work until you do the following:

1. On the Plex web UI, go to **Settings** by clicking on the _wrench icon_ at the top-right.

2. On the sidebar, scroll down to **Settings** and click **Network**.

3. Next to _Secure connections_, choose **Preferred** from the downdown menu.

4. (Optional) Scroll down and **enable** the checkbox for _Treat WAN IP as LAN Bandwitdh_.

5. Make sure to **leave disabled** the checkbox for _Enable Relay_.

6. Under _Custom server access URLs_ type in your tunnel URL, e.g. `https://plex.your-domain.com` (Make sure to include the HTTPS!)

7. At the bottom of the page, click the **Save changes** button.

Now your external users can access your library through their Plex apps too.

## Potential alternatives

There's always multiple ways to do things, and said I explained at the start, this method of sharing your Plex library may not be best. It's just what works for me, for now, so I figured I'd share it for others to try out. Some other alternatives that I've read about, but have not tried myself:

- <a href="https://tailscale.com" target="_blank" data-umami-event="expose-plex-cloudflare-alternatives-tailscale">Tailscale</a>, a Wireguard-based overlay network for connecting devices across different networks. As I mentioned at the top of this article, <a href="/blog/expose-plex-tailscale-vps/" target="_blank" data-umami-event="expose-plex-cloudflare-to-tailscale-vps">I chose to use Tailscale with a free Oracle VM to expose Plex</a> and strongly suggest it to anyone!

- <a href="https://www.zerotier.com" target="_blank" data-umami-event="expose-plex-cloudflare-alternatives-zerotier">Zero Tier</a>: I have not used it myself, but Zero Tier is a similar product to Tailscale for similar use cases, namely securely connecting to your network from outside. I have read of people using it to access Plex remotely, but it requires each external user to run Zero Tier. (Just like Tailscale.)

- <a href="https://zrok.io" target="_blank" data-umami-event="expose-plex-cloudflare-alternatives-zrok">Zrok</a>: A newer kid on the block, free to self-host. I've read enough to know that you can use it for secure peer-to-peer connections and use tunnels for public sharing, but no idea how it would work with Plex. I did find <a href="https://blog.openziti.io/its-a-zitiful-life" target="_blank" data-umami-event="expose-plex-cloudflare-zitiful-life">this blog post from December 2022</a> about using a component of OpenZiti called <a href="https://github.com/openziti/ziti-browzer-bootstrapper" target="_blank" data-umami-event="expose-plex-cloudflare-openziti-browzer">BrowZer</a> to remotely access Plex, but it seems they have not written anything further about this possible use case since then.

- Some others I've heard of, but have not touched or read about include <a href="https://ngrok.com" target="_blank" data-umami-event="expose-plex-cloudflare-alternatives-ngrok">Ngrok</a>, <a href="https://netmaker.io" target="_blank" data-umami-event="expose-plex-cloudflare-alternatives-netmaker">Netmaker</a> and <a href="https://netbird.io" target="_blank" data-umami-event="expose-plex-cloudflare-alternatives-netbird">Netbird</a>.

## References

- <a href="https://www.cloudflare.com/service-specific-terms-overview/" target="_blank" umami-data-event="expose-plex-cloudflare-ref-cf-tos">Cloudflare Service-Specific Terms</a>
- <a href="https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/" target="_blank" umami-data-event="expose-plex-cloudflare-ref-add-site">Cloudflare Docs - Add a site</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/remote/" target="_blank" umami-data-event="expose-plex-cloudflare-ref-tunnels">Cloudflare Docs - Tunnels</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/routing-to-tunnel/dns/" target="_blank" umami-data-event="expose-plex-cloudflare-ref-routing-tunnels">Cloudflare Docs - Routing traffic to a tunnel</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/google/" target="_blank" umami-data-event="expose-plex-cloudflare-ref-identity">Cloudflare Docs - Identity</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/policies/access/policy-management/" target="_blank" umami-data-event="expose-plex-cloudflare-policy-mgmt">Cloudflare Docs - Policy Management</a>

### Related Articles

- <a href="/blog/expose-plex-tailscale-vps/" umami-data-event="expose-plex-cloudflare-related-expose-tailscale-vps">How to securely expose Plex from behind CGNAT for library sharing using Tailscale and a free Oracle VM</a>
- <a href="/blog/self-host-website-cloudflare-tunnel/" umami-data-event="expose-plex-cloudflare-related-tunnel-guide">Complete guide to self-hosting a website through Cloudflare Tunnel</a>