---
title: "Athena"
description: "Details on my home server, a Dell XPS 8920."
pubDate: 2024-06-15
updatedDate: 2024-10-04
tags:
  - hosts
---

![Dell XPS 8920](../../img/wiki/xps8920.jpg)

# Dell XPS 8920 

- 250 GB PCIe M.2 NVMe SSD (boot drive)
- 4 x 2 TB 3.5" HDD (large media storage)
- 1 TB 2.5" HDD (documents, photos, etc.)
- 3 x 1 Gbps Ethernet Ports
- 24 GB RAM

## Information

My former daily driver desktop PC since 2015, where I interneted, gamed and worked. This thing was still trucking on Windows 10 in 2024 and with the stock AMD Radeon RX 480 GPU was still playing newer games like Cyberpunk 2077 very well. When I got a new gaming PC, I decided to turn this one into my new Linux server.

I removed the GPU since Plex cannot use AMD cards for transcoding (at least not well) and the integrated GPU can do Intel Sync and transcodes perfectly. It's a moot point anyway since I rarely have to transcode anything. I installed Debian on the M.2 NVMe drive and moved over all my HDDs from my old server, but this time they could be internal since the motherboard has 4 SATA ports.

## Details

The operating system is Debian 12 with no desktop environment. Cockpit is installed for managing the server through a GUI. Tailscale is installed bare metal for connecting with phone and tablet from outside my home network, and with a free Oracle compute instance. (<a href="/blog/expose-plex-tailscale-vps" target="_blank">See here</a>.) Most self-hosted apps and services are run via Docker containers.

## Containers

- Filebrowser
- Gluetun
- Home Assistant
- IT Tools
- Kavita
- LibrePhotos
- Mosquitto
- Nginx Proxy Manager
- Opengist
- Paperless
- Plex
- Portainer
- qBittorrent
- Scrutiny
- Speedtest Tracker
- Stirling PDF
- Syncthing
- Tautulli
- Uptime Kuma
- Watchtower