---
layout: "../../layouts/BlogPost.astro"
title: "Set up and configure Pi-Hole for network-wide ad blocking"
description: "I've been using Pi-Hole for a few years, and I just recently set it up again on a new machine with a new router. It's stupid easy and super effective, here's how."
pubDate: "October 8, 2022"
tags:
  - Pi-Hole
  - Linux
  - Command Line
---

## Sections

1. [Installing Pi-Hole](#install)
2. [Configuring DNS](#dns)
3. [Using adlists to block domains](#adlist)
4. [Advanced DNS settings](#advanced)
5. [Reference](#ref)

<br>
<div id='install' />

> **Note:** This guide is to install Pi-Hole bare-metal, if you prefer to install as a Docker container, read <a href="https://github.com/pi-hole/docker-pi-hole/#running-pi-hole-docker" target="_blank">the official Pi-Hole instructions for Docker</a>.

## Installing Pi-Hole

Before anything, make sure the server you're installing Pi-Hole on <a href="https://arieldiaz.codes/blog/set-static-ip-debian" target="_blank">has a static IP</a>, the installer will bug you about this too. Also, Pi-Hole will run a webserver at ports 80 and 443, for serving the web UI page, so make sure no other webserver like Apache or NGinx is running.

The quickest and easiest way to install Pi-Hole is via their provided shell script:

```bash
curl -sSL https://install.pi-hole.net | bash
```

Executing the script will prompt a number of dialogs, pay attention and make sure you input all the correct information.

> **Important!** Make sure to take note of the Web UI password provided at the end of the install process, you'll need it to login to the UI.

Now you should be able to access the Pi-Hole Web UI at either `http://pi.hole/admin`, or use the IP address or hostname, e.g. `hostname/admin`.

<div id='dns' />

## Configuring DNS

In order for Pi-Hole to work network-wide for all devices (including phones and tablets on Wi-Fi), you'll need to configure your router to use the Pi-Hole server as DNS. The method differs for every router, and some do not have the option at all. (AT&T's Arris BGW210-700 for example.) Google is your friend here.

> **Note:** If your router does not have the option of setting a DNS server, you won't be able to block ads for all devices on your network automatically. Instead you'll have to <a href="https://discourse.pi-hole.net/t/how-do-i-configure-my-devices-to-use-pi-hole-as-their-dns-server/245#3-manually-configure-each-device-9" target="_blank">configure each device's DNS</a>.

<a href="/img/dns1.png" target="_blank"><img src="/img/dns1.png" alt="Screenshot of DNS settings." /></a>

These are my personal settings, I use Cloudflare's 1.1.1.1 as the upstream DNS, but use which ever you prefer. Under _interface settings_ the recommended setting of "Allow only local requests" should be all you need to and is the most secure option.

<div id='adlist' />

## Using adlists to block domains

On the Pi-Hole web UI, click on _Adlists_ on the navigation bar:

<a href="/img/adlist.png" target="_blank"><img src="/img/adlist.png" alt="Screenshot of Pi-Hole UI showing Adlists section." /></a>

The most efficient way to block URLs in Pi-Hole is to use an adlist, which is a list of URLs to block en masse. (You can also blacklist individual URLs from the _Domains_ section of the UI.) Pi-Hole comes with a default adlist that blocks around 300k URLs, but there's many more adlists curated by the community. Here are the ones I use:

- <a href="https://firebog.net" target="_blank">The Firebog</a>
- <a href="https://github.com/blocklistproject/Lists" target="_blank">The Block List Project</a>
- <a href="https://www.github.developerdan.com/hosts" target="_blank">Developer Dan's Adlists</a>
- <a href="https://github.com/mmotti/pihole-regex/blob/master/regex.list" target="_blank">This gist of Regex Expressions</a>

Once you've added all the adlists (any time you add additional ones), make sure to "update gravity" for the changes to take effect. Go to _Tools_ on the navigation bar, click on _Update Gravity_, and click the big _Update_ button. Do not leave the page until the process is done!

You may end up with several "domains on adlists" as shown in the dashboard. Don't panic. You'll see your dashboard stats explode with blocked requests, especially from mobile devices. Pay attention to any issues you have visiting websites and using online apps/services that you commonly do, and whitelist domains as needed. (You can also use a <a href="https://github.com/anudeepND/whitelist" target="_blank">curated whitelist</a>.)

<a href="/img/adlist.png" target="_blank"><img src="/img/blocked.png" alt="Screenshot of over 3 million domains blocked on Pi-Hole dashboard." /></a>

<div id='advanced' />

## Advanced DNS Settings

By default the dashboard will show all clients as IP addresses, but there's a few methods to show hostnames instead. (Or `hostname.domain`) The easiest way is to use _Conditional Forwarding_, though it does not work with every router.

Go to _Settings_ on the navigation bar, click on the _DNS_ tab, and scroll down to _Advanced DNS settings_.

<a href="/img/dns2.png" target="_blank"><img src="/img/dns2.png" alt="Screenshot of Conditional Forwarding setting." /></a>

Check the box to _Use Conditional Forwarding_, enter your network information, and hit Save. Check the dashboard and see if that's enough to display hostnames instead of IP addresses.

If the hostnames are not showing (sometimes it takes a minute), go back to _Advanced DNS settings_.

<a href="/img/dns3.png" target="_blank"><img src="/img/dns3.png" alt="Screenshot of advanced DNS settings." /></a>

The above settings should be checked for more security, but try unchecking one or both to see if they make the hostnames show. If not, it's possible your router does not broadcast a local domain.

You'll have to manually add each device's IP address and hostname/domain. Go to _Local DNS_ on the navigation bar, and click on _DNS Records_.

<a href="/img/dns4.png" target="_blank"><img src="/img/dns4.png" alt="Screenshot of add new domain/IP combination page." /></a>

Alternately, you can manually edit the `/etc/hosts` file on the server running Pi-Hole. You can bind an IP to a hostname, domain or any other alias.

```ini
# /etc/hosts

192.168.1.200   hostname1
192.168.1.215   hostname2
192.168.1.230   mydomain.tld
192.168.1.245   laptop
```

After saving your changes to the file, use `pihole restartdns` for them to take effect.

<div id='ref' />

## Reference

- <a href="https://docs.pi-hole.net" target="_blank">Pi-Hole documentation</a>