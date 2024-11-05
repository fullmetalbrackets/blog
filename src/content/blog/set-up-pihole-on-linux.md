---
title: "Set up Pi-Hole for network-wide ad blocking and Unbound for recursive DNS"
description: "Besides just using a browser extension for ad blocking, I've been using Pi-Hole for years to prevent all devices on my network from getting ads, and stopping smart home devices from phoning home for telemetry and tracking. Pi-Hole will run on almost anything that can run Linux, is very easy to set up, and super effective with the right ad lists."
pubDate: 2022-10-08
updatedDate: 2024-10-05
tags:
  - pi-hole
---

## Sections

1. [Pre-Requisites and Caveats](#pre)
2. [Installing Pi-Hole bare metal](#baremetal)
3. [Installing Pi-Hole in a docker container](#container)
4. [Configuring DNS](#dns)
5. [Using adlists to block domains](#adlist)
6. [Advanced DNS settings](#advanced)
7. [Further steps](#further)
8. [Reference](#ref)

<div id='pre' />

## Pre-Requisites and Caveats

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> This guide is intended for a **bare metal** install of Pi-Hole and Unbound on a machine running Linux, whether a full server or single-board computer like Raspberry Pi, Le Potato, etc. Though <a href="https://hub.docker.com/r/pihole/pihole" target="_blank">Pi-Hole has an official Docker container</a> and it works same as a bare metal install, I've never needed or wanted to run it this way, and have no idea how to use it along with Unbound in another container. As a result, it won't be covered in this guide, but check out <a href="https://github.com/chriscrowe/docker-pihole-unbound" target="_blank">this project on GitHub</a> if that's what you're looking for.

Before anything, make sure the machine you're installing Pi-Hole on <a href="/blog/set-static-ip-debian" target="_blank">has a static IP</a>, the installer will bug you about this too. Also, Pi-Hole will run a web server at ports 80 and 443, for serving the web UI page, so make sure no other web server like Apache or NGinx is running.

When installing Pi-Hole on Ubuntu you may get an error message along the lines of this:

```bash
Error starting userland proxy: listen tcp4 0.0.0.0:53: bind: address already in use
```

This is because Pi-Hole includes `dnsmasq` which binds to port 53, but Ubuntu by default uses `systemd-resolved` on that port. If this happens, you'll need to disable `systemd-resolved` prior to installing Pi-Hole.

```bash
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved.service
```

Then edit the file at `/etc/resolv.conf` and change `nameserver 127.0.0.53` to `nameserver 9.9.9.9` (or whatever public DNS you prefer) to not break DNS resolution. Afterwards use `dig google.com` or `ping google.com` to verify DNS is still working, then proceed with installing Pi-Hole.

<div id='baremetal' />

## Installing Pi-Hole

The quickest and easiest way to install Pi-Hole is via their provided shell script:

```bash
curl -sSL https://install.pi-hole.net | bash
```

Executing the script will prompt a number of dialogs, pay attention and make sure you input all the correct information.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> A random password will be generated during install for logging in to the Pi-Hole web UI. You should change the admin password with `pihole -a -p newpassword` or if you don't want to login at all, leave it blank with `pihole -a -p`.

Now you should be able to access the Pi-Hole Web UI at either `http://pi.hole/admin`, or use the IP address or hostname, e.g. `http://192.168.1.250/admin` or `http://hostname/admin`.

<div id='unbound' />

## Installing Unbound

Unbound is available on most, if not all, Linux package managers and should be installed that way whenever possible. On Debian and Ubuntu, for example, you'd install with this command:

```bash
sudo apt install unbound
```

As per the <a href="https://docs.pi-hole.net/guides/dns/unbound" target="_blank">official docs</a>, we'll create a configuration file located at `/etc/unbound/unbound.conf.d/pi-hole.conf` with the below contents:

```bash
server:
    verbosity: 0

    interface: 127.0.0.1
    port: 5335
    do-ip4: yes
    do-udp: yes
    do-tcp: yes
    do-ip6: no

    prefer-ip6: no
    harden-glue: yes
    harden-dnssec-stripped: yes
    use-caps-for-id: no
    edns-buffer-size: 1232
    prefetch: yes
    num-threads: 1
    so-rcvbuf: 1m

    private-address: 192.168.0.0/16
    private-address: 169.254.0.0/16
    private-address: 172.16.0.0/12
    private-address: 10.0.0.0/8
    private-address: fd00::/8
    private-address: fe80::/10
```

Unbound should already be running when you installed it, let's restart it so the new config takes effect, and test that it's working:

```bash
sudo service unbound restart
dig pi-hole.net @127.0.0.1 -p 5335

;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 58337
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;pi-hole.net.                   IN      A

;; ANSWER SECTION:
pi-hole.net.            300     IN      A       3.18.136.52

;; Query time: 60 msec
;; SERVER: 127.0.0.1#5335(127.0.0.1) (UDP)
```

If your output looks similar to the above, then everything is working as intended.

<div id='dns' />

## Configuring DNS

Now we need to make Unbound the upstream DNS resolver for Pi-Hole. In the Pi-Hole web UI, go to **Settings** on the sidebar, then click on the **DNS** tab.

Uncheck any public DNS in the left column, and in the right column enable the checkmark under **Custom 1** and add `127.0.0.1#5335` as the server. Scroll down to the bottom and click the **Save**.

![Pi-Hole Upstream DNS Server setting.](../../img/blog/pihole-dns1.png)

You can also set **Interface settings** to _Permit all origins_, as long as the machine running Pi-Hole is not accessible from the internet (and especially port 53 is not exposed) then this is totally safe, and will ensure Pi-Hole receives and answers queries from every device in your network. You can try using **Allow only local requests** first and see if it works for you.

![Pi-Hole interface setting.](../../img/blog/pihole-dns2.png)

Next, in order for Pi-Hole to work network-wide for all devices (including phones and tablets on Wi-Fi), you'll need to configure your router to use the Pi-Hole server as DNS. Some routers do not let you change this setting, like AT&T's Arris BGW210-700, but most Netgear and TP-Link routers do.

If the option is available, it's usually under _DNS Servers_ in **DHCP Settings**, change whatever IP address is there to your Pi-Hole's IP, and your router will begin handing out Pi-Hole as the network-wide DNS when clients renew their DHCP leases.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> If your router does not have the option of setting a DNS server, you won't be able to block ads for all devices on your network automatically. Instead you'll have to <a href="https://discourse.pi-hole.net/t/how-do-i-configure-my-devices-to-use-pi-hole-as-their-dns-server/245#3-manually-configure-each-device-9" target="_blank">configure each device's DNS</a> or turn of DHCP on your router (if possible) and use Pi-Hole as the DHCP server. 

You should now be set up for Pi-Hole to be the DNS server for your whole network. If you added Pi-Hole's IP address as the DNS server in your router, devices will gradually begin querying Pi-Hole as they renew their DHCP leases and get the updated DNS server.

Otherwise you add Pi-Hole's IP manually to each device's DNS settings. As Pi-Hole starts answering DNS requests from clients, it will build up a cache -- domain resolution will start slow, but once they are cached Pi-Hole should be even faster than a public DNS.

Next, you'll notice the Pi-Hole web UI will show all clients as IP addresses, but there's a few methods to show hostnames instead. (Or `hostname.domain` if you prefer.) The easiest way is to use _Conditional Forwarding_, though it seems to be an uncommon feature with most consumer-grade routers, so don't be surprised if it doesn't work for you.

Go to **Settings** on the sidebar, click on the **DNS** tab, and scroll down to **Advanced DNS settings**.

![Conditional Forwarding settings.](../../img/blog/pihole-dns3.png)

Check the box to **Use Conditional Forwarding**, type in your subnet (most likely `192.168.0.0/24` or `192.168.1.0/24`), type in the domain if your router uses one and you know what it is (e.g. `.local` or `.home`) otherwise leave it blank, and click **Save**. Check the dashboard and see if that's enough to display hostnames instead of IP addresses. Doing a hard reload (Ctrl + F5) is usually enough to make them appear, but if you want to be sure, restart Pi-Hole by going to **Settings** -> **Restart DNS Resolver** on the web UI, or using the command `pihole restartdns` in the terminal.

If the hostnames are not showing up, there's something else we can try. Go back to _Advanced DNS settings_ and you'll see two checkmarks like in the picture below.

![Advanced DNS settings.](../../img/blog/pihole-dns4.png)

For the best security, both of these should be checked, but you can try unchecking one or both to see if they make the hostnames show. If the hostnames still don't populate, it's likely your router simply does not support conditional forwarding.

You'll have to manually add each device's IP address and hostname/domain. Go to _Local DNS_ on the navigation bar, and click on _DNS Records_.

![Adding new domain and IP.](../../img/blog/pihole-dns5.png)

Alternately, you can manually edit the `/etc/hosts` file on the server running Pi-Hole. You can bind an IP to a hostname, domain or any other alias.

```ini
# /etc/hosts

192.168.0.200   hostname1
192.168.0.215   hostname2
192.168.0.230   mydomain.tld
192.168.0.245   laptop
```

<div id='adlist' />

## Using adlists to block domains

On the Pi-Hole web UI, click on **Adlists** on the navigation bar:

![Pi-Hole Adlists.](../../img/blog/adlist.png)

The most efficient way to block URLs in Pi-Hole is to use an adlist, which is a list of URLs to block en masse. (You can also blacklist individual URLs by going to **Domains** on the sidebar.) While installing Pi-Hole you had the option of including a default adlist that blocks around 300k URLs, but there's many more adlists curated by the community that will block many more ads, malware sites, telemetry and tracking. Here are the ones I use:

- <a href="https://firebog.net" target="_blank">The Firebog</a>
- <a href="https://github.com/blocklistproject/Lists" target="_blank" rel="noreferrer noopener">The Block List Project</a>
- <a href="https://www.github.developerdan.com/hosts" target="_blank" rel="noreferrer noopener">Developer Dan's Adlists</a>
- <a href="https://github.com/badmojr/1Hosts" target="_blank" rel="noreferrer noopener">1Hosts</a> (I suggest Lite or Pro)
- <a href="https://oisd.nl" target="_blank" rel="noreferrer noopener">OISD</a>
- <a href="https://github.com/mmotti/pihole-regex/blob/master/regex.list" target="_blank" rel="noreferrer noopener">This gist of Regex Expressions</a>

Once you've added all the adlists (and any time you add additional ones), make sure to "update gravity" for the changes to take effect. Go to **Tools** on the navigation bar, click on **Update Gravity**, and click the big **Update** button. Do not leave the page until the process is done!

You may end up with several million "domains on adlists" as shown in the dashboard. Don't panic. You'll see your dashboard stats explode with blocked requests, especially from mobile devices. Pay attention to any issues you have visiting websites and using online apps/services that you commonly do, and whitelist domains as needed. (You can also use a <a href="https://github.com/anudeepND/whitelist" target="_blank">curated whitelist</a>.)

![Over 3 million domains blocked inon Pi-Hole.](../../img/blog/blocked.png)

<div id='advanced' />

## Advanced DNS Settings

By default the dashboard will show all clients as IP addresses, but there's a few methods to show hostnames instead. (Or `hostname.domain`) The easiest way is to use _Conditional Forwarding_, though it does not work with every router.

Go to _Settings_ on the navigation bar, click on the **DNS** tab, and scroll down to **Advanced DNS settings**.

![Conditional Forwarding settings.](../../img/blog/pihole-dns3.png)

Check the box to _Use Conditional Forwarding_, enter your network information, and hit Save. Check the dashboard and see if that's enough to display hostnames instead of IP addresses.

If the hostnames are not showing (sometimes it takes a minute), go back to **Advanced DNS settings**.

![Advanced DNS settings.](../../img/blog/pihole-dns4.png)

The above settings should be checked for more security, but try unchecking one or both to see if they make the hostnames show. If not, it's possible your router does not broadcast a local domain.

You'll have to manually add each device's IP address and hostname/domain. Go to **Local DNS** on the navigation bar, and click on **DNS Records**.

![Adding new domain and IP.](../../img/blog/pihole-dns5.png)

Alternately, you can manually edit the `/etc/hosts` file on the server running Pi-Hole. You can bind an IP to a hostname, domain or any other alias.

```ini
# /etc/hosts

192.168.0.200   hostname1
192.168.0.215   hostname2
192.168.0.230   mydomain.tld
192.168.0.245   laptop
```

After saving your changes to the file, use the following command for them to take effect.

```bash
pihole restartdns
```

If you've been following the instructions, you're all set to block ads. Pi-Hole will be a DNS sinkhole for every device on the network, blocking many ads, tracking and telemetry domains. Domain name resolution will also be done recursively through Unbound, bypassing public DNS resolvers like Google and Cloudflare, going straight to the authoritative nameservers.

If you want to go a bit deeper and improve the Pi-Hole experience, read on below.

<div id='further' />

## Further steps

<br>

### Updating Pi-Hole

When an update to Pi-Hole, FTL and/or the Web Interface is available, you can easily update your bare metal Pi-Hole in the terminal by using the command `pihole -up`. Pi-Hole will not update on it's own, so you have to do it manually, and the Pi-Hole team does not recommend automating it. (Though you can, if you so choose.)

If you'd rather update Pi-Hole during off-hours, like in the middle of the night, I suggest using `at` -- it lets you use schedule a one-time task for a later time, similar to `cron` but non-recurring. (The syntax for `at` is also more human-readable than `cron`.) For example, the below command will schedule `pihole -up` to be executed at 5:00 AM:

```bash
pihole -up | at 5AM
```

### Backup and/or restore Pi-Hole configuration

You may want to regularly create a backup of your Pi-Hole configuration. You can't automate it, but that's ok because it's very simple -- just to go the web UI, click on **Settings**, then go to the **Teleporter** tab and click the **Backup** button. This will download a `tar.gz` file to the computer you're accessing the web UI from, and within this same screen you can restore from a backup file if necessary. You might consider committing your backup to a private GitHub repo too.

### Use local time instead of UTC

If you notice the query log displaying times as UTC instead of your local time zone, and you want the logs to use your time zone, use (for example if you want EST):

```
sudo timedatectl set-timezone America/New_York
```

If you want to find out your time zone in the tz database, <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank">see here</a>.

### Run and sync two Pi-Holes

When you make Pi-Hole your primary DNS it becomes a critical part of your network -- if it goes down, devices on your network won't be able to resolve any domains. For this reason, you may want to run another Pi-Hole as a secondary DNS in case the host running your main instance of Pi-Hole crashes. (These things happen.) If your entire network will go down from an issue with Pi-Hole, running a second instance of it makes a lot of sense. If you go this route, I strongly suggest using <a href="https://github.com/vmstan/gravity-sync" target="_blank" rel="noreferrer noopener">Gravity Sync</a> to keep the adlists and other settings identical between the two.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> Gravity Sync has been archived and is no longer updated, however it still works perfectly with the current (as of October 2024) version of Pi-Hole. In the future Pi-Hole v6 release, Gravity Sync will not work. Two alternatives that do work with v6 are <a href="https://github.com/mattwebbio/orbital-sync" target="_blank" rel="noreferrer noopener">Orbital Sync</a> and <a href="https://github.com/lovelaze/nebula-sync" target="_blank" rel="noreferrer noopener">Nebula Sync</a>.
>
> This guide will be updated in the future once Pi-Hole v6 is generally available.

## Related Articles

> [How to use Pi-hole from anywhere with Tailscale](/blog/pihole-anywhere-tailscale)

> [Setting up a reverse proxy for HTTPS with a custom domain using Nginx Proxy Manager, Pi-Hole and Cloudflare](/blog/reverse-proxy-using-nginx-pihole-cloudflare)

<div id='ref' />

## Reference

- <a href="https://docs.pi-hole.net" target="_blank">Pi-Hole documentation</a>
- <a href="https://man7.org/linux/man-pages/man8/cron.8.html" target="_blank">Cron man page</a>
- <a href="https://man7.org/linux/man-pages/man5/crontab.5.html" target="_blank">Crontab man page</a>
- <a href="https://man7.org/linux/man-pages/man1/at.1p.html" target="_blank">At man page</a>
