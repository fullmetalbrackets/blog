---
title: 'Setting up a Docker container stack with Docker Compose'
description: "I've been running a bunch of services on my home server in docker containers for a few years now. It's quick and easy to set up once you get used to it. Here's a quick and dirty guide to installing Docker and Docker Compose, and getting several containers up and running."
pubDate: 2022-09-29
updatedDate: 2024-11-04
tags: ['self-hosting', 'docker']
related1: watchtower-notifications
related2: setup-prometheus-cadvisor-grafana
---

> This will not be an exhaustive Docker tutorial, for that I always suggest <a href="https://docs.docker.com" target="_blank" data-umami-event="container-stack-compose-docs-docker">the official Docker documentation</a>. The purpose of this guide is limited to explaining how to install Docker and set up various Docker containers quickly and easily via Docker Compose.

## Installing Docker

In 2024 the easiest way to install Docker is to use the official script:

```bash
curl -fsSL get.docker.com | sudo sh
```

This will install all dependencies while uninstalling old or conflicting packages. Using this method includes the `docker compose` plugin which we'll be using.

## Setting up the Compose file

For setting up multiple containers via CLI we'll be using <a href="https://docs.docker.com/compose/" target="_blank" data-umami-event="container-stack-compose-docs-compose">Docker Compose</a>, which uses YAML files for configuration. Below is a `compose.yaml` based on own:

```yaml
services:
 plex:
  container_name: plex
  restart: unless-stopped
  image: linuxserver/plex:latest
  network_mode: host
  volumes:
   - /opt/docker/plex:/config
   - /opt/media/movies:/movies
   - /opt/media/music:/music
   - /opt/media/photos:/photos
   - /opt/media/tvshows:/tvshows
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
   - /opt/docker/airsonic:/config
   - /opt/media/music:/music
   - /opt/media/music/playlists:/playlists
   - /opt/media/music/podcasts:/podcasts
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
   - /opt/docker/ubooquity:/config
   - /opt/media/ebooks/books:/books
   - /opt/media/ebooks/comics:/comics
  restart: unless-stopped
  ports:
   - 2202:2202
   - 2203:2203

 filebrowser:
  container_name: filebrowser
  restart: unless-stopped
  image: filebrowser/filebrowser:latest
  volumes:
   - /opt/:/srv
   - /opt/docker/filebrowser/filebrowser.db:/database/filebrowser.db
   - /opt/docker/filebrowser/settings.json:/config/settings.json
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
   - /opt/docker/qflood:/config
   - /opt/media/downloads:/downloads
   - /opt/media/movies:/4kmovies
   - /opt/media/tvshows:/4ktvshows%

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

## Starting up the containers

Once the `compose.yaml` is ready, use the following command in the same directory where the file is located:

```bash
docker compose up -d
```

Using the `-d` flag will "detach" the process so it's in the background. You will see all the required container images be downloaded and the directories you specified in the compose file will also be set up. Once finished, use `docker ps` to list running containers and confirm your new services are up and running.

## References

- <a href="https://docs.docker.com" target="_blank" data-umami-event="container-stack-compose-docs-docker">Docker documentation</a>
- <a href="https://docs.docker.com/compose/" target="_blank" data-umami-event="container-stack-compose-docs-compose">Docker Compose documentation</a>
