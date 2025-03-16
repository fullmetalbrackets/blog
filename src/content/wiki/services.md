---
title: "Self-Hosted Services"
description: "A list of self-hosted services in my homelab."
pubDate: 2023-10-02
updatedDate: 2025-02-10
tags:
  - services
---

> See <a href="/blog/how-i-setup-home-server/" target="_blank" data-umami-event="wiki-services-home-server-blog">this blog post</a> for more details.

# Athena

- File Browser
- Gluetun
- Home Assistant
- IT Tools
- Kavita
- LibrePhotos
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

# Outpost

- Nginx Proxy Manager -- <a href="/blog/expose-plex-tailscale-vps" target="_blank" data-umami-event="">To proxy to my Plex server back home via Tailscale</a>
- Portainer Agent -- Connected to main Portainer instance on home server via Tailscale
- Speedtest Tracker -- Mostly used as a "heartbeat" so the server is constantly in use
- File Browser -- For browsing the instance's `/home` directory when I can't SSH into it
- Uptime Kuma -- Alerts me if any of the containers go down or if home network is not accessible
- Watchtower -- Auto-update containers and prune old images