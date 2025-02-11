---
title: "How I set up a home server for self-hosting and as a NAS with secure remote access via Tailscale"
description: "I turned my old Dell PC into an all-in-one home server and network attached storage to self-host all my data, my photos, and my media library, running Home Assistant, Plex and other services, all securely accessible from outside my home with Tailscale."
pubDate: 2025-01-31
updatedDate: 2025-02-03
tags:
  - self-hosting
---

## Table of Contents

1. [Server hardware and software](#server)
2. [Docker containers](#docker)
3. [Storage, SMB shares and MergerFS](#storage)
4. [Tailscale for remote access](#tailscale)
5. [Other homelab things](#homelab)

<div id='server'/>

## Server hardware and software

My old desktop PC turned server is a _Dell XPS 8920_ with an **Intel i7-7700k CPU** and **24 GB of DDR4 RAM**. (I removed the _AMD RX 480 GPU_ it came with, since I was not going to use it.) I installed _Debian 12 Bookworm_ on an NVMe drive and added hard drives to every available SATA port.

The large hard drives are pooled together using <a href="/blog/two-drives-mergerfs/" target="_blank" data-umami-event="home-server-mergerfs-blog-post">MergerFS</a>. For secure remote access, I have settled on <a href="/blog/tailscale/" target="_blank">Tailscale</a> for it's ease of use and exceptionally good free tier. To manage the server with a nice GUI, I use <a href="https://cockpit-project.org" target="_blank" data-umami-event="home-server-cockpit">Cockpit</a>. You can add "applications" for visualizing performance metrics, managing storage, and configuring virtual machines. (Which I rarely use.) I also use add-ons _File Sharing_ to manage my SMB shares and _Navigator_ for a graphical file manager.

![Cockpit Overview](../../img/blog/cockpit1.png 'Cockpit Overview')
![Cockpit Storage](../../img/blog/cockpit2.png 'Cockpit Storage')
![Cockpit File Sharing](../../img/blog/cockpit3.png 'Cockpit File Sharing')
![Cockpit Navigator](../../img/blog/cockpit4.png 'Cockpit Navigator')

<div id='docker'/>

## Docker containers

Aside from the ones mentioned above, most of my other self-hosted apps and services are run as <a href="https://docker.com" target="_blank" data-umami-event="home-server-docker">Docker</a> containers. I've run Plex and many other things for years with Docker and I see no reason to stop any time soon. Docker can be installed quickly and with minimal hassle by using their official install script:

```bash
curl -fsSL get.docker.com | sudo sh
```

I'll devote a section to each docker container I run and include my `compose.yaml` file for each.

<div id='dozzle'/>

### Dozzle

<a href="https://dozzle.dev" target="_blank" data-umami-event="home-server-dozzle">Dozzle</a> is a container log viewer. Portainer shows logs as well, and while it's useful for "live" logging I find Dozzle's UX much better for deep analysis of past logs.

<div id='filebrowser'/>

### File Browser

<a href="https://github.com/filebrowser/filebrowser" target="_blank" data-umami-event="home-server-filebrowser">Filebrowser</a> is exactly what the name implies, a GUI file explorer accessed via web UI. I rarely use it, but I have it setup to serve my `/home` directory in case I ever need to access it from another device.

<div id='gluetun'/>

### Gluetun

<a href="https://github.com/qdm12/gluetun" target="_blank" data-umami-event="home-server-gluetun">Gluetun</a> is a VPN client inside a docker container, it can connect to almost any VPN provider, using either OpenVPN or WireGuard protocols. By hooking up another container's networking to Gluetun, that other container will connect through the VPN. I use *qBittorrent* with Gluetun for private torrent downloads, that way I don't expose my IP address and avoid angry letters from my ISP.

<div id='hass'/>

### Home Assistant

<a href="https://home-assistant.io" target="_blank" data-umami-event="home-server-home-assistant">Home Assistant</a> is a smart home automation hub that provides local control over IoT and smart devices in my house. Although I use Google Home on the regular because it's easier to just speak what I want to do, everything that I can also connect to Home Assistant, I do. It has let me keep controlling my lights a few times when my internet was out, so that alone makes it worthwhile, and creating "if this then that" automations as useful as it is fun.

<div id='kavita'/>

### Kavita

<a href="https://kavitareader.com" target="_blank" data-umami-event="home-server-kavita">Kavita</a> is a simple user friendly ebook manager and reader, which I've been using to read my last few books on either my phone or tablet. It has a really nice and user friendly web GUI.

<div id='proxy'/>

### Nginx Proxy Manager

<a href="https://nginxproxymanager.com" target="_blank" data-umami-event="home-server-nginxproxy">Nginx Proxy Manager</a> is nice GUI wrapper over Nginx that lets you easily add proxy hosts and redirects, configure TLS, etc. I use it as a reverse proxy to access container web UIs with HTTPS via a custom domain. I use <em>AdGuard Home</em> as my home network DNS, so I have DNS rewrites configured for all the proxy hosts, and a custom domain from Cloudflare gets TLS certificates via DNS challenge.

For details <a href="/blog/reverse-proxy-using-nginx-adguardhome-cloudflare/" target="_blank">see this blog post about setting up Nginx Proxy Manager with AdGuard Home and Cloudflare</a>.

<div id='opengist'/>

### OpenGist

<a href="https://opengist.io" target="_blank" data-umami-event="home-server-opengist">OpenGist</a> is a self-hosted open source alternative to GitHub Gists. This is only accessible to me and I use it to save like API keys or tokens, configuration files, and code snippets so I can quickly copy & paste these things when I need to.

<div id='paperless'/>

### Paperless-ngx

<a href="https://paperless-ngx.com" target="_blank" data-umami-event="home-server-paperless">Paperless-ngx</a> is a document management system that can index and organize documents, performing OCR to make them searchable and selectable, and saving them as PDFs. If you have a lot of papers you want to digitize and organize, Paperless is a powerful tool for that. You can designate a `consume` folder and any documents dropped in there will automatically be processed by Paperless.

I honestly don't use it that much, but my wife and I have fed all our tax returns, property documents, and important receipts to it so that we can just go to one place from any device to view, edit and print documents.

<div id='plex'/>

### Plex

<a href="https://plex.tv" target="_blank" data-umami-event="home-server-plex-site">Plex</a> is a slick, feature packed media server and streaming player for self-hosted media. It also has some free movies and TV shows, and live TV channels. It's not open source, some features are behind a paid subscripton or lifetime pass, and the company hasn't always made good decisions for its users -- but it's still the best and most user friendly media player for me, my wife and two family members I have shared with.

I have written blog posts about <a href="/blog/setting-up-plex-in-docker/" target="_blank" data-umami-event="home-server-plex-guide">how to self-host Plex as a Docker container</a> and <a href="/blog/expose-plex-tailscale-vps/" target="_blank" data-umami-event="home-server-expose-plex-tailscale">how to use Tailscale and an Oracle free tier compute instance to securely expose Plex to other users</a>.

<div id='portainer'/>

### Portainer

<a href="https://portainer.io" target="_blank" data-umami-event="home-server-portainer">Portainer</a> is always the first container I install on a server that will run Docker. It is a GUI for creating and managing containers, I use the Stacks feature to create different groups of containers with docker compose. I have copies all the compose files (with secrets removed) <a href="https://github.com/fullmetalbrackets/docker" target="_blank" data-umami-event="home-server-docker-repo">saved on GitHub</a>. It's possible to setup Portainer to pull `compose.yaml` files from a GitHub repo for setting up Stacks, after which updates in GitHub will be pulled into Portainer, but I have not set this up myself. (I think I just prefer to do it manually in Portainer.)

Thanks to <a href="https://www.portainer.io/take-3" target="_blank">Portainer's 3 node free license</a> I also use Portainer Agent, connected via Tailscale, to manage another set of remote containers running on an Oracle free tier instance.

Portainer is usually installed with `docker run` rather than compose, it's just a quick command to get started. (Note that I use a bind mount rather than a persistent volume for Portainer.)

```bash
docker run ...
```

<div id='qbittorrent'/>

### qBittorrent

<a href="https://docs.linuxserver.io/images/docker-qbittorrent" target="_blank" data-umami-event="home-server-qbittorrent">qBittorrent</a> is my preferred torrent downloader, this containerized version makes the GUI accessible from any machine via browser, and it connects to *Gluetun* so that so all my downloads are routed through a paid VPN. Downloads go to my server's media storage to be streamable on Plex and accessible on the network via SMB shares.

<div id='scrutiny'/>

### Scrutiny

<a href="https://github.com/AnalogJ/scrutiny" target="_blank" data-umami-event="home-server-scrutiny">Scrutiny</a> provides a nice dashboard for hard drive S.M.A.R.T. monitoring. I have 7 hard drives on my server of various manufacturers, storage capacity and age so I use this to keep an eye on all of them. (See first screenshot below.) You can also see details on the test results for each drive and decide how severe it is. (See second screenshot, I'm not too worried since it's not critical and the content of both drives are backed up anyway.) Of course I have Scrutiny setup to send me notifications via Pushover (see third screenshot), but I also have `smartd` daemon configured to send mail in the server terminal when the tests show critical HDD failure, this already alerted me once to a dying HDD that I was able to replace without data loss.

![Scrutiny all drives overview.](../../img/blog/scrutiny1.png 'Scrutiny all drives overview')
![Scrutiny details of a specific drive.](../../img/blog/scrutiny2.png 'Scrutiny details of a specific drive with errors')
![Scrutiny notifications about specific drive errors via Pushover.](../../img/blog/scrutiny-pushover.jpg 'Scrutiny notifications about specific drive errors via Pushover')

```yaml

```

<div id='syncthing'/>

### Syncthing

<a href="https://docs.linuxserver.io/images/docker-syncthing" target="_blank" data-umami-event="home-server-syncthing">Syncthing</a> is used for only one thing, keeping my Obsidian notes synced across PC, phone and tablet. (Unfortunately, I'll have to switch to an alternative eventually since <a href="https://forum.syncthing.net/t/discontinuing-syncthing-android/23002" target="_blank">Syncthing for Android has been discontinued</a>.)

<div id='uptime'/>

### Uptime Kuma

<a href="https://uptime.kuma.pet" target="_blank" data-umami-event="home-server-uptime-kuma">Uptime Kuma</a> is a robust self-hosted uptime monitor, it can keep track of not just uptime of websites, but also Docker containers running on the host or even remotely. I mainly use it to monitor my containers and send a push notification to my phone (via <a href="https://pushover.net" target="_blank" data-umami-event="home-server-pushover">Pushover</a>) when they go down and come back up, other than that I track the uptime of websites (including this one) and make sure AdGuard Home  is available.

![Uptime Kuma various monitors](../../img/blog/uptime1.png 'Uptime Kuma various monitors')
![Uptime Kuma container monitor](../../img/blog/uptime2.png 'Uptime Kuma container monitor')

<div id='speedtest'/>

### Speedtest Tracker

<a href="https://speedtest-tracker.dev" target="_blank" data-umami-event="home-server-speedtest-tracker">Speedtest-Tracker</a> lets you schedule Ookla speedtests with cron syntax and uses a database to keep a history of test results with pretty graphs. It can also send notifications when a speedtest is completed or if a threshold is met. I use Pushover for push notifications from Speedtest-Tracker to my phone whenever speed results are below a certain threshold.

![Speedtest Tracker dashboard with graphs](../../img/blog/speedtest-tracker.png 'Speedtest Tracker dashboard with graphs')
![Speedtest Tracker push notification with Pushover](../../img/blog/speedtest-pushover.jpg 'Speedtest Tracker push notification with Pushover')


<div id='tautulli'/>

### Tautulli

<a href="https://tautulli.com" target="_blank" data-umami-event="home-server-tautulli">Tautulli</a> runs alongside Plex to provide monitoring and statistics tracking, so I can see a history of what media my users and I consumed, details on when and what device, whether it was direct play or transcode, etc. It also has programmatic notifications with a lot different triggers. Aside from just keeping a comprehensive history of played media, I use Pushover to send push notifications to my phone when other users are playing something on Plex and if they have any stream errors.

![Tautulli push notification with Pushover](../../img/blog/tautulli-pushover.jpg 'Tautulli push notification with Pushover')

<div id='watchtower'/>

### Watchtower

<a href="https://containrrr.dev/watchtower" target="_blank" data-umami-event="home-server-watchtower">Watchtower</a> keeps track of new version of all your other container images, and (depending on your config) will automatically shut containers down, update the images, prune the old images, and then restart it. You can also schedule your updates for specific dates and times, mine only happen on weekdays at 3 AM. Finally, it can send notifications via many providers, but like with everything else I use Pushover to get notified on my phone when any containers have been updated.

![Watchtower push notification with Pushover](../../img/blog/watchtower-pushover.jpg 'Watchtower push notification with Pushover')

<div id='storage'/>

## Storage, SMB shares and MergerFS

The following storage is installed in the server:

- 1 x 256 GB NVMe SSD
- 1 x 4 TB Internal HDD
- 3 x 2 TB Internal HDDs
- 3 x 1 TB External HDDs

The 256 GB NVMe SSD is the boot drive where Debian is installed. The 4 TB and 2 TB HDDs are used exclusively for movies and TV shows, and 1 TBs are storage for everything else. (Photos, music, documents, etc.) 

I don't bother `zfs` or RAID. This is kind of a cardinal sin in self-hosting, but I just don't care enough if one of my drives die and I lose a bunch of movies and TV shows -- I can re-acquire any that I want, and ignore any that I don't care about anymore. (As it is I'm already very bad at removing media I already watched and don't intend to watch again.) The photos, music and documents are backed up on cloud storage, other machines and an additional dedicated 1 TB backup drive, not listed above. That's my 3-2-1.

I use MergerFS to create two unified mount points: 10 TB of internal HDDs in `/opt/media`, where it's all available to stream in Plex. The other 3 TB of external HDDs is general storage at `/opt/data`.

MergerFS is quick and easy to install and configure. First, check for <a href="https://github.com/trapexit/mergerfs/releases/latest" target="_blank" data-umami-event="home-server-mergerfs-github">the latest version on GitHub</a> and download it:

```bash
# latest version when I wrote this
wget https://github.com/trapexit/mergerfs/releases/download/2.40.2/mergerfs_2.40.2.debian-bookworm_amd64.deb
```

Then install it:

```bash
dpkg -i mergerfs_2.40.2.debian-bookworm_amd64.deb
```

Configuration can be done in <a href="https://trapexit.github.io/mergerfs/quickstart/#usage" target="_blank" data-umami-event="home-server-mergerfs-docs">multiple ways</a>, but my preference is by editing `/etc/fstab`. Below is the fstab entry I use:

```ini
/mnt/media* /opt/media fuse.mergerfs
defaults,allow_other,nonempty,use_ino,moveonenospc=true,dropcacheonclose=true,category.create=mspmfs,fsname=mergerfs 0 0

/mnt/data* /opt/data fuse.mergerfs
defaults,allow_other,nonempty,use_ino,moveonenospc=true,dropcacheonclose=true,category.create=mspmfs,fsname=mergerfs 0 0
```

Using SMB, I share the files so they can be accessed from any PC, tablet or phone on the network. (Including via Tailscale.) I also have an SMB share to drop in documents for Paperless to consume. File Sharing is managed via the Cockpit GUI, below is my `smb.conf` file:

```conf
[global]
   interfaces = lo enp3s0
   bind interfaces only = yes
   smb ports = 445
   workgroup = WORKGROUP
   server string = Samba %v %h
   netbios name = athena
   security = user

   log file = /var/log/samba/%m.log
   max log size = 50
   printcap name = /dev/null
   load printers = no

   strict allocate = Yes
   allocation roundup size = 4096
   read raw = Yes
   server signing = No
   write raw = Yes
   strict locking = No
   socket options = TCP_NODELAY IPTOS_LOWDELAY SO_RCVBUF=131072 SO_SNDBUF=131072
   min receivefile size = 16384
   use sendfile = Yes
   aio read size = 16384
   aio write size = 16384

[home]
   comment = Home Directory
   path = /home/ariel
   browseable = yes
   writeable = yes
   read only = no
   force user = ariel
   force group = ariel

[media]
   comment = Media Share
   path = /opt/media
   browseable = yes
   writeable = yes
   read only = no
   force user = ariel
   force group = ariel
   force create mode = 0666
   force directory mode = 0777

[data]
   comment = General Share
   path = /opt/data
   browseable = yes
   writeable = yes
   read only = no
   force user = ariel
   force group = ariel
   force create mode = 0666
   force directory mode = 0777

[external]
   comment = External Backup Share
   path = /mnt/external
   browseable = yes
   writeable = yes
   read only = no
   force user = ariel
   force group = ariel
   force create mode = 0666
   force directory mode = 0777

[paperless]
   comment = External Backup Share
   path = /opt/data/paperless/consume
   browseable = yes
   writeable = yes
   read only = no
   force user = ariel
   force group = ariel
   force create mode = 0666
   force directory mode = 0777
```

SMB shares are available on the network for my wife and I to access from any PC or laptop, even any tablet or phone -- I wrote this <a href="/blog/solid-explorer-samba-share/" target="_blank" data-umami-event="home-server-solid-explorer">blog post about how to access SMB shares from Android</a>. On my Windows PC, I have the SMB shares mapped as network drives and mostly manage them through there.

![SMB shares from Linux server mapped as network drives in Windows.](../../img/blog/smb-windows.png 'SMB shares from Linux server mapped as network drives in Windows')

<div id='tailscale'/>

## Tailscale for remote access

My preferred way of remotely accessing my home network is <a href="https://tailscale.com" target="_blank" data-umami-event="home-server-tailscale">Tailscale</a>. If you don't know, Tailscale is a mesh virtual private network (VPN) that uses the WireGuard protocal for encrypted peer-to-peer connections. For details on how it works, <a href="https://tailscale.com/kb/1151/what-is-tailscale" target="_blank">see here</a>.

Tailscale not the only remote access solution, and technically it is not self-hosted, it's just the solution I landed on and ended up loving. Creating a Tailscale account also creates a <a href="https://tailscale.com/kb/1136/tailnet" target="_blank">Tailnet</a>. Any machines that run Tailscale are added to the Tailnet as nodes, which you'll manage through the web-based <a href="https://login.tailscale.com/admin" target="_blank">admin console</a>.

Tailscale is easy to learn and use, and when setup properly is totally secure without port forwarding or exposing anything to the internet. I wrote <a href="/blog/comprehensive-guide-tailscale-securely-access-home-network" target="_blank" data-umami-event="home-server-tailscale-guide">a blog post with more details</a> on how to set it up. The easiest way to install on a Linux server is to use the Tailscale install script:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> By default using most Tailscale commands requires superuser privileges, i.e. `sudo`. By using the command `sudo tailscale set --operator=$USER`, the specified user will then be able to execute Tailscale commands without `sudo`.

Once installed, Tailscale is run with the following command: 

```bash
tailscale up
```

I have both my home server and the separate machine running Pi-Hole as nodes in my Tailnet, along with my phone, tablet and a laptop. The server acts as *subnet router* so that I can access the entire network via Tailscale, not just the nodes with Tailscale installed. As per the <a href="https://tailscale.com/kb/1019/subnets" target="_blank" data-umami-event="home-server-tailscale-docs-subnets">Tailscale documentation on subnets</a>, this is done with the following commands.

First, to enable IP forwarding:

```bash
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
tailsclae
```

Then to advertise subnet routes:

```bash
tailscale up --advertise-routes=192.168.0.0/24
```

Finally, to make my SMB shares accessible via Tailscale, I use the following command:

```bash
tailscale serve --bg --tcp 445 tcp://localhost:445
```

Now with the Tailscale client installed on my Android phone, and toggling it on as VPN, I can access my home network on the go. I have <a href="/blog/pihole-anywhere-tailscale/" target="_blank">Pi-Hole running on a Libre Potato</a> that acts as the DNS server for the Tailnet, so I get ariel blocking on the go too.

<div id='homelab'/>

## Other homelab things

Most everything I self-host is on this one server, but I do have some other things going on. I have two free-tier Oracle E.2micro instances that I connect to via Tailscale. One is used to <a href="/blog/expose-plex-tailscale-vps/" target="_blank" data-umami-event="home-server-expose-plex-tailscale">allow secure remote access to Plex by other users</a>, the other runs <a href="/blog/pihole-anywhere-tailscale/" target="_blank" data-umami-event="home-server-pihole-anywhere-tailscale">Pi-Hole as DNS for the entire tailnet</a>, including my phone when I'm not home.

I have a ZimaBoard running a local instance of Pi-Hole for my tailnet, but it's usually off because I prefer to use the free Oracle VM. (I may flash OpenWRT onto the ZimaBoard and turn it into a Tailscale travel router.) In addition I have two Libre Sweet Potato SBCs that used to run my home instances of Pi-Hole, but are just sitting in a drawer unused for now.

## Related Articles

> <a href="/blog/expose-plex-tailscale-vps/" data-umami-event="tailscale-post-related-expose-plex-vps">How to securely expose Plex from behind CGNAT using Tailscale and a free Oracle VM</a>

> <a href="/blog/pihole-anywhere-tailscale/" data-umami-event="tailscale-post-related-pihole-anywhere">How to use Pi-hole from anywhere with Tailscale</a>