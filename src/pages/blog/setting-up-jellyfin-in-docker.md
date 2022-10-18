---
layout: "../../layouts/BlogPost.astro"
title: "Setup self-hosted Jellyfin Media Server in Docker"
description: "Though Plex is a very popular media server for self-hosting, some open source enthusiasts prefer to use an alternative since Plex Media Server is not open source. A nice, simpler and admittedly less pretty alternative is Jellyfin. This guide will show you how to run it in Docker container."
pubDate: "October 18, 2022"
tags:
  - Self-Hosting
  - Jellyfin
  - Docker
---

## Table of Contents

1. [Installing Docker and Docker-Compose](#install)
2. [Preparing and the Docker-Compose file](#compose)
3. [Starting the container and configuring Jellyfin](#config)
4. [References](#ref)

<div id='install'/>

## Installing Docker and Docker-Compose

If you don't have Docker installed, your first order of business is to do so. For this guide I'll also be using Docker-Compose, since it makes creating Docker containers even easier and more user-friendly just using the standard `docker` command.

Use the below command to install both Docker and Docker-Compose, and their dependencies:

```bash
sudo apt install docker docker-compose -y
```

Now start the Docker daemon and enable it to start at boot:

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

<div id='compose'/>

## Preparing the Docker-Compose file

Though Jellyfin has an <a href="https://hub.docker.com/r/jellyfin/jellyfin" target="_blank">official Docker image</a>, I highly suggest you instead use the <a href="https://hub.docker.com/r/linuxserver/jellyfin" target="_blank">Linuxserver image</a>, which is built and maintained by the <a href="https://www.linuxserver.io" target="_blank">Linuxserver community</a>. I've run the Linuxserver image of Jellyfin without issue, and it seems that to be the most common way to run Jellyfin.

Here is an example `docker-compose.yml` file to setup jellyfin:

```yaml
---
version: "3"
services:
  jellyfin:
    image: lscr.io/linuxserver/jellyfin:latest
    container_name: jellyfin
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/New_York
      - JELLYFIN_PublishedServerUrl=192.168.0.100
    volumes:
      - ~/docker/jellyfin:/config
      - ~/media/tvshows:/data/tvshows
      - ~/media/movies:/data/movies
    ports:
      - 8096:8096
      - 8920:8920
      - 7359:7359/udp
    restart: unless-stopped
```

Let's break down what each of these parameters do:

| Paramter                   | Function                                                                                                                                                                                                                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image`                    | Here we're using the latest version of the Linuxserver-maintained image                                                                                                                                                                                                                              |
| `container_name`           | Optional, but you should give your containers a name for clarity                                                                                                                                                                                                                                     |
| `PUID=1000`<br>`PGID=1000` | These env variable sets a UID and GID for Jellyfin and should match the owner of the volumes you are adding; check your UID and GID with the command `id`                                                                                                                                            |
| `ports`                    | This will map ports on your machine (left of the colon) to ports inside the container (right of colon) -- optional in Linux but required in Windows and WSL<br>Port `8096` is for HTTP access, `8920` for HTTPS (optional) and `7359:7359/udp` lets the server be discoverable on your local network |
| `volumes`                  | Here we're mapping local directories (left of the colon) to directories inside the container (right of the colon)                                                                                                                                                                                    |
| `restart`                  | This tells Docker under what circumstances to restart the container when it is stopped -- the options are `no`, `always`, `on-failure` and `unless-stopped`                                                                                                                                          |

<div id='config'/>

## Starting the container and configuring Jellyfin

Once your `docker-compose.yml` is ready, use the command `docker-compose up -d` from within the same directory as the `docker-compose.yaml` to run it. After completion, use the command `docker ps` to verify the container is up and running. You should see output similar to the below:

```bash
CONTAINER ID   IMAGE                                 COMMAND   CREATED         STATUS         PORTS                                                                   NAMES
7383028393f4   lscr.io/linuxserver/jellyfin:latest   "/init"   9 seconds ago   Up 7 seconds   0.0.0.0:8096->8096/tcp, 0.0.0.0:8920->8920/tcp, 0.0.0.0:359->7359/udp   jellyfin
```

Good to go. Now to configure Jellyfin you'll need to access it's web UI, which by default is at (for example) `http://192.168.1.100:8096`. On the first page you'll be asked to choose a language and can also use the Quick Start if desired, for purposes of this guide we'll choose _English_ and click _Next_. On the following page you can create a user and password (or you can use no password if preferred), create your login and click _Next_.

<a href="/img/jellyfin1.png" target="_blank"><img src="/img/jellyfin1.png" alt="Screenshot of jellyfin user creation." /></a>

You'll be taken to setup your media libraries, click on _Add Media Library_.

<a href="/img/jellyfin2.png" target="_blank"><img src="/img/jellyfin2.png" alt="Screenshot of Jellyfin media library setup." /></a>

In the Content Type drop down menu, choose like kind of media you're adding. For this guide we'll choose _Movies_, then click _Ok_.

<a href="/img/jellyfin3.png" target="_blank"><img src="/img/jellyfin3.png" alt="Screenshot of creating a movie library in Jellyfin." /></a>

A series of options will appear, read through them and make your choices, or just leave the defaults if you don't want to change anything. To add a folder to the library, click the _Plus (+) button_ and you'll get a pop-up where you can choose a folder. Choose from the list, or type out the path, and click _Ok_ (You can also add a network share as the folder.)

<a href="/img/jellyfin4.png" target="_blank"><img src="/img/jellyfin4.png" alt="Screenshot of adding a folder to the Jellyfin movie library." /></a>

On the following page you can set up remote access to Jellyfin, meaning whether other devices will be able to access Jellyfin. You'll need the line `JELLYFIN_PublishedServerUrl=192.168.0.100` (replacing with your own IP) under `env` in your `docker-compose.yml` file for it to work. If you have that, then check the box _Allow remote connections to this server_, but leave unchecked _Enable automatic port mapping_ unless you want to access Jellyfin from outside your network. (You'll additionally need to open port 8096 on your router for that.) Then click _Next_.

<a href="/img/jellyfin5.png" target="_blank"><img src="/img/jellyfin5.png" alt="Screenshot of set up remote access in Jellyfin." /></a>

Your movies should now appear within the _Movies_ section of the Jellyfin UI. Repeat the process to add other directories for your _TV_, _Music_, _Books_, _Photos_ and other libraries if desired. And you're done! You can now watch jellyfin right in the web UI.

<div id='ref'/>

## References

- <a href="https://linuxserver.io" target="_blank">Linuxserver</a>
- <a href="https://jellyfin.org" target="_blank">Jellyfin</a>
- <a href="https://docker.com" target="_blank">Docker</a>
