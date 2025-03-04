---
title: "How to run self-hosted FileBrowser in Docker"
description: "FileBrowser is a self-hosted file manager for a specified directory in a Linux machine that lets you upload, download, move, copy, create, delete, rename, and edit your files in a nice web interface through your browser. Here's a quick guide to setting it up in Docker."
pubDate: 2022-11-04
updateDate: 2025-02-03
tags:
  - docker
---

## Pre-Requisites

It should go without saying, you need Docker installed to do this. If you don't have it installed yet, the easiest way is to run Docker's installation script from the terminal.

```bash
curl -fsSL get.docker.com | sudo sh
```

This script will install all Docker packages and the Docker Compose plugin, the latter of which we will use to install Filebrowser.

## Preparing the configuration file

> Make sure to do the below steps **prior** to starting the container or else it won't work!

Before starting the container, you need to create the FileBrowser directory, and within it a config file and database file. I'll be using FileBrowser's own suggested configuration with defaults.

```bash
mkdir filebrowser
touch filebrowser/settings.json filebrowser/filebrowser.db
```

Now edit the `settings.json` file and copy/paste the below:

```yaml
{
  "port": 80,
  "baseURL": "",
  "address": "",
  "log": "stdout",
  "database": "/database/filebrowser.db",
  "root": "/srv",
}
```

Leave `filebrowser.db` empty, it just needs to exist for FileBrowser to work properly.

## Start the FileBrowser container

We will assume you want to use FileBrowser to manage your home directory `~/` (that's how I use it), and that the directories/files we created above are also in the home directory. Also, we're mapping the container's internal port 80 to the Linux machine's port 8080. Make sure to change the ports and directory paths to whatever you want to use.

### Using docker run:

If you want to use plain ol' `docker run`, use these commands:

```bash
docker run \
    -v ~/:/srv \
    -v ~/filebrowser/database/filebrowser.db:/database/filebrowser.db \
    -v ~/filebrowser/settings.json:/config/settings.json \
    -e PUID=$(id -u) \
    -e PGID=$(id -g) \
    -p 8080:80 \
    filebrowser/filebrowser:s6
```

### Using Docker Compose:

If you want to use `docker compose`, create a `compose.yaml` file, copy and paste the below into it:

```yaml
services:
  filebrowser:
    container_name: filebrowser
    image: filebrowser/filebrowser:latest
    volumes:
      - ~/:/srv
      - ~/filebrowser/filebrowser.db:/database/filebrowser.db
      - ~/filebrowser/settings.json:/config/settings.json
    ports:
      - 8080:80
    environment:
      - TZ=America/New_York
      - PUID=1000
      - PGID=1000
    restart: unless-stopped
```

Make sure to use your own timezone, PUID and PGID. Now go to the directory containing the `compose.yaml` and run the below command:

```bash
docker compose up -d
```

Once the container is up and running, go to `http://ip-address:8080` in your web browser. (Substitute your own IP address and configured port.) You should see a login page, the default username and password are both _admin_ -- you can change this in the Settings page of the web UI later. Once logged in you should see the contents of the directory you configured displayed.

## References

- <a href="https://filebrowser.org" target="_blank" data-umami-event="setup-filebrowser-site">FileBrowser documentation</a>
- <a href="https://docs.docker.com" target="_blank" data-umami-event="setup-filebrowser-docker-docs">Docker documentation</a>
- <a href="https://docs.docker.com/compose/" target="_blank" data-umami-event="setup-filebrowser-compose-docs">Docker Compose documentation</a>

### Related Articles

- <a href="/blog/setting-up-plex-in-docker/" data-umami-event="setup-filebrowser-related-setup-plex">Setup self-hosted Plex Media Server in Docker</a>
- <a href="/blog/setting-up-jellyfin-in-docker/" data-umami-event="setup-filebrowser-related-setup-jellyfin">Setup self-hosted Jellyfin Media Server in Docker</a>