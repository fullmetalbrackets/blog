---
title: "Setting up a Docker container stack with Docker Compose"
description: "I've been running a bunch of services on my home server in docker containers for a few years now. It's quick and easy to set up once you get used to it. Here's a quick and dirty guide to installing Docker and Docker Compose, and getting several containers up and running."
pubDate: 2022-09-29
updatedDate: 2024-11-04
tags:
  - docker
---

## Sections

1. [Installing Docker](#install)
2. [Setting up the Compose file](#compose)
3. [Starting up the containers](#start)
4. [References](#ref)

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> This will not be an exhaustive Docker tutorial, for that I always suggest <a href="https://docs.docker.com" target="_blank">the official Docker documentation</a>. The purpose of this guide is limited to explaining how to install Docker and set up various Docker containers quickly and easily via Docker Compose.

<div id='install'/>

## Installing Docker

In 2024 the easiest way to install Docker is to use the official script:

```bash
curl -fsSL get.docker.com | sudo sh
```

This will install all dependencies while uninstalling old or conflicting packages. Using this method includes the `docker compose` plugin which we'll be using.

<div id='compose'/>

## Setting up the Compose file

For setting up multiple containers via CLI we'll be using <a href="https://docs.docker.com/compose/" target="_blank">Docker Compose</a>, which uses YAML files for configuration. Below is a `compose.yaml` based on own:

```yaml
services:
  plex:
    container_name: plex
    restart: unless-stopped
    image: linuxserver/plex:latest
    network_mode: host
    volumes:
      - ~/docker/plex:/config
      - ~/shared/movies:/movies
      - ~/shared/music:/music
      - ~/shared/photos:/photos
      - ~/shared/tvshows:/tvshows
    environment:
      - TZ=America/New_York
      - PLEX_UID=1000
      - PLEX_GID=1000

  airsonic-advanced:
    image: lscr.io/linuxserver/airsonic-advanced:latest
    container_name: airsonic
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ~/docker/airsonic:/config
      - ~/shared/music:/music
      - ~/shared/music/playlists:/playlists
      - ~/shared/music/podcasts:/podcasts
    ports:
      - 4040:4040
    restart: unless-stopped

  ubooquity:
    image: linuxserver/ubooquity
    container_name: ubooquity
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
    volumes:
      - ~/docker/ubooquity:/config
      - ~/shared/ebooks/books:/books
      - ~/shared/ebooks/comics:/comics
    restart: unless-stopped
    ports:
      - 2202:2202
      - 2203:2203

  filebrowser:
    container_name: filebrowser
    restart: unless-stopped
    image: filebrowser/filebrowser:latest
    volumes:
      - ~/:/srv
      - ~/docker/filebrowser/filebrowser.db:/database/filebrowser.db
      - ~/docker/filebrowser/settings.json:/config/settings.json
    ports:
      - 8080:80
    environment:
      - TZ=America/New_York
      - PUID=1000
      - PGID=1000

  qflood:
    container_name: qflood
    image: cr.hotio.dev/hotio/qflood
    ports:
      - 8800:8080
      - 3300:3000
    environment:
      - PUID=1000
      - PGID=1000
      - UMASK=002
      - TZ=America/New_York
      - FLOOD_AUTH=false
    volumes:
      - ~/docker/qflood:/config
      - ~/shared/downloads:/downloads
      - ~/shared/movies:/4kmovies
      - ~/shared/tvshows:/4ktvshows%

  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: always
```

This will create and run the following containers:

- **Plex**: Personal media streaming server
- **Airsonic**: Music player and streaming server
- **Ubooquity**: Read and manage ebooks and comics
- **File Browser**: A web-based file manager
- **qFlood**: qBittorrent and Flood UI
- **Watchtower**: Automatically updates containers

<div id='start'/>

## Starting up the containers

Once the `compose.yaml` is ready, use the following command in the same directory where the file is located:

```bash
docker compose up -d
```

Using the `-d` flag will "detach" the process so it's in the background. You will see all the required container images be downloaded and the directories you specified in the compose file will also be set up. Once finished, use `docker ps` to list running containers and confirm your new services are up and running.

## Related Articles

> [Setup Watchtower to auto-update Docker containers with notifications](/blog/watchtower-notifications/)

> [Setup Prometheus, Node Exporter, Cadvisor and Grafana in Docker](/blog/setup-prometheus-cadvisor-grafana/)

<div id='ref'/>

## References

- <a href="https://docs.docker.com" target="_blank">Docker documentation</a>
- <a href="https://docs.docker.com/compose/" target="_blank">Docker Compose documentation</a>
