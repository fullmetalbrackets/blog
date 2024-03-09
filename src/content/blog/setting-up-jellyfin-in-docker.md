---
title: "Setup self-hosted Jellyfin Media Server in Docker"
description: "Though Plex is a very popular media server for self-hosting, some open source enthusiasts prefer to use an alternative since Plex Media Server is not open source. A nice, simpler and admittedly less pretty alternative is Jellyfin. This guide will show you how to run it in Docker container."
pubDate: 2022-10-18
updatedDate: 2023-08-11
tags:
  - Self-Hosting
  - Jellyfin
  - Docker
---

## Table of Contents

1. [Installing Docker and Docker Compose](#install)
2. [Preparing and the Docker-Compose file](#compose)
3. [Starting the container and configuring Jellyfin](#config)
4. [Theming the web UI with custom CSS](#custom)
5. [References](#ref)

<div id='install'/>

## Installing Docker and Docker-Compose

I'll be quoting from the <a href="https://docs.docker.com/engine/install" target="_blank">Docker docs</a>, which as of mid-2023 recommend uninstalling older packages like the separate <code>docker-compose</code> in favor of the new <code>docker-compose-plugin</code>, among other things.

This post assumes you are installing on _Debian_ or _Ubuntu_, check the Docker docs for installation instructions on CentOS and it's offshoots, Fedora, RHEL, or Raspbian.

First, uninstall all conflicting packages:

```bash
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt remove $pkg; done
```

Install necessary packages to allow `apt` to use a repository over HTTPS:

```bash
sudo apt update
sudo apt install ca-certificates curl gnupg
```

Add Docker's official GPG key:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

Set up the repository:

```bash
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Now install Docker:

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo service docker start && sudo service docker enable
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

| Parameter                      | Function                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image`                        | Here we're using the latest version of the Linuxserver-maintained image.                                                                                                                                                                                                                                                                                                           |
| `container_name`               | Optional, but you should give your containers a name for clarity.                                                                                                                                                                                                                                                                                                                  |
| `PUID=1000`<br>`PGID=1000`     | These env variable sets a UID and GID for Jellyfin and should match the owner of the volumes you are adding; check your UID and GID with the command `id`.                                                                                                                                                                                                                         |
| `JELLYFIN_PublishedServerUrl=` | This will allow the server to be discoverable on your home network. Add this with your server's IP to easily connect your devices to Jellyfin. Make sure to map UDP port `7359` for this to work. (See below.)                                                                                                                                                                     |
| `ports`                        | This will map ports on your machine (left of the colon) to ports inside the container (right of the colon) -- optional in Linux but required in Windows and WSL.<br><br>Port `8096` is for HTTP access, `8920` for HTTPS (optional) and `7359:7359/udp` lets the server be discoverable on your local network when using the `JELLYFIN_PublishedServerUrl` parameter. (See above.) |
| `volumes`                      | Here we're mapping local directories (left of the colon) to directories inside the container (right of the colon).                                                                                                                                                                                                                                                                 |
| `restart`                      | This tells Docker under what circumstances to restart the container when it is stopped -- the options are `no`, `always`, `on-failure` and `unless-stopped`.                                                                                                                                                                                                                       |

If you'd like to use hardware acceleration, <a href="https://jellyfin.org/docs/general/administration/hardware-acceleration" target="_blank" rel="noreferrer noopener">see this part of the Jellyfin documentation</a>. If the machine you're hosting Jellyfin on has an Intel CPU, there's a good chance is supports Quick Sync and you should let Jellyfin use it. To do so, add the following option to your docker compose:

```yaml
devices:
  - /dev/dri/renderD128:/dev/dri/renderD128
  - /dev/dri/card0:/dev/dri/card0
```

<div id='config'/>

## Starting the container and configuring Jellyfin

Once your `docker-compose.yml` is ready, use the command `docker compose up -d` from within the same directory as the `docker-compose.yml` to run it. After completion, use the command `docker ps` to verify the container is up and running. You should see output similar to the below:

```bash
CONTAINER ID   IMAGE                                 COMMAND   CREATED         STATUS         PORTS                                                                   NAMES
7383028393f4   lscr.io/linuxserver/jellyfin:latest   "/init"   9 seconds ago   Up 7 seconds   0.0.0.0:8096->8096/tcp, 0.0.0.0:8920->8920/tcp, 0.0.0.0:359->7359/udp   jellyfin
```

Good to go. Now to configure Jellyfin you'll need to access it's web UI, which by default is at (for example) `http://192.168.0.100:8096`. On the first page you'll be asked to choose a language and can also use the Quick Start if desired, for purposes of this guide we'll choose _English_ and click _Next_. On the following page you can create a user and password (or you can use no password if preferred), create your login and click _Next_.

<a href="/img/blog/jellyfin1.png" target="_blank"><img src="/img/blog/jellyfin1.png" loading="lazy" decoding="async" alt="Screenshot of jellyfin user creation." /></a>

You'll be taken to setup your media libraries, click on _Add Media Library_.

<a href="/img/blog/jellyfin2.png" target="_blank"><img src="/img/blog/jellyfin2.png" loading="lazy" decoding="async" alt="Screenshot of Jellyfin media library setup." /></a>

In the Content Type drop down menu, choose like kind of media you're adding. For this guide we'll choose _Movies_, then click _Ok_.

<a href="/img/blog/jellyfin3.png" target="_blank"><img src="/img/blog/jellyfin3.png" loading="lazy" decoding="async" alt="Screenshot of creating a movie library in Jellyfin." /></a>

A series of options will appear, read through them and make your choices, or just leave the defaults if you don't want to change anything. To add a folder to the library, click the _Plus (+) button_ and you'll get a pop-up where you can choose a folder. Choose from the list, or type out the path, and click _Ok_ (You can also add a network share as the folder.)

<a href="/img/blog/jellyfin4.png" target="_blank"><img src="/img/blog/jellyfin4.png" loading="lazy" decoding="async" alt="Screenshot of adding a folder to the Jellyfin movie library." /></a>

On the following page you can set up remote access to Jellyfin, meaning whether other devices will be able to access Jellyfin. Check the box _Allow remote connections to this server_, but leave unchecked _Enable automatic port mapping_ unless you want to access Jellyfin from outside your network. (You'll additionally need to open port 8096 on your router for that. I don't suggest it.) Then click _Next_.

<a href="/img/blog/jellyfin5.png" target="_blank"><img src="/img/blog/jellyfin5.png" loading="lazy" decoding="async" alt="Screenshot of set up remote access in Jellyfin." /></a>

Your movies should now appear within the _Movies_ section of the Jellyfin UI. Repeat the process to add other directories for your _TV_, _Music_, _Books_, _Photos_ and other libraries if desired. And you're done! You can now watch jellyfin right in the web UI.

<div id='custom'/>

## Theming the web UI with custom CSS

If you'd like to change the web GUI's colors and vibe, you'll need the <a href="https://github.com/danieladov/jellyfin-plugin-skin-manager" target="_blank">Skin Manager</a> community plugin. (These affect the web UI accessed via the browser only.) As per the directions on their GitHub:

1. In jellyfin, go to _Dashboard_ -> _Plugins_ -> _Repositories_ -> add and paste this link `https://raw.githubusercontent.com/danieladov/JellyfinPluginManifest/master/manifest.json`
2. Go to Catalog and search for Skin Manager
3. Click on it and install
4. Restart Jellyfin

Use `docker restart jellyfin` and once the Jellyfin container has restarted, go back into the GUI, go to _Dashboard_ -> _Plugins_ and click on _Skin Manager_. Use the dropdown menu to pick a skin (my favorite is <a href="https://github.com/prayag17/JellySkin" target="_blank">JellySkin</a>), tweak any options if it has them, and click _Set Skin_. If it doesn't switch to the new time right away, try a hard refresh with <kbd>Ctrl</kbd> + <kbd>F5</kbd>. Also, sometimes <a href="https://github.com/danieladov/jellyfin-plugin-skin-manager#using-with-reverse-proxy" target="_blank">Nginx Proxy Manager</a> the skins won't work due to CSP issues. (I haven't encountered this problem, but [I have my reverse proxy set up without HTTPS](reverse-proxy-nginx-pihole.md) and that may be why.)

<div id='ref'/>

## References

- <a href="https://linuxserver.io" target="_blank">Linuxserver</a>
- <a href="https://jellyfin.org" target="_blank">Jellyfin</a>
- <a href="https://docker.com" target="_blank">Docker</a>
