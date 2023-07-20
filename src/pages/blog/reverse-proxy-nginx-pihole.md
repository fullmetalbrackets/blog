---
layout: "@layouts/BlogPost.astro"
title: "Reverse proxy OpenMediaVault, Plex and Navidrome with Nginx Proxy Manager and Pi-Hole"
description: "My scenario was simple: I wanted to access the web GUIs of OpenMediaVault, Plex and Navidrome via a URL like subdomain.example.tld without having to remember IPs and ports, inside my home network only and without the need for SSL/HTTPS. Nothing fancy, nothing accessible from outside my house. Here's how I did that with Nginx Proxy Manager as the reverse proxy and Pi-Hole as the DNS."
pubDate: "July 15, 2023"
tags:
  - Self-Hosting
  - Reverse Proxy
  - Nginx
---

## Sections

1. [Pre-Requisites and Caveats](#pre)
2. [Change the port of OpenMediaVault's workbench GUI](#omv)
3. [Add the DNS records in Pi-Hole](#pihole)
4. [Install the Nginx Proxy Manager container](#npm)
5. [Create the proxy hosts](#proxy)
6. [References](#ref)

<div id='pre' />

## Pre-Requisites and Caveats

I will not be explaining here how to install any services besides Nginx Proxy Manager, but I have other blog posts about <a href="http://localhost:3000/blog/set-up-pihole-on-linux" target="_blank">installing Pi-Hole</a> and <a href="http://localhost:3000/blog/setting-up-plex-in-docker" target="_blank">installing Plex</a> you can check out. OpenMediaVault is more involved since it's a whole operating system installed via an ISO, so check out the <a href="https://docs.openmediavault.org/en/latest/installation/index.html" target="_blank">official documentation</a> for instructions on that. The guide will proceed with the assumption that OpenMediaVault, Plex and Navidrome are already setup, and you're now wanting to set up a reverse proxy, since that was my scenario and I wanted to write it down for future reference.

<div id='omv' />

## Change the port of OpenMediaVault's workbench GUI

By default, OpenMediaVault's workbench GUI is accessible on port 80, but Nginx Proxy Manager needs access to port 80, so we'll need OMV workbench to be on another port. (If yours is already on another port, you can skip this section.) Changing the port is quick and easy. SSH into the OVM server as `root` or a user with root privileges and use the following command:

```bash
omv-firstaid
```

You'll get a menu pop-up, choose `3   Configure workbench` and hit <kbd>Enter</kbd>, you'll see `Please enter the port to access the workbench via HTTP`. Delete the `80` and type in whatever port you want to use, I chose port `70`. Hit <kbd>Enter</kbd> again to save and we're done here.

<div id='pihole' />

## Add the DNS records in Pi-Hole

As I explained above, I use Pi-Hole as a network-wide DNS resolver, and it's really easy to add A/AAAA records to point a domain at an IP address through their web UI. Just click on _Local DNS_ on the sidebar, then click on _DNS Records_. On the following page, add the `subdomain.domain.tld` entries you want to use (I'll be using `*.home.arpa` per the <a href="https://www.rfc-editor.org/rfc/rfc8375.html" target="_target">RFC recommendation</a> for home networks) and point them all at the same IP address where you'll be running Nginx Proxy Manager, in my case that's `192.100.0.100`. Make sure you click the _Add_ button after each one and wait a few moments until it shows up in the list of local domains below before adding the next one.

- `omv.home.arpa`
- `plex.home.arpa`
- `music.home.arpa`

<div id='npm' />

## Install Nginx Proxy Manager

We'll be using _Docker-Compose_ to install Nginx Proxy Manager. If you don't have it already, use `sudo apt install docker-compose` to install it. Create a `docker-compose.yml` file and insert the following:

```yaml
version: "3.7"

services:
  Nginx-proxy-manager:
    container_name: Nginx-proxy-manager
    image: "jc21/Nginx-proxy-manager:latest"
    ports:
      - "80:80"
      - "81:81"
      - "443:443"
    volumes:
      - <path-to-Nginx-proxy-manager-local-directory>/data:/data
      - <path-to-Nginx-proxy-manager-local-directory>/letsencrypt:/etc/letsencrypt
    restart: unless-stopped
```

Now run the command `docker-compose up -d` within the same directory as the compose file to create the container.

If you're running _Portainer_ and want to create the container from within it's UI, go into your environment, click _Stacks_ from the sidebar, then the _+ Add Stack_ button at the top-left. Name the stack, copy and paste the contents of the `docker-compose.yml` into the web editor, then scroll down and click the button `Deploy the stack`.

<div id='proxy' />

## Create the proxy hosts

Go into the Nginx Proxy Manager web UI at `http://<your-ip-address>:81` and create the Administrator user as prompted. To add proxy hosts click on _Hosts_ on the navigation bar at the top, then click the _Add Proxy Host_ button. We'll proxy OpenMediaVault first. You'll begin in the _Details_ tab, which is all you'll need to use for OMV, Plex and Navidrome. Add the following: (Substitute with your own domain and IP address.)

- Domain Names: `omv.home.arpa`
- Scheme: `http`
- Forward Hostname/IP: `192.168.0.100`
- Forward Port: `70`

Leave the rest as-is and click the _Save_ button. You should see your new proxy host on the list, and under _Status_ it should say Online. Go to `omv.home.arpa` on your browser to test it out. If it works, we can go ahead and add the rest of the proxy hosts.

For the _Plex_ proxy host, use the following entries:

- Domain Names: `plex.home.arpa`
- Scheme: `http`
- Forward Hostname/IP: `192.168.0.100`
- Forward Port: `32400`

For the _Navidrome_ proxy host, use the following entries:

- Domain Names: `music.home.arpa`
- Scheme: `http`
- Forward Hostname/IP: `192.168.0.100`
- Forward Port: `4533`

Go to the URLs, don't use any ports (like `:32400`) or directories (like `/web`), and it should work as intended. If you have any issues, check the Nginx Proxy Manager container logs. You can do so from the OVM workbench by going to _Services_ in the sidebar, click _Compose_, then from the dropdown menu click _Containers_, then select the Nginx Proxy Manager container and click the _Logs_ button at the top. Alternately you can just SSH into OMV and use the command `docker logs nginx-proxy-manager`. (Or whatever `container_name` you used for it when creating the container.)

<div class="note">
  <span>
    <img src="/img/assets/note.svg" class="note-icon">
    <b>Note</b>
  </span>
  <p>
    If you ever try to use a proxied URL and it doesn't work, give it a minute or two and try again. Nginx Proxy Manager runs a cronjob every hour on the hour where it renews SSL certificates and then reloads Nginx -- even if there's no SSL certificates installed or if any installed certificates are a long time away from expiring. If you check the container logs you'll see it.
  </p>
  <p>
    During this certificate renewal process your proxy hosts will not work until after Nginx reloads. Unfortunately there's no way to change this behavior.
  </p>
</div>

<div id='ref' />

## Reference

- <a href="http://localhost:3000/blog/set-up-pihole-on-linux" target="_blank">My blog post on how to install Pi-Hole</a>
- <a href="http://localhost:3000/blog/setting-up-plex-in-docker" target="_blank">My blog post on how to install Plex</a>
- <a href="https://docs.openmediavault.org/en/latest" target="_blank">OpenMediaVault 6 documentation</a>
- <a href="https://nginxproxymanager.com" target="_blank">Nginx Proxy Manager website</a>
