---
layout: "@layouts/BlogPost.astro"
title: "Set up and configure Pi-Hole for network-wide ad blocking"
description: "I've been using Pi-Hole for a few years, and I just recently set it up again on a new machine with a new router. It's stupid easy and super effective, here's how."
pubDate: "October 8, 2022"
updatedDate: "August 9, 2023"
tags:
  - Self-Hosting
  - Pi-Hole
  - Linux
---

## Sections

1. [Pre-Requisites and Preparations](#pre)
2. [Installing Pi-Hole bare metal](#baremetal)
3. [Installing Pi-Hole in a docker container](#container)
4. [Configuring DNS](#dns)
5. [Using adlists to block domains](#adlist)
6. [Advanced DNS settings](#advanced)
7. [Further steps](#further)
8. [Reference](#ref)

<div id='pre' />

## Pre-Requisites and Preparations

Before anything, make sure the machine you're installing Pi-Hole on <a href="https://arieldiaz.codes/blog/set-static-ip-debian" target="_blank">has a static IP</a>, the installer will bug you about this too. Also, Pi-Hole will run a web server at ports 80 and 443, for serving the web UI page, so make sure no other web server like Apache or NGinx is running.

Also, when installing Pi-Hole on Ubuntu you may get an error message along the lines of this:

```bash
Error starting userland proxy: listen tcp4 0.0.0.0:53: bind: address already in use
```

This is because Pi-Hole includes `dnsmasq` which binds to port 53, but Ubuntu by default uses `systemd-resolved` on that port. If this happens, you'll need to disable `systemd-resolved` prior to installing Pi-Hole. Do this:

```bash
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved.service
```

Then edit the file at `/etc/resolv.conf` and change `nameserver 127.0.0.53` to `nameserver 1.1.1.1` (or whatever DNS provider you prefer) to not break DNS resolution. Afterwards use `dig google.com` or `ping google.com` to verify DNS is still working, then proceed with installing Pi-Hole.

<div id='baremetal' />

## Installing Pi-Hole bare metal

The quickest and easiest way to install Pi-Hole is via their provided shell script:

```bash
curl -sSL https://install.pi-hole.net | bash
```

Executing the script will prompt a number of dialogs, pay attention and make sure you input all the correct information.

<div class="alert">
  <span>
    <img src="/img/assets/alert.svg" class="alert-icon"> <b>Important!</b>
  </span>
  <p>
    Make sure to take note of the admin password provided at the end of the install process, you'll need it to login to the Web UI. Ideally you should change the admin password with <code>pihole -a -p newpassword</code>.
  </p>
</div>

Now you should be able to access the Pi-Hole Web UI at either `http://pi.hole/admin`, or use the IP address or hostname, e.g. `http://192.168.1.250/admin` or `http://hostname/admin`.

<div id='container' />

## Installing Pi-Hole as a docker container

Like with a bare metal install, make sure the machine you'll be running Pi-Hole on has a static IP address and no other web server for smoothest install experience. We'll be using <a href="https://docs.docker.com/compose/" target="_blank">Docker Compose</a>. If you haven't already (personally I don't bother using Docker without Compose), install it:

```bash
sudo apt update
sudo apt install docker-compose
```

Now create a new compose file with the command `nano docker-compose.yml` then copy and paste the below into it:

```yaml
pihole:
  container_name: pihole
  image: pihole/pihole
  environment:
    - "TZ=America/New_York"
    - "WEBPASSWORD=admin" # change to your password
    - "FTLCONF_LOCAL_IPV4=192.168.0.100" # change to your server IP
    - "DNS1=1.1.1.1"
    - "DNS2=1.0.0.1"
    - "DNSMASQ_LISTENING=all"
    - "DNSSEC=true"
    - "QUERY_LOGGING=true"
  volumes:
    - "~/pihole/config:/etc/pihole/"
    - "~/pihole/dnsmasq:/etc/dnsmasq.d/"
  network_mode: host
  cap_add:
    - NET_ADMIN
  restart: unless-stopped
  # The below label is only necessary if using Watchtower to exclude the Pi-Hole container from automated updates (see https://github.com/pi-hole/docker-pi-hole#note-on-watchtower)
  labels:
    - "com.centurylinklabs.watchtower.enable=false"
```

Above I include some environmental variables, I'll explain:

- `TZ=`, `WEBPASSWORD=` and `FTLCONF_LOCAL_IPV4=` are recommended by the Pi-Hole developers to set the timezone, UI password and server IP address.
- `DNS1=` and `DNS2=` will preset specific upstream DNS resolvers, I suggest Cloudflare but change this to your preference.
- `DNSMASQ_LISTENING=all` makes Pi-Hole listen on all interfaces, which should grab network traffic from all devices on your LAN.
- `DNSSEC=true` forces Pi-Hole to use DNSSEC if available.
- `QUERY_LOGGING=true` sets Pi-Hole to log all queries it receives, this is optional but I like logs, so I always turn it on.

After that are `volumes`, left of the colon is the local directory you'll map to the directory inside the container, right of the colon. Change your mapping left of the colon to your prefernece, but make sure to leave the internal maps right of the colon as is!

The parameter `network_mode: host` is the simplest way to get Pi-Hole working in a container, and is recommended if you'll be using Pi-Hole to broadcast DHCP. Speaking of which...

```yaml
cap_add:
  - NET_ADMIN
```

This is required to use DHCP in Pi-Hole. If you're not doing so, leave it out and you can also remove `network_mode: host`, in which case you'll have to map ports manually and add the below:

```yaml
ports:
  - "53:53/tcp"
  - "53:53/udp"
  - "80:80/tcp"
```

Once your `docker-compose.yml` is ready, use the following command _from within the same directory as the yaml file_ to create and run the Pi-Hole container:

```bash
docker-compose up -d
```

After a minute or so the container should be up and running, which you can confirm with the command `docker ps`, your output should look something like this:

```bash
CONTAINER ID   IMAGE           COMMAND      CREATED          STATUS                    PORTS                                                                                                             NAMES
826fe8b20bdd   pihole/pihole   "/s6-init"   45 seconds ago   Up 41 seconds (healthy)   0.0.0.0:53->53/tcp, :::53->53/tcp, 0.0.0.0:80->80/tcp, 0.0.0.0:53->53/udp, :::80->80/tcp, :::53->53/udp, 67/udp   pihole
```

<div id='dns' />

## Configuring DNS

In order for Pi-Hole to work network-wide for all devices (including phones and tablets on Wi-Fi), you'll need to configure your router to use the Pi-Hole server as DNS. The method differs for every router, and some do not have the option at all. (AT&T's Arris BGW210-700 for example does not let you set your own DNS provider.) If the option is available, it's usually under _DHCP Settings_. Google is your friend here for instructions on your own hardware.

<div class="note">
  <span>
    <img src="/img/assets/note.svg" class="note-icon">
    <b>Note</b>
  </span>
  <p>
    If your router does not have the option of setting a DNS server, you won't be able to block ads for all devices on your network automatically. Instead you'll have to <a href="https://discourse.pi-hole.net/t/how-do-i-configure-my-devices-to-use-pi-hole-as-their-dns-server/245#3-manually-configure-each-device-9" target="_blank">configure each device's DNS</a>.
  </p>
</div>

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

192.168.0.200   hostname1
192.168.0.215   hostname2
192.168.0.230   mydomain.tld
192.168.0.245   laptop
```

After saving your changes to the file, use the following command for them to take effect.

```bash
pihole restartdns
```

<div class="success">
  <span>
    <b>✔ Success!</b>
  </span>
  <p>
    If you've been following the instructions, you're all set to block ads. Pi-Hole will act as a middleman between you and your chosen DNS (Cloudflare's <em>1.1.1.1</em> for example), blocking ads, tracking and telemetry. If you want to go a bit deeper and make Pi-Hole even better, read on below.
  </p>
</div>

<div id='further' />

## Further steps

If you want your setup to be more private, consider <a href="https://docs.pi-hole.net/guides/dns/unbound/#setting-up-pi-hole-as-a-recursive-dns-server-solution" target="_blank">setting up a recursive DNS with unbound</a>, that way you bypass public DNS servers like Cloudflare and Google entirely.

Pi-Hole will automatically update the gravity database every Sunday between 3:00 AM and 5:00 AM, but if you're using regularly updated community-maintained adlists, you may want to consider using `cron` to automate updating the gravity every day or two. This is entirely optional, but doesn't hurt. Use `cronjob -e` and place in the below to (for example) update gravity everyday at 5:00AM.

```bash
0 5 * * * pihole -g
```

If you're running Pi-Hole in a docker container, use this command instead:

```bash
0 5 * * * docker exec <pihole_container_name> pihole -g
```

When an update to Pi-Hole, FTL or the Web Interface is available (usually the Pi-Hole team will update all three at the time same), you can easily update your bare metal Pi-Hole in the terminal by using the command `pihole -up`. Pi-Hole will not update on it's own, so you have to do it manually.

If you'd rather update Pi-Hole during off-hours, like in the middle of the night, I suggest using `at` -- it lets you use schedule a one-time task for a later time, similar to `cron` but non-recurring. (The syntax for `at` is also more human-readable than `cron`.) For example, the below command will schedule `pihole -up` to be executed at 5:00 AM:

```bash
pihole -up | at 5AM
```

If running Pi-Hole in a docker container, you don't need to use `pihole -up`, instead do the following to update the container with the latest image:

- `docker pull pihole/pihole` to pull the latest image
- `docker-compose down` in the same directory as your compose file, to stop container
- `docker-compose up -d` to recreate the container with the new image

If you used `docker run` to setup Pi-Hole, pull the image and use `docker restart pihole`. (If you did not name the container, use `docker ps` to list all containers and use the `CONTAINER ID` or whatever random name it received.)

Additionally, you should regularly create a backup of your Pi-Hole configuration. You can't automate it, but that's ok because it's very simple -- just to go the web UI, click on _Settings_, then go to the _Teleporter_ tab and click the _Backup_ button. This will download a `tar.gz` file to the computer you're accessing the web UI from, and within this same screen you can restore from a backup file if necessary. You might consider committing your backup to a private GitHub repo too.

Also, if you make Pi-Hole your primary DNS it becomes a critical part of your network -- if it goes down, devices on your network won't be able to resolve any domains. For this reason, you may want to run another Pi-Hole as a secondary DNS in case the host running your main instance of Pi-Hole crashes. (These things happen.) If your entire network will go down from an issue with Pi-Hole, running a second instance of it makes a lot of sense. If you go this route, I strongly suggest using <a href="https://github.com/vmstan/gravity-sync" target="_blank" rel="noreferrer noopener">Gravity Sync</a> to keep the adlists and other settings identical between the two.

And last, but not least, you may want to consider connecting the Pi-Hole(s) to an _Uninterruptable Power Supply_. I have my router and both Pi-Hole hosts on a UPS, and more than once it's let me cruise through brief power outages. (I live in Florida where any random summer storm can cause the power to blink or get knocked out temporarily.)

<div class="info">
  <span>
    <b>ⓘ Information</b>
  </span>
  <p>
    Even with all the steps above, your DNS traffic will still go out over plain text and can be seen by your ISP or anyone that happens to be snooping. As such, these may interest you:
    <ul>
      <li>
        <a href="using-dns-over-https-with-pihole">Using DNS over HTTPS with Pi-hole and Cloudflared</a>
      </li>
      <li>
        <a href="pi-hole-quad9-dls-over-tls">Using a forwarding resolver in Pi-Hole for DNS over TLS</a>
      </li>
    </ul>
  </p>
</div>

<div id='ref' />

## Reference

- <a href="https://docs.pi-hole.net" target="_blank">Pi-Hole documentation</a>
- <a href="https://man7.org/linux/man-pages/man8/cron.8.html" target="_blank">Cron man page</a> / <a href="https://man7.org/linux/man-pages/man5/crontab.5.html" target="_blank">Crontab man page</a>
- <a href="https://man7.org/linux/man-pages/man1/at.1p.html" target="_blank">At man page</a>
- <a href="using-dns-over-https-with-pihole">My blog post on configuring Pi-Hole to use DNS-Over-HTTPS</a>
