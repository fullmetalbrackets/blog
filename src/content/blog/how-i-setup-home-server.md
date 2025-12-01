---
title: "How I set up a home server for self-hosting and as a NAS with secure remote access via Tailscale"
description: "I turned my old Dell PC into an all-in-one home server and network attached storage to self-host all my data, my photos, and my media library, running Home Assistant, Plex and other services, all securely accessible from outside my home with Tailscale."
pubDate: 2025-01-31
updatedDate: 2025-11-30
tags: ["self-hosting", "debian", "tailscale"]
related1: expose-plex-tailscale-vps
related2: pihole-anywhere-tailscale
---

## Server hardware and software

My old desktop PC turned server is a _Dell XPS 8920_ with an **Intel i7-7700 CPU** and **24 GB of DDR4 RAM**. (I removed the _AMD RX 480 GPU_ it came with, since I was not going to use it.) I installed _Debian 12 Bookworm_ on the M.2 NVMe drive and added hard drives to every available SATA port, including replacing the CD-ROM with another HDD. Additional hard drives are connected via two external docks each holding two HDDs, both connected to USB 3.1 ports utilizing USB Attached SCSI. (UASP)

Several hard drives pooled together using <a href="/blog/two-drives-mergerfs/" target="_blank" data-umami-event="home-server-mergerfs-blog-post">MergerFS</a>, with around 10 TB dedicated exclusively to movies and TV shows, while another 6 TB is for other data. For secure remote access to my server and all it's services (plus everything else on my home network), I have settled on <a href="/blog/tailscale/" target="_blank">Tailscale</a> for it's ease of use and exceptionally good free tier. To manage the server with a nice GUI, I use <a href="https://cockpit-project.org" target="_blank" data-umami-event="home-server-cockpit">Cockpit</a>. You can add "applications" for visualizing performance metrics, managing storage, and configuring virtual machines. (Which I rarely use.) I also use the Cockpit add-ons _File Sharing_ to manage my SMB shares and _Navigator_ for a graphical file manager.

![Cockpit Overview](../../img/blog/cockpit1.png 'Cockpit Overview')
![Cockpit Storage](../../img/blog/cockpit2.png 'Cockpit Storage')
![Cockpit File Sharing](../../img/blog/cockpit3.png 'Cockpit File Sharing')
![Cockpit Navigator](../../img/blog/cockpit4.png 'Cockpit Navigator')

## Docker containers

Aside from the ones mentioned above, most of my other self-hosted apps and services are run as <a href="https://docker.com" target="_blank" data-umami-event="home-server-docker">Docker</a> containers. I've run Plex and many other things for years with Docker and I see no reason to stop any time soon. Docker can be installed quickly and with minimal hassle by using their official install script:

```bash
curl -fsSL get.docker.com | sudo sh
```

I'll devote a section to each docker container I run and include a `compose.yaml` snippet.

### Dozzle

<a href="https://dozzle.dev" target="_blank" data-umami-event="home-server-dozzle">Dozzle</a> is a container log viewer. Portainer shows logs as well, and while it's useful for "live" logging I find Dozzle's UX much better for deep analysis of past logs.

```yaml
   dozzle:
      restart: unless-stopped
      container_name: dozzle
      image: amir20/dozzle:latest
      volumes:
         - /var/run/docker.sock:/var/run/docker.sock
      ports:
         - 20080:8080
```
<br>

### FileBrowser Quantum

<a href="https://github.com/gtsteffaniak/filebrowser" target="_blank" data-umami-event="home-server-filebrowser">FileBrowser Quantum</a> is a slick web-based graphical file explorer accessed via browser. I rarely use it, but I have it setup to serve my `/home` directory in case I ever need to access it from another device.

```yaml
   filebrowser:
      image: gtstef/filebrowser
      container_name: filebrowser
      environment:
         - PUID=1000
         - PGID=1000
      volumes:
         - /home/ariel:/srv
         - /opt/docker/filebrowser/filebrowser.db:/database/filebrowser.db
         - /opt/docker/filebrowser/settings.json:/config/settings.json
      ports:
         - 18888:80
      restart: unless-stopped
```
<br>

### Gluetun

<a href="https://github.com/qdm12/gluetun" target="_blank" data-umami-event="home-server-gluetun">Gluetun</a> is a VPN client inside a docker container, it can connect to almost any VPN provider, using either OpenVPN or WireGuard protocols. By hooking up another container's networking to Gluetun, that other container will connect through the VPN. I use *qBittorrent* with Gluetun for private torrent downloads, that way I don't expose my IP address and avoid angry letters from my ISP.

```yaml
   gluetun:
      image: qmcgaw/gluetun
      container_name: gluetun
      network_mode: bridge
      cap_add:
         - NET_ADMIN
      devices:
         - /dev/net/tun:/dev/net/tun
      ports:
         - 8080:8080/tcp # qBittorrent
         - 8888:8888/tcp # HTTP proxy
         - 8388:8388/tcp # Shadowsocks
         - 8388:8388/udp # Shadowsocks
         - 58279:58279/tcp # Virtual port forwarding
         - 58279:58279/udp # Virtual port forwarding
      volumes:
         - /opt/docker/gluetun:/gluetun
      restart: unless-stopped
      environment:
         - TZ=America/New_York
         - UPDATER_PERIOD=24h
         - SERVER_COUNTRIES="United States"
         - SERVER_CITIES=Miami,Atlanta Georgia,Chicago Illinois,Dallas Texas,Denver Colorado,New York City
         - VPN_TYPE=wireguard
         - VPN_SERVICE_PROVIDER=airvpn
         - FIREWALL_VPN_INPUT_PORTS=58279
         - WIREGUARD_PRIVATE_KEY=
         - WIREGUARD_PRESHARED_KEY=
         - WIREGUARD_ADDRESSES=
```
<br>

### Home Assistant

<a href="https://home-assistant.io" target="_blank" data-umami-event="home-server-home-assistant">Home Assistant</a> is a smart home automation hub that provides local control over IoT and smart devices in my house. Although I use Google Home on the regular because it's easier to just speak what I want to do, everything that I can also connect to Home Assistant, I do. It has let me keep controlling my lights a few times when my internet was out, so that alone makes it worthwhile, and creating "if this then that" automations are as useful as they are fun.

![Part of a Home Assistant dashboard.](../../img/blog/homeassistant.png 'Part of a Home Assistant dashboard')

```yaml
   homeassistant:
      container_name: homeassistant
      image: ghcr.io/home-assistant/home-assistant:stable
      volumes:
      - /opt/docker/homeassistant:/config
      - /srv/media:/media
      - /srv/data:/data
      - /etc/localtime:/etc/localtime:ro
      - /run/dbus:/run/dbus:ro
      - /var/run/docker.sock:/var/run/docker.sock
      restart: unless-stopped
      privileged: true
      network_mode: host
```
<br>

### Kavita

<a href="https://kavitareader.com" target="_blank" data-umami-event="home-server-kavita">Kavita</a> is a simple user friendly ebook manager and reader, which I've been using to read my last few books on either my phone or tablet. It has a really nice and user friendly web GUI.

```yaml
   kavita:
      restart: unless-stopped
      image: jvmilazz0/kavita:latest
      container_name: kavita
      ports:
         - 5000:5000
      volumes:
         - /srv/data/ebooks/comics:/comics
         - /srv/data/ebooks/books:/books
         - /opt/docker/kavita:/kavita/config
      environment:
         - TZ=America/New_York
```
<br>

### Nginx Proxy Manager

<a href="https://nginxproxymanager.com" target="_blank" data-umami-event="home-server-nginxproxy">Nginx Proxy Manager</a> is nice GUI wrapper over Nginx that lets you easily add proxy hosts and redirects, configure TLS, etc. I use it as a reverse proxy to access container web UIs with HTTPS via a custom domain. I use <em>AdGuard Home</em> as my home network DNS, so I have DNS rewrites configured for all the proxy hosts, and a custom domain from Cloudflare gets TLS certificates via DNS challenge.

For details <a href="/blog/reverse-proxy-using-nginx-adguardhome-cloudflare/" target="_blank">see this blog post about setting up Nginx Proxy Manager with AdGuard Home and Cloudflare</a>.
<br><br>

### OpenGist

<a href="https://opengist.io" target="_blank" data-umami-event="home-server-opengist">OpenGist</a> is a self-hosted open source alternative to GitHub Gists. This is only accessible to me and I use it to save like API keys or tokens, configuration files, and code snippets so I can quickly copy & paste these things when I need to.

```yaml
   opengist:
      image: ghcr.io/thomiceli/opengist:1
      container_name: opengist
      restart: unless-stopped
      environment:
         UID: 1000
         GID: 1000
      ports:
         - 6157:6157
         - 2222:2222
      volumes:
         - /opt/docker/opengist:/opengist
```
<br>

### Paperless-ngx

<a href="https://paperless-ngx.com" target="_blank" data-umami-event="home-server-paperless">Paperless-ngx</a> is a document management system that can index and organize documents, performing OCR to make them searchable and selectable, and saving them as PDFs. If you have a lot of papers you want to digitize and organize, Paperless is a powerful tool for that. You can designate a `consume` folder and any documents dropped in there will automatically be processed by Paperless.

My wife and I have fed all our tax returns, property documents, medical claims, invoices and receipts to it so that we can just go to a web page with a nice UI from any device to view, edit and print documents. I have an SMB share that points to the `consume` folder, so anything placed in there (including directly from the scanner) is processed into Paperless.

Paperless runs as three containers, so I put them all in a stack.

```yaml
services:
   broker:
      container_name: paperless-broker
      image: docker.io/library/redis:8
      restart: unless-stopped
      volumes:
         - /home/ariel/docker/paperless/redis:/data

   db:
      container_name: paperless-db
      image: docker.io/library/postgres:18
      restart: unless-stopped
      volumes:
         - /home/ariel/docker/paperless/postgresql:/var/lib/postgresql
      environment:
         POSTGRES_DB: paperless
         POSTGRES_USER: paperless
         POSTGRES_PASSWORD: paperless

   webserver:
      container_name: paperless-web
      image: ghcr.io/paperless-ngx/paperless-ngx:latest
      restart: unless-stopped
      depends_on:
         - db
         - broker
      ports:
         - 8008:8000
      volumes:
         - /opt/docker/paperless/data:/usr/src/paperless/data
         - /opt/docker/paperless/media:/usr/src/paperless/media
         - /srv/data/documents:/usr/src/paperless/export
         - /srv/data/paperless:/usr/src/paperless/consume
      environment:
         USERMAP_UID: 1000
         USERMAP_GID: 1000
         PAPERLESS_REDIS: redis://broker:6379
         PAPERLESS_DBHOST: db
         PAPERLESS_TIME_ZONE: America/New_York
```
<br>

### Plex

<a href="https://plex.tv" target="_blank" data-umami-event="home-server-plex-site">Plex</a> is a slick, feature packed media server and streaming player for self-hosted media. It also has some free movies and TV shows, and live TV channels. It's not open source, some features are behind a paid subscripton or lifetime pass, and the company hasn't always made good decisions for its users -- but it's still the best and most user friendly media player for me, my wife and two family members I have shared with.

I have written blog posts about <a href="/blog/setting-up-plex-in-docker/" target="_blank" data-umami-event="home-server-plex-guide">how to self-host Plex as a Docker container</a> and <a href="/blog/expose-plex-tailscale-vps/" target="_blank" data-umami-event="home-server-expose-plex-tailscale">how to use Tailscale and an Oracle free tier compute instance to securely expose Plex to other users</a>.

```yaml
   plex:
      restart: unless-stopped
      container_name: plex
      image: linuxserver/plex:latest
      network_mode: host
      environment:
         - TZ=America/New_York
         - PLEX_UID=1000
         - PLEX_GID=1000
      volumes:
         - /opt/docker/plex:/config
         - /srv/media/movies:/movies
         - /srv/media/tvshows:/tvshows
         - /srv/media/transcode:/transcode
         - /srv/media/music:/music
      devices:
         - /dev/dri:/dev/dri
```
<br>

### Portainer

<a href="https://portainer.io" target="_blank" data-umami-event="home-server-portainer">Portainer</a> is always the first container I install on a server that will run Docker. It is a GUI for creating and managing containers, I use the Stacks feature to create different groups of containers with docker compose. I have copies of all my compose files (with secrets removed) <a href="https://github.com/fullmetalbrackets/docker" target="_blank" data-umami-event="home-server-docker-repo">saved on GitHub</a>. It's possible to setup Portainer to pull `compose.yaml` files from a GitHub repo for setting up Stacks, after which updates in GitHub will be pulled into Portainer, but I have not set this up myself. (I think I just prefer to do it manually in Portainer.)

Thanks to <a href="https://www.portainer.io/take-3" target="_blank">Portainer's 3 node free license</a> I also use Portainer Agent, connected via Tailscale, to manage another set of remote containers running on an Oracle free tier instance.

Portainer is usually deployed with `docker run` rather than compose, it's just a quick command to get started. (Note that I use a bind mount rather than a standard volume for Portainer data.)

![Multiple environments in Portainer.](../../img/blog/portainer1.png 'Multiple environments in Portainer')
![List of Docker containers in Portainer.](../../img/blog/portainer2.png 'List of Docker containers in Portainer')

```bash
docker run -d -p 8000:8000 -p 9000:9000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v /opt/docker/portainer:/data portainer/portainer-ce:lts
```

<br>

### qBittorrent

<a href="https://docs.linuxserver.io/images/docker-qbittorrent" target="_blank" data-umami-event="home-server-qbittorrent">qBittorrent</a> is my preferred torrent downloader, this containerized version makes the GUI accessible from any machine via browser, and it connects to *Gluetun* so that so all my downloads are routed through my VPN provider. Rather than using the *arr suite for automated downloads, because I just don't download often enough to bother setting it up, I will manually grab a magnet link from my preferred torrent sites and put it into qBittorrent. I have storage paths configured by categories so that I can just choose "Movies", "TV Shows" or "Music" categories for each download, and it will be stored in the corresponding path where it is streamable from Plex. I also use the <a href="https://github.com/VueTorrent/VueTorrent" target="_blank">VueTorrent mod</a> for an improved UI.

![qBittorrent with VueTorrent UI mod.](../../img/blog/qbittorrent.png 'qBittorrent with VueTorrent UI mod')

```yaml
   qbittorrent:
      image: lscr.io/linuxserver/qbittorrent:latest
      container_name: qbittorrent
      environment:
         - PUID=1000
         - PGID=1000
         - TZ=America/New_York
         - WEBUI_PORT=8080
         - DOCKER_MODS=ghcr.io/vuetorrent/vuetorrent-lsio-mod:latest
      volumes:
         - /opt/docker/qbittorrent:/config
         - /srv/media/downloads:/downloads
         - /srv/media/movies:/movies
         - /srv/media/tvshows:/tvshows
         - /srv/media/music:/music
      network_mode: "service:gluetun"
      restart: unless-stopped
      depends_on:
         gluetun:
         condition: service_healthy
```

<br>

### Scrutiny

<a href="https://github.com/AnalogJ/scrutiny" target="_blank" data-umami-event="home-server-scrutiny">Scrutiny</a> provides a nice dashboard for hard drive S.M.A.R.T. monitoring. I have 10 hard drives on my server of various manufacturers, storage capacities and age so I use this to keep an eye on all of them. (See first screenshot below.) You can also see details on the test results for each drive and decide how severe it is. (See second screenshot, I'm not too worried since it's not critical and the content of both drives are backed up anyway.) Of course I have Scrutiny setup to send me notifications via Pushover (see third screenshot), but I also have `smartd` daemon configured to send mail in the server terminal when the tests show critical HDD failure, this already alerted me once to a dying HDD that I was able to replace without data loss.

![Scrutiny all drives overview.](../../img/blog/scrutiny1.png 'Scrutiny all drives overview')
![Scrutiny details of a specific drive.](../../img/blog/scrutiny2.png 'Scrutiny details of a specific drive with errors')
![Scrutiny notifications about specific drive errors via Pushover.](../../img/blog/scrutiny-pushover.jpg 'Scrutiny notifications about specific drive errors via Pushover')

```yaml
   scrutiny:
      container_name: scrutiny
      image: ghcr.io/analogj/scrutiny:master-omnibus
      restart: unless-stopped
      cap_add:
         - SYS_RAWIO
         - SYS_ADMIN
      ports:
         - "8880:8080" # webapp
         - "8086:8086" # influxDB admin
      volumes:
         - /run/udev:/run/udev:ro
         - /home/ariel/docker/scrutiny:/opt/scrutiny/config
         - /home/ariel/docker/scrutiny/influxdb:/opt/scrutiny/influxdb
      environment:
        SCRUTINY_NOTIFY_URLS: "pushover://shoutrrr:...@.../"
      devices:
         - "/dev"
```
<br>

### Speedtest Tracker

<a href="https://speedtest-tracker.dev" target="_blank" data-umami-event="home-server-speedtest-tracker">Speedtest-Tracker</a> lets you schedule Ookla speedtests with cron syntax and uses a database to keep a history of test results with pretty graphs. It can also send notifications when a speedtest is completed or if a threshold is met. I use Pushover for push notifications from Speedtest-Tracker to my phone whenever speed results are below 700 Mpbs. (I pay for gigabit fiber, so I like to know how often it's not actually at those speeds.)

![Speedtest Tracker dashboard with graphs](../../img/blog/speedtest-tracker.png 'Speedtest Tracker dashboard with graphs')
![Speedtest Tracker push notification with Pushover](../../img/blog/speedtest-pushover.jpg 'Speedtest Tracker push notification with Pushover')

```yaml
   speedtest-tracker:
      image: lscr.io/linuxserver/speedtest-tracker:latest
      container_name: speedtest-tracker
      environment:
         - PUID=1000
         - PGID=1000
         - TZ=America/New_York
         - DB_CONNECTION=sqlite
         - APP_KEY=
         - DISPLAY_TIMEZONE=America/New_York
         - SPEEDTEST_SCHEDULE=0 * * * *
         - PRUNE_RESULTS_OLDER_THAN=30
         - CHART_DATETIME_FORMAT=j M Y, g:i:s
         - APP_URL=
      volumes:
         - /opt/docker/speedtest:/config
      ports:
         - 8800:80
      restart: unless-stopped
```
<br>

### Syncthing

<a href="https://docs.linuxserver.io/images/docker-syncthing" target="_blank" data-umami-event="home-server-syncthing">Syncthing</a> is used for only one thing, keeping my Obsidian notes synced across PC, phone and tablet. Unfortunately, I'll have to switch to an alternative eventually since <a href="https://forum.syncthing.net/t/discontinuing-syncthing-android/23002" target="_blank">Syncthing for Android has been discontinued</a>. For now I continue using it and it still works. (There's also <a href="https://github.com/Catfriend1/syncthing-android" target="_blank" data-umami-event="home-server-syncthingfork">Syncthing-Fork</a> as a drop-in replacement for the Android Syncthing app.)

```yaml
   syncthing:
      image: syncthing/syncthing
      container_name: syncthing
      environment:
         - PUID=1000
         - PGID=1000
      volumes:
         - /home/ariel/docker/syncthing:/var/syncthing
         - /srv/data:/data
      network_mode: host
      restart: unless-stopped
```
<br>

### Tautulli

<a href="https://tautulli.com" target="_blank" data-umami-event="home-server-tautulli">Tautulli</a> runs alongside Plex to provide monitoring and statistics tracking, so I can see a history of what media my users and I consumed, details on when and what device, whether it was direct play or transcode, etc. It also has programmatic notifications with a lot different triggers. Aside from just keeping a comprehensive history of played media, I use Pushover to send push notifications to my phone when other users are playing something on Plex and if they have any stream errors.

![Plex Media Server streaming history in Tautulli.](../../img/blog/tautulli.png 'Plex Media Server streaming history in Tautulli')

![Tautulli push notification with Pushover.](../../img/blog/tautulli-pushover.jpg 'Tautulli push notification with Pushover')

```yaml
   tautulli:
      restart: unless-stopped
      image: lscr.io/linuxserver/tautulli:latest
      container_name: tautulli
      ports:
         - 8181:8181
      environment:
         - PUID=1000
         - PGID=1000
         - TZ=America/New_York
      volumes:
         - /opt/docker/tautulli:/config
      depends_on:
         - plex
```
<br>

### Uptime Kuma

<a href="https://uptime.kuma.pet" target="_blank" data-umami-event="home-server-uptime-kuma">Uptime Kuma</a> is a robust self-hosted uptime monitor, it can keep track of not just uptime of websites, but also Docker containers running on the host or even remotely. I mainly use it to monitor my containers and send a push notification to my phone (via <a href="https://pushover.net" target="_blank" data-umami-event="home-server-pushover">Pushover</a>) when they go down and come back up, other than that I track the uptime of websites (including this one) and make sure AdGuard Home is available.

![Uptime Kuma various monitors](../../img/blog/uptime1.png 'Uptime Kuma various monitors')
![Uptime Kuma container monitor](../../img/blog/uptime2.png 'Uptime Kuma container monitor')

```yaml
   uptime-kuma:
      image: louislam/uptime-kuma:beta
      container_name: uptime-kuma
      volumes:
         - /opt/docker/uptime:/app/data
         - /var/run/docker.sock:/var/run/docker.sock
      ports:
         - 3001:3001
      dns:
         - 1.1.1.1
         - 8.8.8.8
      restart: unless-stopped
```
<br>

### Watchtower

<a href="https://containrrr.dev/watchtower" target="_blank" data-umami-event="home-server-watchtower">Watchtower</a> keeps track of new version of all your other container images, and (depending on your config) will automatically shut containers down, update the images, prune the old images, and then restart it. You can also schedule your updates for specific dates and times, mine only happen on weekdays at 3 AM. Finally, it can send notifications via many providers, but like with everything else I use Pushover to get notified on my phone when any containers have been updated.

![Watchtower push notification with Pushover](../../img/blog/watchtower-pushover.jpg 'Watchtower push notification with Pushover')

```yaml
   watchtower:
      container_name: watchtower
      image: containrrr/watchtower
      restart: unless-stopped
      environment:
         - WATCHTOWER_NOTIFICATION_URL=pushover://:...@...
         - WATCHTOWER_NOTIFICATIONS_HOSTNAME=
         - WATCHTOWER_CLEANUP=true
         - WATCHTOWER_INCLUDE_STOPPED=true
         - WATCHTOWER_REVIVE_STOPPED=false
         - WATCHTOWER_SCHEDULE=0 0 8 * * *
      volumes:
         - "/var/run/docker.sock:/var/run/docker.sock"
```

> It's important to note that Watchtower has not been updated in over 2 years and is basically unmaintained at this point. There's some maintained alternatives, in some cases with even more features, but I personally I have really had a reason to migrate as of yet. If you're starting out new, I suggest instead checking out <a href="https://github.com/fmartinou/whats-up-docker" target="_blank" data-umami-event="home-server-whatsupdocker">What's Up Docker</a> or <a href="https://github.com/crazy-max/diun" target="_blank" data-umami-event="home-server-diun">Diun</a>

## Storage, SMB shares and MergerFS

The following storage is installed in the server:

- 1 x 256 GB NVMe SSD
- 2 x 4 TB Internal HDD
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

```ini
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

## Tailscale for remote access

My preferred way of remotely accessing my home network is <a href="https://tailscale.com" target="_blank" data-umami-event="home-server-tailscale">Tailscale</a>. If you don't know, Tailscale is a mesh virtual private network (VPN) that uses the WireGuard protocal for encrypted peer-to-peer connections. For details on how it works, <a href="https://tailscale.com/kb/1151/what-is-tailscale" target="_blank">see here</a>.

Tailscale not the only remote access solution, and technically it is not self-hosted, it's just the solution I landed on and ended up loving. Creating a Tailscale account also creates a <a href="https://tailscale.com/kb/1136/tailnet" target="_blank">Tailnet</a>. Any machines that run Tailscale are added to the Tailnet as nodes, which you'll manage through the web-based <a href="https://login.tailscale.com/arielmin" target="_blank">admin console</a>.

Tailscale is easy to learn and use, and when setup properly is totally secure without port forwarding or exposing anything to the internet. I wrote <a href="/blog/comprehensive-guide-tailscale-securely-access-home-network" target="_blank" data-umami-event="home-server-tailscale-guide">a blog post with more details</a> on how to set it up. The easiest way to install on a Linux server is to use the Tailscale install script:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

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

## Other homelab things

Most everything I self-host is on this one server, but I do have some other things going on. I have two free-tier Oracle E.2micro instances that I connect to via Tailscale. One is used to <a href="/blog/expose-plex-tailscale-vps/" target="_blank" data-umami-event="home-server-expose-plex-tailscale">allow secure remote access to Plex by other users</a>, the other runs <a href="/blog/pihole-anywhere-tailscale/" target="_blank" data-umami-event="home-server-pihole-anywhere-tailscale">Pi-Hole as DNS for the entire tailnet</a>, including my phone when I'm not home.

I have a ZimaBoard running a local instance of Pi-Hole for my tailnet, but it's usually off because I prefer to use the free Oracle VM. (I may flash OpenWRT onto the ZimaBoard and turn it into a Tailscale travel router.) In addition I have two Libre Sweet Potato SBCs that used to run my home instances of Pi-Hole, but are just sitting in a drawer unused for now.