---
layout: "../../layouts/BlogPost.astro"
title: "Set up and configure Pi-Hole for network-wide ad blocking"
description: "I've been using Pi-Hole for a few years, and I just recently set it up again on a new machine with a new router. It's stupid easy and super effective, here's how."
pubDate: "October 8, 2022"
updatedDate: "October 16, 2022"
tags:
  - Self-Hosting
  - Pi-Hole
  - Linux
---

## Sections

1. [Installing Pi-Hole](#install)
2. [Configuring DNS](#dns)
3. [Using adlists to block domains](#adlist)
4. [Advanced DNS settings](#advanced)
5. [Further steps](#further)
6. [Reference](#ref)

<br>

> **ⓘ &nbsp;Note**<br><br> This guide is to install Pi-Hole bare-metal, if you prefer to install as a Docker container, read <a href="https://github.com/pi-hole/docker-pi-hole/#running-pi-hole-docker" target="_blank">the official Pi-Hole instructions for Docker</a>.

<div id='install' />

## Installing Pi-Hole

Before anything, make sure the server you're installing Pi-Hole on <a href="https://arieldiaz.codes/blog/set-static-ip-debian" target="_blank">has a static IP</a>, the installer will bug you about this too. Also, Pi-Hole will run a webserver at ports 80 and 443, for serving the web UI page, so make sure no other webserver like Apache or NGinx is running.

The quickest and easiest way to install Pi-Hole is via their provided shell script:

```bash
curl -sSL https://install.pi-hole.net | bash
```

Executing the script will prompt a number of dialogs, pay attention and make sure you input all the correct information.

> &#x26a0;&#xfe0f; &nbsp;**Important!**<br><br> Make sure to take note of the admin password provided at the end of the install process, you'll need it to login to the Web UI. Ideally you should change the admin password with `pihole -a -p newpassword`.

Now you should be able to access the Pi-Hole Web UI at either `http://pi.hole/admin`, or use the IP address or hostname, e.g. `http://192.168.1.250/admin` or `http://hostname/admin`.

<div id='dns' />

## Configuring DNS

In order for Pi-Hole to work network-wide for all devices (including phones and tablets on Wi-Fi), you'll need to configure your router to use the Pi-Hole server as DNS. The method differs for every router, and some do not have the option at all. (AT&T's Arris BGW210-700 for example.) Google is your friend here.

> **ⓘ &nbsp;Note**<br><br>If your router does not have the option of setting a DNS server, you won't be able to block ads for all devices on your network automatically. Instead you'll have to <a href="https://discourse.pi-hole.net/t/how-do-i-configure-my-devices-to-use-pi-hole-as-their-dns-server/245#3-manually-configure-each-device-9" target="_blank">configure each device's DNS</a>.

<a href="/img/blog/dns1.png" target="_blank"><img src="/img/blog/dns1.png" alt="Screenshot of DNS settings." /></a>

These are my personal settings, I use Cloudflare's 1.1.1.1 as the upstream DNS, but use which ever you prefer. Under _interface settings_ the recommended setting of "Allow only local requests" is the most secure option and Pi-Hole should work as intended with it checked.

<div id='adlist' />

## Using adlists to block domains

On the Pi-Hole web UI, click on _Adlists_ on the navigation bar:

<a href="/img/blog/adlist.png" target="_blank"><img src="/img/blog/adlist.png" alt="Screenshot of Pi-Hole UI showing Adlists section." /></a>

The most efficient way to block URLs in Pi-Hole is to use an adlist, which is a list of URLs to block en masse. (You can also blacklist individual URLs from the _Domains_ section of the UI.) Pi-Hole comes with a default adlist that blocks around 300k URLs, but there's many more adlists curated by the community. Here are the ones I use:

- <a href="https://firebog.net" target="_blank">The Firebog</a>
- <a href="https://github.com/blocklistproject/Lists" target="_blank" rel="noreferrer noopener">The Block List Project</a>
- <a href="https://www.github.developerdan.com/hosts" target="_blank" rel="noreferrer noopener">Developer Dan's Adlists</a>
- <a href="https://github.com/badmojr/1Hosts" target="_blank" rel="noreferrer noopener">1Hosts</a> (I suggest Lite or Pro)
- <a href="https://oisd.nl" target="_blank" rel="noreferrer noopener">OISD</a>
- <a href="https://github.com/mmotti/pihole-regex/blob/master/regex.list" target="_blank" rel="noreferrer noopener">This gist of Regex Expressions</a>

Once you've added all the adlists (and any time you add additional ones), make sure to "update gravity" for the changes to take effect. Go to _Tools_ on the navigation bar, click on _Update Gravity_, and click the big _Update_ button. Do not leave the page until the process is done!

You may end up with several million "domains on adlists" as shown in the dashboard. Don't panic. You'll see your dashboard stats explode with blocked requests, especially from mobile devices. Pay attention to any issues you have visiting websites and using online apps/services that you commonly do, and whitelist domains as needed. (You can also use a <a href="https://github.com/anudeepND/whitelist" target="_blank">curated whitelist</a>.)

<a href="/img/blog/adlist.png" target="_blank"><img src="/img/blog/blocked.png" alt="Screenshot of over 3 million domains blocked on Pi-Hole dashboard." /></a>

<div id='advanced' />

## Advanced DNS Settings

By default the dashboard will show all clients as IP addresses, but there's a few methods to show hostnames instead. (Or `hostname.domain`) The easiest way is to use _Conditional Forwarding_, though it does not work with every router.

Go to _Settings_ on the navigation bar, click on the _DNS_ tab, and scroll down to _Advanced DNS settings_.

<a href="/img/blog/dns2.png" target="_blank"><img src="/img/blog/dns2.png" alt="Screenshot of Conditional Forwarding setting." /></a>

Check the box to _Use Conditional Forwarding_, enter your network information, and hit Save. Check the dashboard and see if that's enough to display hostnames instead of IP addresses.

If the hostnames are not showing (sometimes it takes a minute), go back to _Advanced DNS settings_.

<a href="/img/blog/dns3.png" target="_blank"><img src="/img/blog/dns3.png" alt="Screenshot of advanced DNS settings." /></a>

The above settings should be checked for more security, but try unchecking one or both to see if they make the hostnames show. If not, it's possible your router does not broadcast a local domain.

You'll have to manually add each device's IP address and hostname/domain. Go to _Local DNS_ on the navigation bar, and click on _DNS Records_.

<a href="/img/blog/dns4.png" target="_blank"><img src="/img/blog/dns4.png" alt="Screenshot of add new domain/IP combination page." /></a>

Alternately, you can manually edit the `/etc/hosts` file on the server running Pi-Hole. You can bind an IP to a hostname, domain or any other alias.

```ini
# /etc/hosts

192.168.1.200   hostname1
192.168.1.215   hostname2
192.168.1.230   mydomain.tld
192.168.1.245   laptop
```

After saving your changes to the file, use the following command for them to take effect.

```bash
pihole restartdns
```

<div id='further' />

## Further steps

If you've been following the instructions, you're all set to block ads. Pi-Hole will act as a middleman between you and your chosen DNS (1.1.1.1 for example), blocking ads, tracking and telemetry. If you want your setup to be more private, consider <a href="https://docs.pi-hole.net/guides/dns/unbound/#setting-up-pi-hole-as-a-recursive-dns-server-solution" target="_blank">setting up a recursive DNS with unbound</a>, that way you bypass public DNS servers like Cloudflare and Google entirely.

Pi-Hole will automatically update the gravity database every Sunday between 3:00 AM and 5:00 AM, but if you're using regularly updated community-maintained adlists, you should consider using `cron` to automate updating the gravity every day or two. Use `cronjob -e` and place in the below to (for example) update gravity everyday at 5:00AM.

```bash
0 5 * * * pihole -g
```

When an update to Pi-Hole, FTL or the Web Interface is available (usually the Pi-Hole team will update all three at the time same), you can easily update your Pi-Hole instance in the terminal by using the command `pihole -up`. Pi-Hole will not update on it's own, so you have to do it manually. (If running Pi-Hole in a docker container, you'll have to restart the container to make it download the newest image, rather than using `pihole -up`.)

If you'd rather update Pi-Hole during off-hours, like in the middle of the night, I suggest using `at` -- it lets you use schedule a one-time task for a later time, similar to `cron` but non-recurring. (The syntax for `at` is also more human-readable than `cron`.) For example, the below command will schedule `pihole -up` to be executed at 5:00 AM:

```bash
pihole -up | at 5AM
```

Finally, you should regularly create a backup of your Pi-Hole configuration. Doing so is simple, just to go the web UI, click on _Settings_, then go to the _Teleporter_ tab and click the _Backup_ button. This will download a `tar.gz` file to the computer you're accessing the web UI from, and within this same screen you can restore from a backup file if necessary. You might consider committing your backups to a private GitHub repo too.

<div id='ref' />

## Reference

- <a href="https://docs.pi-hole.net" target="_blank">Pi-Hole documentation</a>
- <a href="https://man7.org/linux/man-pages/man8/cron.8.html" target="_blank">Cron man page</a> / <a href="https://man7.org/linux/man-pages/man5/crontab.5.html" target="_blank">Crontab man page</a>
- <a href="https://man7.org/linux/man-pages/man1/at.1p.html" target="_blank">At man page</a>
