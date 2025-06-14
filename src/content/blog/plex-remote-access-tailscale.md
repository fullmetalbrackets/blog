---
title: "How to get around the Plex Pass requirement for Plex remote access by using Tailscale"
description: "Beginning April 29th, 2025 the pricing for Plex Pass increased at the same time that remote access got paywalled behind it. That means you can no longer stream your own content outside of your home network, like say on your phone or tablet while at work or on vacation, without paying for Plex Pass. You can get around this by using Tailscale to remotely access your Plex server from other devices while still appearing as local traffic, which does not require Plex Pass."
pubDate: 2025-06-13
tags:
  - tailscale
---

> I have been told, and also have seen others report on Reddit, that Plex considers Tailscale IPs to be external and thus will not allow access unless you have a <a href="https://www.plex.tv/plans/" target="_blank">Plex Pass subscription</a> or the external users have a <a href="https://support.plex.tv/articles/remote-watch-pass-overview/" target="_blank">Remote Watch Pass</a>.
>
> Per <a href="https://www.reddit.com/r/Tailscale/comments/1kes22h/comment/mqpp8l4/" target="_blank">this comment on the Tailscale subreddit</a>, it will work if you set up the Plex server as both subnet router and exit node, and set the external device to use the Plex server as exit node. I have a lifetime Plex Pass myself and only use Tailscale to punch through CGNAT, so unfortunately I am unable to test this. (However, I can confirm that with Plex Pass, this works without advertising subnet routes or exit node.) I have added instructions below on how to setup the Plex server and both subnet router and exit node. It's possible that only one or the other is required, so I suggest trying first subnet router and see if that works -- if it does not, then advertise your Plex server as exit node and have your external device use it.
>
> Please feel free to [contact me](mailto:contact@fullmetalbrackets.com) and let me know if it does or does not work!

## About Plex and the service changes

<a href="https://plex.tv/personal-media-server/" target="_blank" umami-data-event="plex-remote-access-to-plex-site">Plex Media Server</a> is a self-hosted media server that lets you stream your owned (ripped, downloaded, or otherwise acquired) media from other devices on the same network, through a web-based GUI (access via browser) or dedicated app. (Say, on a smart TV or Roku device.) Plex lets you stream videos and music through a slick Netflix-like user interface, and Plex also offers the excellent <a href="https://plex.tv/plexamp/" target="_blank" umami-data-event="plex-remote-access-to-plexamp">Plexamp</a> music player app for Android and iOS devices, so you can stream music on the go through a dedicated UI. Plex can also let you view photos, but this feature is nothing to write home about, in my opinion -- stream movies and TV shows is Plex's bread and butter, with built-in fetching of metadata, posters, etc.

Plex Media Server has a built-in feature called <a href="https://support.plex.tv/articles/200289506-remote-access/" target="_blank" umami-data-event="plex-remote-access-to-remote-access-docs">Remote Access</a> that can be configured from the web UI. By enabling Remote Access, and forwarding network port 32400 from your router (ideally with some firewall rules for security), you can access Plex from other devices using your account, like a phone or tablet. It also allows you to share your media library externally with other users, allow them to access your server and stream the shared content. (This does not to work behind CGNAT, however, which is why I started using Tailscale for remote access and <a href="/blog/expose-plex-tailscale-vps/" target="_blank" umami-data-event="plex-remote-access-to-expose-plex-tailscale">library sharing</a> in the first place.)

The remote access feature has always been free until the Plex service changes and price increases on April 29, 2025. From this day forward, remote access is now locked behind <a href="https://www.plex.tv/plans/" target="_blank" umami-data-event="plex-remote-access-to-plex-pass">Plex Pass</a>. If you bought a Plex lifetime pass before that date it was $119, with occasional sales as low as $80, but after the change it now costs a whopping $250 for the lifetime pass. That's a more than 100% increase on the base price!

The monthly Plex Pass subscription also rose from $4.99 to $6.99 per month, a less egregious price increase. However, keep this in mind -- at the old prices, a lifetime pass of $120 was roughly equivalent to two years at $5/month, so it paid for itself after two years. With the new pricing structure, a $250 lifetime pass is roughly equivalent to three years at $7/month. No matter how you slice it, the value proposition is less than before.

So basically if you're running a Plex server on your home network, a Plex Pass will be required both for accessing your own content from your own devices outside your network (remote access), and also for allowing other users to access shared library content. If you only care about sharing with others, each of those other accounts you've shared with can choose to pay for their own <a href="https://support.plex.tv/articles/remote-watch-pass-overview/" target="_blank" umami-data-event="plex-remote-access-to-watch-pass">Remote Watch Pass subcription</a> at $2.99, which will allow them to access your shared content without you, the owner of the Plex server, having to pay for Plex Pass. (Keep in mind that _hardware transcoding_ has always been locked behind Plex Pass and this has not changed.)

## About Tailscale

Tailscale is a mesh VPN service that lets you connect multiple devices across multiple networks seamlessly and securely. It uses NAT traversal to punch through firewalls and obviate the need for port forwarding, and communication between devices occurs through encrypted WireGuard tunnels, so really it's even more secure than regular Plex remote access where you're exposing a port to the internet. The cool part is that by using Tailscale, we can skip the Plex Pass requirement for remotely accessing our own content, since the Plex server and other devices will act as if they are on the same network. Technically, _they will be on the same network_ since all machines running Tailscale are placed in the same <a href="https://tailscale.com/kb/1136/tailnet" target="_blank" umami-data-event="plex-remote-access-tailscale-to-expose-plex-vps">Tailnet</a>. So this won't even run afoul of the Plex terms of service.

## Pre-Requisites

This guide assumes you have a Plex server already set up and that it's running on Linux. I won't go into how to install Plex here, <a href="/blog/setting-up-plex-in-docker/" target="_blank" umami-data-event="plex-remote-access-tailscale-to-setup-plex">see this article</a> for detailed instructions on running Plex as a Docker container in Linux.

Note that I use plain Linux to run Plex in a Docker container, there may be additional configuration needed to run Plex on Proxmox, TrueNAS, Synology, etc. I can't help you with that, since I don't run Plex on any of those and have no interest in doing so.

This post will instruct you on how to run Tailscale on the same machine running Plex, but alternately you can run Tailscale on a separate machine in your network and configure it as subnet router. I won't cover that here, <a href="/blog/comprehensive-guide-tailscale-securely-access-home-network/#setting-up-a-subnet-router" target="_blank" umami-data-event="plex-remote-access-tailscale-to-comprehensive-guide">see this section of my comprehensive Tailscale guide</a> or check out <a href="#" target="_blank" umami-data-event="plex-remote-access-tailscale-docs-subnets">the Tailscale documentation</a> for details.

I'll provide instructions to install and configure Tailscale on the Plex server and on other devices, specifically a Windows laptop and Android tablet. (It should work similar on iOS, the apps look identical at least, but I don't have an iOS device to confirm this myself.)

## Set up Tailscale on Plex server

Go to the <a href="https://tailscale.com" target="_blank" umami-data-event="plex-remote-access-tailscale-to-tailscale-site">Tailscale website</a> and create an account. This will create your <a href="https://tailscale.com/kb/1136/tailnet" target="_blank" umami-data-event="plex-remote-access-tailscale-to-tailnet-docs">Tailnet</a> (private mesh network for all your Tailscale-connected devices) with your newly created account as the Owner and which you'll manage through the web-based <a href="https://login.tailscale.com/admin" target="_blank">admin console</a>.

Once you've got the account created, use the following command on the Plex server terminal to install Tailscale:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

Once it's finished installing, use the command `sudo tailscale up` and go to the provided URL and login to authenticate the node with your Tailscale account. You should then see the server listed under _Machines_ in the Tailscale admin console. (The rest of this guide will assume your Plex server's machine name is `plex`, but take note of what the name is in your case.)

This next part is optional, but I think it's a good idea, which is to _rename your Tailnet_. On the admin console go to the **DNS** tab. Notice that the Tailnet name is something auto-generated like `tailfe8c.ts.net`. You can keep this if you want, but you may want to change it to a "fun name" that is more human-readable and easier to remember. You can't just type one in, instead you choose from ones generated by Tailscale.

![Choosing a tailnet fun name.](../../img/blog/tailscale-fun-name.png 'Choosing a tailnet fun name')

Click the **Rename tailnet...** button and follow the prompts. You can keep reloading until you find a fun name you like. For future examples, we'll assume your tailnet name is `royal-marmot.ts.net` and therefore the Plex server's domain is `plex.royal-marmot.ts.net`.

## Configuring the Plex server as subnet router and exit node

As explained at the top, it seems Plex remote access and library sharing will not work without this. (If you have Plex Pass and are only using Tailscale to punch through CGNAT, then you can skip this part.) First, in order to use either subnet routing or exit node, you need to enable IP forwarding on the server. (This is straight from the <a href="https://tailscale.com/kb/1019/subnets" target="_blank" data-umami-event="tailscale-post-docs-subnet">Tailscale docs</a>.)

If your machine has an `/etc/sysctl.d` directory (which most likely it does) then use these commands:

```sh
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
```

If your machine does NOT have the directory (`ls /etc/sysctl.d` returns `No such file or directory`) then instead use these commands:

```sh
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p /etc/sysctl.conf
```

Also, if you are running `firewalld` on your server, you should allow masquerading with the following command:

```sh
sudo firewall-cmd --permanent --add-masquerade
```

Now we'll advertise both the subnet routes and the exit node with this command: (This assumes your local IP addresses are `192.168.0.x`, make sure to use the appropriate subnet for your LAN!)

```sh
sudo tailscale up --advertise-routes=192.168.0.0/24 --advertise-exit-node
```

Now go to the admin console, on the **Machines** tab, and do the following:

1. Click the three dots to the right of the machine want you want to use as subnet router. (Notice the `subnets` tag.)

2. Choose **Edit route settings...** from the dropdown menu.

3. Click both checkboxes for **Subnet routes** and **Use as exit node**, then click the **Save** button to finish.

![Enabling subnets in Tailscale admin console.](../../img/blog/tailscale-subnets.png 'Enabling subnets in Tailscale admin console')

![Enabling exit node in Tailscale admin console.](../../img/blog/tailscale-exit-node.png 'Enabling exit node in Tailscale admin console')

> If you are running Tailscale on multiple machines in your home network, you should use the command `sudo tailscale up --accept-routes=false` on those other machines, that way they will keep using local routes (e.g. `192.168.0.x`) instead of going through the tailnet -- you don't want to access your local network resources through Tailscale when you're home!

## Set up Tailscale on a Windows Laptop and/or Android Phone

Now let's install Tailscale other devices you want to access Plex from, I'll walk you through installing and setting it up on Windows and Android, but for other clients go to the Tailscale admin console, click on the **Add device** button, and choose your client. Alternately just go to <a href="https://tailscale.com/download" target="_blank">this link</a> to see all the clients.

For Windows, go <a href="https://tailscale.com/download/windows" target="_blank">this link</a>, click the download button and follow the instructions on that page to set it up. You'll be taken to login with Tailscale and authenticate the device, then you're ready to go. When the Tailscale app is running and connected (you'll see the Tailscale icon in your system tray), you'll be connected to your tailnet -- make sure to click on the Tailscale icon, hover over **Exit nodes** and choose your Plex server from the menu.

For Android, either go to this link <a href="https://tailscale.com/download/android" target="_blank">this link</a> and use the QR code, or just go to the Google Play Store and download the app. (Make sure it's the official Tailscale app!) The app will be installed as a VPN, and when you login you'll be taken to Tailscale to authenticate the device. You'll use the Tailscale app to connect to your tailnet. To use the Plex server as exit node on your phone/tablet, open the Tailscale app, tap the **Exit Node** button at the top and the Plex server should appear as an option -- tap on it to use it as exit node.

If you're using a Linux device, there's no GUI for Tailscale, instead to use the Plex server as exit node use the following command in a terminal: (Make sure to use the machine name of your Plex server, or the server's Tailscale IP.)

```sh
sudo tailscale up --exit-node=plex
```

Now you should be able to access Plex on your browser at `http://plex.royal-marmot.ts.net:32400` when connected to Tailscale. However, watching Plex exclusively on the web UI is not a great experience, especially on phone and tablets. Let's do some additional configuration to be able to use Plex apps through Tailscale.

## Configure the Plex server for Plex apps

The following will be necessary if you want to use _Plex apps_ on phones, smart TVs, and other devices.

1. Go to the Plex web UI of your server on a browser, and click on the the _wrench icon_ at the top-right to go into **Settings**.

2. On the sidebar, scroll down to _Settings_ section and click on **Network**.

3. Next to _Secure connections_, choose **Preferred** from the downdown menu.

![Secure connections setting in Plex.](../../img/blog/expose-plex1.png 'Secure connections setting in Plex')

4. Make sure to **leave disabled** the checkbox for _Enable Relay_.

![Relay and Custom access URL settings in Plex.](../../img/blog/plex-remote-access1.png 'Relay and Custom access URL settings in Plex')

5. **This is the really important part.** Under _Custom server access URLs_ type in `https://plex.royal-marmot.ts.net:32400` as well as your Plex's server's Tailscale IP, i.e. `http://100.200.300.400:32400`. (Make sure to use **http** for this one, this is a fallback in case HTTPS does not work.) You can get the machine's Tailscale IP from the admin console.

6. Scroll down to the bottom of the page and click the **Save changes** button.

Now your Plex apps should be able to connect through Tailscale!

## References

- <a href="https://www.plex.tv/blog/important-2025-plex-updates/" target="_blank" umami-data-event="">2025 Plex Updates Announcement</a>
- <a href="https://www.plex.tv/plans/" target="_blank" umami-data-event="plex-remote-access-to-plex-pass">Plex Pass</a>
- <a href="https://support.plex.tv/articles/remote-watch-pass-overview/" target="_blank" umami-data-event="plex-remote-access-to-watch-pass">Plex Remote Watch Pass</a>
- <a href="https://tailscale.com/kb" target="_blank" umami-data-event="plex-remote-access-to-tailscale-docs">Tailscale Docs</a>
- <a href="https://tailscale.com/kb/1136/tailnet" target="_blank" data-umami-event="plex-remote-access-to-docs-tailnet">Tailnets</a>
- <a href="https://tailscale.com/kb/1081/magicdns" target="_blank" data-umami-event="plex-remote-access-to-docs-magidns">MagicDNS</a>
- <a href="https://tailscale.com/kb/1019/subnets" target="_blank" data-umami-event="plex-remote-access-to-docs-subnets">Subnet Routers</a>

### Related Articles

- <a href="/blog/tailscale/" umami-data-event="plex-remote-access-related-tailscale-guide">Comprehensive guide to setting up Tailscale to securely access your home network from anywhere</a>
- <a href="/blog/expose-plex-tailscale-vps/" data-umami-event="plex-remote-access-related-expose-plex-vps">How to securely expose Plex from behind CGNAT for library sharing using Tailscale and a free Oracle VM</a>