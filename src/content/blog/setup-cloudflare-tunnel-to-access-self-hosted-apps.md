---
title: 'Setup a Cloudflare Tunnel to securely access self-hosted apps with a domain from outside the home network'
description: "Cloudflare Tunnels have been around for a few years and are well regarded alternatives for VPNs or port-forwarding on a router. They are often used to expose access to self-hosted apps from outside the local network with minimal config or hassle. Here's how it's done."
pubDate: 2023-07-20
updatedDate: 2025-02-03
tags: ['self-hosting', 'cloudflare']
related1: self-host-website-cloudflare-tunnel
related2: expose-plex-with-cloudflare
---

## Pre-Requisites

This guide is assumes you already have a _Linux_ machine with Docker installed and a container you want to expose up and running. For the examples below I'll be using _Navidrome_ because that's what I set this up for in the first place and it just works. However, most self-hosted apps should work the same if you access it at, for example, `192.168.0.100:4533`.

Apps that have to be accessed through a specific path (like `/admin` or `/web`) and have no redirect from the index page may act weird when it comes time to proxy the tunnel. I always run into this issue with _Ubooquity_ in particular and haven't figured out how to fix it. I won't be trying to deal with that here.

The process of setting up and securing a Cloudflare Tunnel is a lot of steps, so I'm basically paraphrasing the <a href="https://developers.cloudflare.com/cloudflare-one" target="_blank" data-umami-event="tunnel-apps-docs-zero-trust">Cloudflare Zero Trust Docs</a>. When in doubt, refer back to them.

## Add a domain to Cloudflare

If you purchased your domain with Cloudflare, you can skip this section since it will be auto-configured. If already own a domain from another registrar, like Namecheap or Porkbun, follow these instructions to add it to Cloudflare:

1. Log into Cloudflare and you'll be in _Account Home_, click the **+ Add a domain** button.

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

8. Once the domain is _Active_, you're ready

## Create the Cloudflare Tunnel

In the Cloudflare dashboard, from your domain's _Overview_ page, click on **Access** on the sidebar, and then on the next page click **Launch Zero Trust**. Once you're in the Zero Trust dashboard, do the following:

1. On the sidebar, go to **Network** and choose **Tunnels** from the dropdown.

![Creating a Cloudflare Tunnel.](../../img/blog/cloudflare-tunnel1.png 'Creating a Cloudflare Tunnel')

2. Click on **Add a tunnel**, then on the next page choose **Select Cloudflared**.

![Selecting a connector type.](../../img/blog/cloudflare-tunnel2.png 'Selecting a connector type')

3. On the following page name your tunnel, then click **Save tunnel**.

![Naming the Tunnel.](../../img/blog/cloudflare-tunnel3.png 'Naming the Tunnel')

4. Next you'll be given a `docker run` command to install and run the _cloudflared_ connector. You can just copy and paste this into your terminal to run the tunnel, but if you prefer to use `docker compose` instead (and I do), all we will need from here is the _tunnel token_.

![Docker run command for Cloudflared.](../../img/blog/cloudflare-tunnel4.png 'Docker run command for Cloudflared')

5. To run this in `docker compose`, first create a `compose.yaml` file and we'll add both _Navidrome_ and _Cloudflare Tunnel_ to it:

```yaml
services:
 tunnel:
  container_name: tunnel
  image: cloudflare/cloudflared
  command: tunnel run
  environment:
   - TUNNEL_TOKEN=<tunnel-token>
  restart: unless-stopped

 navidrome:
  container_name: navidrome
  image: deluan/navidrome:latest
  volumes:
   - <path-to-local-directory>/navidrome:/data
   - <path-to-local-directory>/music:/music:ro
  environment:
   ND_BASEURL: ''
   ND_SCANSCHEDULE: 1h
   ND_SESSIONTIMEOUT: 24h
   ND_LOGLEVEL: info
  network_mode: host
  depends_on:
   - tunnel
  restart: unless-stopped
```

6. Add the _tunnel token_ from Cloudflare to the `TUNNEL_TOKEN=` environmental variable in the compose file. Also customize your local data and music directories for Navidrome. Save the file and use the below command:

```bash
docker compose up -d
```

7. Once the containers are up and running, you should see in Cloudflare that your _connector status_ at the bottom is **Connected**. Once the tunnel is Connected, click the **Next** button.

![Connector showing status Connected.](../../img/blog/cloudflare-tunnel5.png 'Connector showing status Connected')

6. Now you'll be in the _Route Traffic_ page, under the **Public Hostnames** we have to add some things. First, add your desired **Subdomain**, for example, `music`. (You will then access Navidrome at `https://music.your-domain.com`.)

7. For **Domain** type in `your-domain.com`. (Make sure the domain is already _active_ in Cloudflare!) Leave the **Path** empty.

8. Under _Service_, for **Type** select `HTTP` (not HTTPS) from the dropdown menu.

9. For **URL**, put the full LAN (internal) IP address of the machine that will host the site, and append the Navidrome network port -- for example `192.168.0.100:4533`. (Don't use `localhost:4533` despite what the example says, that never works for me.)

![Route traffic page.](../../img/blog/cloudflare-tunnel6.png 'Route traffic page')

12. When done filling everything in, click **Save**.

Now you will be back at the **Tunnels** page. Under _Your tunnels_, the tunnel you just created should show **Healthy** status.

![Tunnel showing Healthy status.](../../img/blog/cloudflare-tunnel7.png 'Tunnel showing Healthy status')

All done! Go to `https://music.your-domain.com` and you should reach the Navidrome UI! However, you're not the only one with access, technically anyone with the URL can reach it unabated.

Although Navidrome, like many self-hosted services, has username and passwords for login, you can also put authentication services in front of the tunnel to stop unauthorized visitors from even reaching your app. Read on...

## Configure OAuth with Google

> It's been a while since I wrote this post and I don't use this set up anymore (<a href="/blog/tailscale/" target="_blank" data-umami-event="tunnel-apps-to-tailscale">I switched to Tailscale</a>), so if the rest of the guide doesn't work for you please <a href="mailto:contact@fullmetalbrackets.com?subject=The oauth section of your Cloudflare Tunnel guide is out of date!">let me know</a> and I'll update it in the future!

You'll need a Google account to set this up, which you already do with Gmail. You'll be using that email to do some stuff on **Google Cloud Platform**. It's totally free for this use case.

1. Go to <a href="https://cloud.google.com" target="_blank" data-umami-event="tunnel-apps-gcp">Google Cloud Platform</a> and go to _Console_ at the top-right. On the next page click the _dropdown menu_ at the top-left and go to _New Project_. Name the project and click _Create_.

2. On the project home page, go to _APIs & Services_ on the sidebar and select _Dashboard_.

3. On the sidebar, go to _Credentials_ and select _Configure Consent Screen_ at the top of the page.

4. Choose `External` as the _User Type_. Since this application is not being created in a Google Workspace account, any user with a Gmail address can login.

5. Name the application, add a support email, and input contact fields. Google Cloud Platform requires an email in your account.

6. (Optional) In the _Scopes_ section, add the `userinfo.email` scope. This is not required for the integration, but shows authenticating users what information is being gathered.

7. Return to the _APIs & Services_ page, select _Create Credentials_ -> _OAuth client ID_, and name the application.

8. Under _Authorized JavaScript origins_, in the _URIs_ field, enter your _team domain_. For example: `https://<your-team-name>.cloudflareaccess.com`

If you don't know it, go to the Cloudflare _Zero Trust dashboard_ -> _Settings_ -> _Custom Pages_ to see your team domain.

9. Under _Authorized redirect URIs_, in the _URIs_ field, enter your team domain followed by this callback at the end of the path: `https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback`

10. Google will present the _OAuth Client ID_ and _Secret_ values. The secret field functions like a password and should not be shared. Copy both values.

11. In Zero Trust, go to _Settings_ -> _Authentication_.

12. Under _Login methods_, select _Add new_. Choose _Google_ on the next page.

13. Input the _Client ID_ and _Client Secret_ fields generated by Google Cloud Platform previously.

14. (Optional) Enable _Proof of Key Exchange (PKCE)_. PKCE will be performed on all login attempts.

15. Select _Save_. Make sure to use the _Test_ link to make sure it works.

## Create an access policy

Now that the OAuth provider is set up, we need make use of it with <a href="https://developers.cloudflare.com/cloudflare-one/policies/access/policy-management/" target="_blank" data-umami-event="tunnel-apps-docs-policy-mgmt">Access Policies</a>.

1. In Zero Trust, go to _Access_ -> _Applications_ -> _Add an application_.

2. Select _Self-Hosted_. Under _Application Configuration_, name the application `Navidrome` and choose session duration. Add the sub-domain you want to use (e.g. `music`) and the domain you transferred to Cloudflare earlier.

> Ignore the warning about no DNS record found for this domain. Cloudflare is complaining about no A/AAAA records, but we don't need them for access via Tunnel.

3. (Optional) Leave the _Application Appearance_ the same, and if you'd like select _Custom Logo_ and paste in the Navidrome logo URL: `https://raw.githubusercontent.com/navidrome/navidrome/master/resources/logo-192x192.png`

4. Leave the _Block pages_ set to `Cloudflare default`, add a _Cloudflare error text_ if you'd like. (It has to be 75 characters or less.)

5. Under _Identity providers_ uncheck `Accept all available identity providers`, then check `Instant Auth`.

6. Click the _Next_ button at the bottom-right.

7. Type in a _Policy name_, as _Action_ choose `Allow`, and leave _Session duration_ as-is.

8. Under _Configure rules_ -> _Include_, select _Email_ and add an email address to _Value_.

9. (Optional) If you like even more security, click _+ Add require_ and choose _Country_ as selector and your home country as the _Value_.

10. (Optional) You can activate _Purpose justification_ which apparently emails an approval email each time there is a login, like a 2 factor auth. I don't bother with this, so I don't really know.

11. Click the _Next_ button.

12. Unless you know what you're doing, leave the all the additional settings alone. Just scroll to the bottom and click the _Add application_ button to finish.

Now when you go to `https://music.your-domain.com` you should be met with a Google account login page. Login with the email you added and you should hit the Navidrome UI.

> If you get any DNS errors when trying to access your domain after adding OAuth with the above steps, but didn't have any issues before that, you may be hitting your ad blocker. I didn't have issues with Pi-Hole, but when testing behind NextDNS I did get `NXDOMAIN` errors.<br><br>
> <a href="https://help.nextdns.io/t/p8h5c71/keep-getting-nxdomain-for-well-known-sites" target="_blank" data-umami-event="tunnel-apps-nextdns-nxdomain-errors">See this post</a> on NextDNS Help Center. <em>TLDR:</em> Try disabling DNSSEC for your domain on the Cloudflare dashboard and see if that resolves the issue. (I have not tested it.)

## Use WAF to whitelist your IP and block all others

For even more security, or maybe even in lieu of setting up Oauth, you can use Cloudflare's _Web Application Firewall_ to whitelist specific IP addresses and block the rest. This is totally optional, but I will show you how to do it.

1. On the Cloudflare dashboard, go to your domain, then click **Security** on the sidebar and choose **WAF** from the dropdown.

2. You'll be in WAF's _Managed rules_ page, click on **Custom rules**.

3. In the Custom rules page, scroll down to _Rules templates_, look for _Zone lockdown_ and click on **Use template**.

![Zone lockdown template.](../../img/blog/cloudflare-waf1.png 'Zone lockdown template')

4. The template have two rules. On the first one leave the _Field_ as **IP Source Address**, change _Operator_ to **is not equal to**, and for _Value_ enter your public IP address. (You can <a href="https://icanhazip.com" target="_blank" data-umami-event="tunnel-apps-icanhazip">find out what it is here.</a>)

5. Press the **X** next to the second _URI Path rule_ to delete it, we don't need it. Scroll down.

6. Under _Then take action..._ choose **Block** as the action. Now scroll to the bottom and click on **Deploy**.

![Editing the template.](../../img/blog/cloudflare-waf2.png 'Editing the template')

Now only your IP address should have access to `music.your-domain.com`. Be aware that if your IP address changes (and is common with residential ISPs unless you have a static IP), you will need to keep track of that and update the rule accordingly.

It is possible to <a href="https://developers.cloudflare.com/dns/manage-dns-records/how-to/managing-dynamic-ip-addresses" target="_blank" data-umami-event="tunnel-apps-cf-ddns">dynamically update DNS records in Cloudflare</a> via API or third-party tools, but I have not gone down this particular rabbit hole, so you're on your own there for now.

## References

- <a href="https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/" target="_blank" data-umami-event="tunnel-apps-docs-add-site">Cloudflare Docs - Add a site</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/remote/" target="_blank" data-umami-event="tunnel-apps-docs-tunnels">Cloudflare Docs - Tunnels</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/routing-to-tunnel/dns/" target="_blank" data-umami-event="tunnel-apps-docs-routing-traffic">Cloudflare Docs - Routing traffic to a tunnel</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/google/" target="_blank" data-umami-event="tunnel-apps-docs-identity">Cloudflare Docs - Identity</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/policies/access/policy-management/" target="_blank" data-umami-event="tunnel-apps-docs-policy-mgmt">Cloudflare Docs - Policy Management</a>
