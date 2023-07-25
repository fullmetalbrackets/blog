---
layout: "@layouts/BlogPost.astro"
title: "Setting up a Docker container stack with Docker-Compose"
description: "I've been running a bunch of services on my home server in docker containers for a few years now. It's quick and easy to set up once you get used to it. Here's a quick and dirty guide to installing Docker and Docker-Compose, and getting several containers up and running."
pubDate: "September 29, 2022"
tags:
  - Self-Hosting
  - Docker
  - Linux
  - Command Line
---

## Sections

1. [Installing Docker and Docker-Compose](#install)
2. [Setting up a Docker-Compose file](#compose)
3. [Starting up the containers](#start)
4. [References](#ref)

<div>
  <div class="note">
    <span>
      <img src="/img/assets/note.svg" class="note-icon">
      <b>Note</b>
    </span>
    <p>
      This will not be an exhaustive Docker tutorial, for that I always suggest <a href="https://docs.docker.com" target="_blank">the official Docker documentation</a>. The purpose of this guide is limited to explaining how to install Docker and set up various Docker containers quickly and easily via Docker-Compose.
    </p>
  </div>
</div>

<div id='install'/>

## Installing Docker and Docker-Compose

First, install Docker and Docker-Compose, and start/enable the Docker service:

```bash
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
```

<div id='compose'/>

## Setting up a Docker-Compose file

For setting up multiple containers via CLI we'll be using <a href="https://docs.docker.com/compose/" target="_blank">Docker-Compose</a>, which uses YAML files for configuration. Below is a `docker-compose.yml` based on own:

```yaml
version: "3"

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

- <em>Plex</em>: Personal media streaming server
- <em>Airsonic</em>: Music player and streaming server
- <em>Ubooquity</em>: Read and manage ebooks and comics
- <em>File Browser</em>: A web-based file manager
- <em>qFlood</em>: qBittorrent and Flood UI
- <em>Watchtower</em>: Automatically updates containers

<div id='start'/>

## Starting up the containers

Once the `docker-compose.yml` is ready, use the following command in the same directory where the file is located:

```bash
docker-compose up -d
```

Using the `-d` flag will "detach" the process so it's in the background. You will see all the required container images be downloaded and the directories you specified in the compose file will also be set up. Once finished, use `docker ps` to list running containers and confirm your new services are up and running.

<div id='ref'/>

## References

- <a href="https://docs.docker.com" target="_blank">Docker documentation</a>
- <a href="https://docs.docker.com/compose/" target="_blank">Docker-Compose documentation</a>
