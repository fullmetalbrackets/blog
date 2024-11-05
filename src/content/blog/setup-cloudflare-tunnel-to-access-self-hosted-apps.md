---
title: "Setup a Cloudflare Tunnel to securely access self-hosted apps with a domain from outside the home network"
description: "Cloudflare Tunnels have been around for a few years and are well regarded alternatives for VPNs or port-forwarding on a router. They are often used to expose access to self-hosted apps from outside the local network with minimal config or hassle. Here's how it's done."
pubDate: 2023-07-20
updatedDate: 2024-07-12
tags:
  - cloudflare
---

## Sections

1. [Pre-Requisites](#pre)
2. [Add a domain to Cloudflare](#domain)
3. [Create the Cloudflare Tunnel](#tunnel)
4. [Configure OAuth with Google](#oauth)
5. [Create an access policy](#policy)
6. [References](#ref)

<div id="pre" />

## Pre-Requisites

This guide is assumes you already have a _Linux_ machine with Docker installed and a container you want to expose up and running. For the examples below I'll be using _Navidrome_ because that's what I set this up for in the first place and it just works. However, most self-hosted apps should work the same if you access it at, for example, `192.168.0.200:4533`.

Apps that have to be accessed through a specific path (like `/admin` or `/web`) and have no redirect from the index page may act weird when it comes time to proxy the tunnel. I always run into this issue with _Ubooquity_ in particular and haven't figured out how to fix it. I won't be trying to deal with that here.

The process of setting up and securing a Cloudflare Tunnel is a lot of steps, so I'm basically paraphrasing the <a href="https://developers.cloudflare.com/cloudflare-one" target="_blank">Cloudflare Zero Trust Docs</a>. When in doubt, refer back to them.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> I usually try to include images when making guides, but this is already going to be huge and I try to be as terse as possible. As a result there's no pretty pictures in this post, just a lot of reading step-by-step instructions on configuring various settings.

<div id="domain" />

## Add a domain to Cloudflare

This assumes you already own a domain from another registrar, like Namecheap or Porkbun, and just want to add it to Cloudflare. Alternately, you can register a new domain with Cloudflare, but I'm not going over how to do that here. It's pretty easy, anyway.

1. Login to Cloudflare, go to _Websites_ on the sidebar if you're not already there, and click the _Add a site_ button.

2. Enter your domain and click _Add site_, then click on the _Free_ plan at the bottom and click _Continue_.

3. The waiting a few moments for the DNS quick scan, you should see your domain's DNS records appear. Click on _Continue_.

4. Cloudflare will now present you with the URLs to two _nameservers_, should be something like `adam.ns.cloudflare.com`. Leave this page open, we'll come back to it.

5. Login to the registrar that owns your domain, go into your domain's settings, and change the DNS nameservers to both of the URLs provided by Cloudflare.

I tend to use _Namecheap_, so I can tell you if your domain is with them, go to _Domain List_ and click _Manage_ next to the domain you want to add. Next to _Nameservers_ choose _Custom DNS_ from the dropdown list, add the two Cloudflare nameservers, and click the _green checkmark_ to finish.

6. Back in Cloudflare, click _Done, check nameservers_. It could take up to 24 hours for the change to propagate, but usually it will take less than an hour, and often less than 20 minutes. In the meantime, follow the _Quick Start Guide_.

7. Leave _Automatic HTTPS Rewrites_ checked as-is, and activate the checkbox for _Always Use HTTPS_.

8. Leave _Brotli_ on. On the summary, click _Finished_.

9. You'll be back at your site's Overview. If you still see `Complete your nameserver setup`, you can try using the _Check nameservers_ button. In my experience that makes the DNS changes occur within a few minutes.

Once your DNS changes have propagated, the Overview page will say: _"Great news! Cloudflare is now protecting your site!"_ That means you're good to go.

<div id="tunnel" />

## Create the Cloudflare Tunnel

Go to the Cloudflare Zero Trust dashboard by clicking _Access_ on the sidebar, then click on _Launch Zero Trust_ to open it in a new tab. Once at the dashboard, do the following:

1. On the sidebar, go to _Network_ -> _Tunnels_.

2. Click the _Create a tunnel_ button, give it a name, and click _Save tunnel_.

3. The next page gives you instructions on how to run the connector. It varies based on how you want to do it, but is self-explanatory. Copy and paste the command provided into your server's terminal to run `cloudflared`. Give it a minute or two, then check Cloudflare -- reload the page if necessary or wait a few minutes, your tunnel will eventually show as <em>Healthy status</em>. Once it does, move on to the next step.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> If want to run `cloudflared` as a container with **Docker Compose** (rather than the `docker run` command), copy and paste the command into <a href="https://www.composerize.com" target="_blank">Composerize</a>. Or you can just <a href="https://gist.github.com/fullmetalbrackets/1b762a2688b81ce6b6f36fd174b335a1" target="_blank">check out this gist I made</a> to run Navidrome and Cloudflared together as a stack, which is how I have it set up. (That way I can start up and take down the stack as needed with `docker compose up` and `docker compose down`, or with one click through <em>Portainer</em>.)

4. Next you'll be on the _Route traffic_ page. Under _Public hostnames_ type in your sub-domain (i.e. `music`) and then your domain. Below that under _Services_, for _Type_ choose _HTTP_ (*not HTTPS*), and for _URL_ enter your local IP address and port of the service you''re exposing, e.g. `192.168.0.200:4533`. To finish, click the _Save tunnel_ button.

5. Now, to verify everything is working as intended, go to _DNS_ -> _Records_ on the sidebar. You should see a `CNAME` record pointing the `music` sub-domain to a URL like `5e126941-1234-8e13-4d80-02fe21084a62.cfargotunnel.com`. (The alpha-numeric string is your tunnel ID.)

You should be done! Go to `https://music.your-domain.com` and you should reach the Navidrome UI! However, you're not the only one with access, technically anyone with the URL can reach it unabated.

Although Navidrome, like many self-hosted services, has username and passwords for login, you can also put authentication services in front of the tunnel to stop unauthorized visitors from even reaching your app. Read on...

<div id="oauth" />

## Configure OAuth with Google

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> You'll need a Google account to set this up, which you already do with Gmail. You'll be using that email to do some stuff on **Google Cloud Platform**. It's totally free for what we're doing.

1. Go to <a href="https://cloud.google.com" target="_blank">Google Cloud Platform</a> and go to _Console_ at the top-right. On the next page click the _dropdown menu_ at the top-left and go to _New Project_. Name the project and click _Create_.

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

<div id="policy" />

## Create an access policy

Now that the OAuth provider is set up, we need make use of it with <a href="https://developers.cloudflare.com/cloudflare-one/policies/access/policy-management/" target="_blank">Access Policies</a>.

1. In Zero Trust, go to _Access_ -> _Applications_ -> _Add an application_.

2. Select _Self-Hosted_. Under _Application Configuration_, name the application `Navidrome` and choose session duration. Add the sub-domain you want to use (e.g. `music`) and the domain you transferred to Cloudflare earlier.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
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

### Success!

Now when you go to `https://music.your-domain.com` you should be met with a Google account login page. Login with the email you added and you should hit the Navidrome UI.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> If you get any DNS errors when trying to access your domain after adding OAuth with the above steps, but didn't have any issues before that, you may be hitting your ad blocker. I didn't have issues with Pi-Hole, but when testing behind NextDNS I did get `NXDOMAIN` errors.<br><br>
> <a href="https://help.nextdns.io/t/p8h5c71/keep-getting-nxdomain-for-well-known-sites" target="_blank">See this post</a> on NextDNS Help Center. <em>TLDR:</em> Try disabling DNSSEC for your domain on the Cloudflare dashboard and see if that resolves the issue. (I have not tested it.)

## Related Articles

> [Complete guide to self-hosting a website through Cloudflare Tunnel](/blog/self-host-website-cloudflare-tunnel)

> [How to securely expose Plex from behind CGNAT with Cloudflare Tunnel](/blog/expose-plex-with-cloudflare)

<div id="ref" />

## References

- <a href="https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/" target="_blank">Cloudflare Docs - Add a site</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/remote/" target="_blank">Cloudflare Docs - Tunnels</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/routing-to-tunnel/dns/" target="_blank">Cloudflare Docs - Routing traffic to a tunnel</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/google/" target="_blank">Cloudflare Docs - Identity</a>
- <a href="https://developers.cloudflare.com/cloudflare-one/policies/access/policy-management/" target="_blank">Cloudflare Docs - Policy Management</a>
