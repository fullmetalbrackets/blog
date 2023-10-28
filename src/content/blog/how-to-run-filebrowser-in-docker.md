---
title: "How to run self-hosted FileBrowser in Docker"
description: "FileBrowser is a self-hosted file manager for a specified directory in a Linux machine that lets you upload, download, move, copy, create, delete, rename, and edit your files in a nice web interface through your browser. Here's a quick guide to setting it up in Docker."
pubDate: 2022-11-04
tags:
  - Self-Hosting
  - FileBrowser
  - Docker
  - Linux
---

## Sections

1. [Pre-Requisites](#prereq)
2. [Preparing the configuration file](#config)
3. [Start the FileBrowser container](#run)
4. [References](#ref)

<div id='prereq'/>

## Pre-Requisites

It should go without saying, you need Docker installed to do this. Use the below commands if you don't have it installed yet:

```bash
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
```

That's all you need, but I'm also going to explain how to install via docker-compose. So make sure that's installed too if you're going to go that route:

```bash
sudo apt install docker-compose -y
```

<div id='config'/>

## Preparing the configuration file

<div class="alert">
  <span>
    <img src="/img/assets/alert.svg" class="alert-icon"> <b>Important!</b>
  </span>
  <p>
    Make sure to do the below steps <em>prior</em> to starting the container or else it won't work!
  </p>
</div>

Before starting the container, you need to create the FileBrowser directory, and within it a config file and database file. I'll be using FileBrowser's own suggested configuration with defaults.

```bash
mkdir filebrowser filebrowser/database
touch filebrowser/settings.json filebrowser/database/filebrowser.db
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

<div id='run'/>

## Start the FileBrowser container

We will assume you want to use FileBrowser to manage your home directory `~/` (that's how I use it), and that the directories/files we created above are also in the home directory. Also, we're mapping the container's internal port 80 to the Linux machine's port 8080. Make sure to change the ports and directory paths to whatever you want to use.

### Using docker run:

If you're just using Docker without Docker-Compose, use these commands:

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

### Using docker-compose:

If you want to use Docker-Compose, here's the contents of the `docker-compose.yaml`:

```yaml
version: "3"

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

Make sure to use your own timezone, PUID and PGID. Now go to the directory containing the `docker-compose.yaml` and run the below command:

```bash
docker-compose up -d
```

Once the container is up and running, go to `http://ip-address:8080` in your web browser. (Substitute your own IP address and configured port.) You should see a login page, the default username and password are both _admin_ -- you can change this in the Settings page of the web UI later. Once logged in you should see the contents of the directory you configured displayed.

<div id='ref'/>

## References

- <a href="https://filebrowser.org" target="_blank">FileBrowser documentation</a>
- <a href="https://docs.docker.com" target="_blank">Docker documentation</a>
- <a href="https://docs.docker.com/compose/" target="_blank">Docker-Compose documentation</a>
