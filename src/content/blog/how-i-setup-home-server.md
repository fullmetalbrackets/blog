---
title: "How I set up a home server for self-hosting and as a NAS with secure remote access"
description: "I turned my old Dell PC into an all-in-one home server and network attached storage to self-host all my data, my photos, and my media library, running Home Assistant, Plex and other services, all securely accessible from outside my home with Tailscale."
pubDate: 2025-01-31
tags:
  - self-hosting
---

## Table of Contents

1. [Server hardware and software](#server)
2. [Docker containers](#docker)
3. [Storage, SMB shares and MergerFS](#storage)
4. [Tailscale for remote access](#tailscale)

<div id='server'/>

## Server hardware and software

My old desktop PC turned server is a _Dell XPS 8920_ with an **Intel i7-7700k CPU** and **24 GB of DDR4 RAM**. (I removed the _AMD RX 480 GPU_ it came with, since I was not going to use it.) I installed _Debian 12 Bookworm_ on an NVMe drive and added hard drives to every available SATA port.

The large hard drives are pooled together using <a href="/blog/two-drives-mergerfs" target="_blank">MergerFS</a>. For managing the server with a pretty and user friendly GUI, I prefer and keep coming back to <a href="https://cockpit-project.org" target="_blank">Cockpit</a>. For secure remote access, I have settled on <a href="/blog/tailscale" target="_blank">Tailscale</a> for it's ease of use and exceptionally good free tier.

Most other self-hosted apps and services are run as <a href="https://docker.com" target="_blank">Docker</a> containers.

<div id='docker'/>

## Docker containers

I've used <a href="https://docker.com" target="_blank">Docker</a> for years to run most of my self-hosted apps and services, and I love it. Docker can be installed quickly and with minimal hassle by using their official install script:

```bash
curl -fsSL get.docker.com | sudo sh
```

I always first install <a href="https://portainer.io" target="_blank">Portainer</a> for managing the rest of my containers through a nice GUI, using the Stacks feature to create different groups of containers. I have all the compose files <a href="https://github.com/fullmetalbrackets/docker" target="_blank">saved on GitHub</a>. I also use Portainer Agent paired with Tailscale to manage another set of remote containers running on an Oracle free tier instance, with <a href="https://www.portainer.io/take-3" target="_blank">Portainer's 3 node license</a>. Finally, I run <a href="https://portainer.io" target="_blank">Nginx Proxy Manager</a> as a <a href="/blog/reverse-proxy-using-nginx-adguardhome-cloudflare" target="_blank">reverse proxy to access everything with HTTPS via a custom domain</a>.

- <a href="https://dozzle.dev" target="_blank">Dozzle</a> is a robust container log viewer. Portainer shows logs as well, but Dozzle's UX is much simpler and you get to the logs much quicker too.

- <a href="https://github.com/qdm12/gluetun" target="_blank">Gluetun</a> is a VPN client inside a docker container, it can connect to almost any VPN provider, using either OpenVPN or Wireguard protocols. By hooking up another container to Gluetun, that other container will connect through the VPN. (See my use case with *qBittorrent* below.)

- <a href="https://home-assistant.io" target="_blank">Home Assistant</a> is a smart home automation hub that provides local control over IoT and smart devices in my house. Although I use Google Home on the regular because it's easier to just speak what I want to do, everything that I can also connect to Home Assistant, I do. It has let me keep controlling my lights a few times when my internet was out, so that alone makes it worthwhile, and creating "if this then that" automations as useful as it is fun.

- <a href="https://kavitareader.com" target="_blank">Kavita</a> is a simple user friendly ebook manager and reader, which I've been using to read my last few books on either my phone or tablet. It has a really nice and user friendly web GUI.

- <a href="https://nginxproxymanager.com" target="_blank">Nginx Proxy Manager</a> is just nice GUI wrapper over Nginx, it lets you easily add proxy hosts and redirects. I use this for my reverse proxy. Some alternatives, but which I haven't had a reason to use yet, would be *Caddy* or *Traefik*.

- <a href="https://opengist.io" target="_blank">OpenGist</a> is a self-hosted open source alternative to GitHub Gists. This is only accessible to me and I use it to document things like API keys, configuration files, simple instructions I can reference, etc.

- <a href="https://paperless-ngx.com" target="_blank">Paperless-ngx</a> is a document management system that makes your scanned documents searchable. It does not get that much use from me, but at least my tax returns are searchable if I were to ever need them to be.

- <a href="https://plex.tv" target="_blank">Plex</a> is my media server and player of choice. It's not open source, some features are behind a paid subscripton or lifetime pass, and the company hasn't always made good decisions for its users -- but it's still the best and most user friendly media player for me, my wife and my two remote users. If I had to use another media player, my favored alternative would be *Jellyfin*, but I have not been able to give up Plex.

- <a href="https://docs.linuxserver.io/images/docker-qbittorrent" target="_blank">qBittorrent</a> is my preferred torrent downloader, run inside a container and the web UI is accessed via browser. I have this hooked up to *Gluetun* via `network_mode: "service:gluetun"` so all my downloads are through the VPN and don't expose my IP. Downloads go to my server storage to be accessible on the network via SMB shares.

- <a href="https://github.com/AnalogJ/scrutiny" target="_blank">Scrutiny</a> provides a nice dashboard for hard drive S.M.A.R.T. monitoring, I use it to keep track of the health of the hard drives on my server.

- <a href="https://docs.linuxserver.io/images/docker-syncthing" target="_blank">Syncthing</a> is used for only one thing, keeping my Obsidian notes synced across PC, phone and tablet. (Unfortunately, I'll have to switch to an alternative eventually since <a href="https://forum.syncthing.net/t/discontinuing-syncthing-android/23002" target="_blank">Syncthing for Android has been discontinued</a>.)

- <a href="https://uptime.kuma.pet" target="_blank">Uptime Kuma</a> is a robust self-hosted uptime monitor, it can keep track of not just uptime of websites, but also Docker containers running on the host or even remotely. I mainly use it to monitor my containers and send a push notification to my phone (via <a href="https://pushover.net" target="_blank">Pushover</a>) when they go down and come back up, but also to keep track of Pi-Hole's DNS and of course uptime of this blog.

- <a href="https://speedtest-tracker.dev" target="_blank">Speedtest-Tracker</a> lets you schedule Ookla speedtests via cron, uses a database to keep a history of test results and provides nice graphs. I use Pushover for push notifications from Speedtest-Tracker to my phone whenever speed results are below a certain threshold.

- <a href="https://tautulli.com" target="_blank">Tautulli</a> runs alongside Plex to provide monitoring and statistics tracking, so I can see a history of what media I consumed, details on when and what device, etc. I use Pushover to send push notifications when one of my users is using Plex and if they have any stream errors.

- <a href="https://containrrr.dev/watchtower" target="_blank">Watchtower</a> keeps track of new version of all your other container images, and (depending on your config) will automatically shut containers down, update the images, prune the old images, and then restart it. You can also schedule your updates, mine only happen on weekdays at 4 AM. Finally, it can send notifications (in my case via Pushover, but there's many providers) when updates are available or installed.

<div id='storage'/>

## Storage, SMB shares and MergerFS

The following storage is installed in the server:

- 1 x 256 GB NVMe SSD
- 1 x 4 TB Internal HDD
- 3 x 2 TB Internal HDDs
- 2 x 1 TB External HDDs

The 256 GB NVMe SSD is the boot drive where Debian is installed. The large HDDs are used exclusively for movies and TV shows, but I don't bother with RAID. This is kind of a cardinal sin in self-hosting, but I just don't care enough if one of my drives die and I lose a bunch of movies and TV shows -- I can re-acquire any that I want, and ignore any that I don't.

I use MergerFS to merge all the HDDs into one mount point, the 12 TB of combined storage hold my media library, where it's all available to stream in Plex. MergerFS is quick and easy to install and configure.

First download it: (Make sure to get the <a href="https://github.com/trapexit/mergerfs/releases/latest" target="_blank">the latest version on GitHub</a>.)

```bash
wget https://github.com/trapexit/mergerfs/releases/download/2.40.2/mergerfs_2.40.2.debian-bookworm_amd64.deb
```

Then install it:

```bash
dpkg -i mergerfs_2.40.2.debian-bookworm_amd64.deb
```

Configuration is done just by editing `/etc/fstab`. Below is the fstab entry I use, which automatically merges any new drives with the naming convention of `media1`, `media2`, `media3`, etc. into the unified mount point at `~/media`.

```ini
/mnt/media* /home/ad/media fuse.mergerfs
defaults,allow_other,nonempty,use_ino,cache.files=off,movieonenosprc=true,dropcacheonclose=true,category.create=mfs,fsname=mergerfs 0 0
```

<div id='tailscale'/>

## Tailscale for remote access

My preferred way of remotely accessing my home network is <a href="https://tailscale.com" target="_blank">Tailscale</a>. If you don't know, Tailscale is a mesh virtual private network (VPN) that uses the WireGuard protocal for encrypted peer-to-peer connections. For details on how it works, <a href="https://tailscale.com/kb/1151/what-is-tailscale" target="_blank">see here</a>.

Tailscale not the only remote access solution, and technically it is not self-hosted, it's just the solution I landed on and ended up loving. Creating a Tailscale account also creates a <a href="https://tailscale.com/kb/1136/tailnet" target="_blank">Tailnet</a>. Any machines that run Tailscale are added to the Tailnet as nodes, which you'll manage through the web-based <a href="https://login.tailscale.com/admin" target="_blank">admin console</a>.

Tailscale is easy to learn and use, and when setup properly is totally secure without port forwarding or exposing anything to the internet. I wrote <a href="https://login.tailscale.com/admin" target="_blank">a blog post with more details</a> on how to set it up. The easiest way to install on a Linux server is to use the Tailscale install script:

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

I have both my home server and the separate machine running Pi-Hole as nodes in my Tailnet, along with my phone, tablet and a laptop. The server acts as *subnet router* so that I can access the entire network via Tailscale, not just the nodes with Tailscale installed. As per the <a href="https://tailscale.com/kb/1019/subnets" target="_blank">Tailscale documentation on subnets</a>, this is done with the following commands.

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

Now with the Tailscale client installed on my Android phone, and toggling it on as VPN, I can access my home network on the go. I have <a href="/blog/pihole-anywhere-tailscale" target="_blank">Pi-Hole running on a Libre Potato</a> that acts as the DNS server for the Tailnet, so I get ad blocking on the go too.
