---
title: 'Docker Compose for Umami, Cloudflare Tunnel and Watchtower'
description: 'Working compose file for self-hosting Umami Analytics, exposing it publically via Cloudflare Tunnel and auto-updating with Watchtower.'
pubDate: 2026-03-15
tag: technical notes
related: ['self-host-website-cloudflare-tunnel', 'setup-cloudflare-tunnel-to-access-self-hosted-apps']
---

```yaml
services:

  watchtower:
    container_name: watchtower
    image: nickfedor/watchtower
    restart: unless-stopped
    environment:
      - WATCHTOWER_NOTIFICATION_URL=discord://...
      - WATCHTOWER_NOTIFICATIONS_HOSTNAME=
      - WATCHTOWER_CLEANUP=true
      - WATCHTOWER_INCLUDE_STOPPED=true
      - WATCHTOWER_REVIVE_STOPPED=false
      - WATCHTOWER_SCHEDULE=0 0 4 * * *
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

  umami:
    container_name: umami
    image: ghcr.io/umami-software/umami:latest
    ports:
      - 3000:3000
    environment:
      DATABASE_URL: postgresql://umami:umami@db:5432/umami
      APP_SECRET: 
      CLIENT_IP_HEADER: CF-Connecting-IP
    depends_on:
      db:
        condition: service_healthy
    init: true
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "curl http://localhost:3000/api/heartbeat"]
      interval: 5s
      timeout: 5s
      retries: 5
  db:
    container_name: postgres
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD:
    volumes:
      - /home/ad/docker/umami:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

  cloudflared:
      container_name: tunnel
      image: cloudflare/cloudflared:latest
      command: tunnel --no-autoupdate --metrics 0.0.0.0:2000 run --token ${apiToken}
      depends_on:
        umami:
          condition: service_healthy
```
