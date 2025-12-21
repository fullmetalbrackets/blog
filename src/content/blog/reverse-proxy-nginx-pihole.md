---
title: "Reverse proxy OpenMediaVault, Plex and Navidrome with Nginx Proxy Manager and Pi-Hole"
description: "My scenario was simple: I wanted to access the web GUIs of OpenMediaVault, Plex and Navidrome via a URL like plex.home.arpa without having to remember IPs and ports, inside my home network only and without the need for SSL/HTTPS. Nothing fancy, nothing accessible from outside my house. Here's how I did that with Nginx Proxy Manager as the reverse proxy and Pi-Hole as the DNS."
pubDate: 2023-07-15
updatedDate: 2025-12-21
tags: ["self-hosting", "openmediavault", "nginx proxy manager"]
related1: reverse-proxy-using-nginx-pihole-cloudflare
related2: openmediavault-quick-reference
---

> [warning] **Important**
>
> This is a simple guide to get a reverse proxy working *without TLS certificates* and therefore *not using HTTPS* to access services.
>
> If you want to use HTTPS using *Cloudflare* and a *DNS challenge* to provision TLS certificates, [see this blog post](/blog/reverse-proxy-using-nginx-pihole-cloudflare).

## Pre-Requisites and Caveats

I will only be explaining how to install and configure _Nginx Proxy Manager_, as I have other blog posts about <a href="/blog/set-up-pihole-on-linux/" target="_blank">installing Pi-Hole</a> and <a href="/blog/setting-up-plex-in-docker/" target="_blank">installing Plex</a> that you can check out for that. OpenMediaVault is more involved since it's a whole operating system installed via an ISO, so I highly suggest you read the <a href="https://docs.openmediavault.org/en/latest/installation/index.html" target="_blank">official documentation</a> for instructions on that.

This guide will proceed with the assumption that _OpenMediaVault_, _Plex_ and _Navidrome_ are already setup, and you're now wanting to set up a reverse proxy to access them via URL rather than typing an IP address and port, since that was my scenario and I wanted to write it down for future reference.

## Change the port of OpenMediaVault's workbench GUI

By default, OpenMediaVault's workbench GUI is accessible on port `80`, but Nginx Proxy Manager needs access to port `80`, so we'll need OMV workbench to be on another port. (If yours is already on another port, you can skip this section.) Changing the port is quick and easy. Login to the OVM server's terminal as `root` or a user with root privileges and use the following command:

```bash
omv-firstaid
```

You'll get a menu pop-up, choose `3   Configure workbench` and hit <kbd>Enter</kbd>, you'll see `Please enter the port to access the workbench via HTTP`. Delete the `80` and type in whatever port you want to use, I chose port `70`. Hit <kbd>Enter</kbd> again to save and we're done here.

## Add the DNS records in Pi-Hole

I use _Pi-Hole_ as a network-wide DNS resolver, and you can add DNS records to point a domain at an IP address through their web UI. It's very simple.

> I will be using <code>*.home.arpa</code> (per the <a href="https://www.rfc-editor.org/rfc/rfc8375.html" target="_target">RFC recommendation</a> for home networks) and not worrying about HTTPS at this time. See <a href="/blog/reverse-proxy-using-nginx-pihole-cloudflare/">this blog post about setup Nginx Proxy Manager for HTTPS with a custom domain</a>.

1. Click on **Local DNS** on the sidebar, then click on **DNS Records**.
2. On the **Domain:** form, type in the full subdomain and domain you want to use, e.g. `plex.home.arpa`.
3. On the **IP address** form, type in the _IP address of the server running Nginx Proxy Manager_ -- in my case that's `192.168.0.100`, which I will use in all examples.
4. Click the **Add** button and wait a moment until it shows up in the list of local domains below.

**Repeat this for each domain you want to add**, always using the IP address of the server running Nginx Proxy Manager, **NOT** the IP of the service you are proxying. This is important! For the services I want to proxy, I did this:

- Domain: `omv.home.arpa`, IP Address: `192.168.0.100`
- Domain: `plex.home.arpa`, IP Address: `192.168.0.100`
- Domain: `music.home.arpa`, IP Address: `192.168.0.100`

## Change the port of Pi-Hole's web UI

If your Pi-Hole is on a separate host from where you will install Nginx Proxy Manager, skip this section. However if you want to run Nginx Proxy Manager on the same host running Pi-Hole, as I did, then you'll need to change the Pi-Hole's web UI port since it is also port `80` by default, which will conflict with Nginx Proxy Manager.

If you run Pi-Hole in a docker container, simply change the container's port mapping and recreate the container. In the `docker run` command or `compose.yaml` file, change `80:80` (specifically the one left of the colon, which is the host mapping) to something else, for example `8080:80`.

If you are running Pi-Hole bare metal instead of in Docker, you need to edit the Lighttpd configuration file at `/etc/lighttpd/lighttpd.conf` and change the line `server.port = 80` to your desired port, e.g. `server.port = 8080`.

## Install and run Nginx Proxy Manager

Nginx Proxy Manager runs as a Docker container, so if you haven't already make sure you install Docker. You can do so via <a href="https://wiki.omv-extras.org" target="_blank">OMV-Extras</a> or just SSH into the server running OpenMediaVault and use this command:

```bash
curl -fsSL get.docker.com | sudo sh
```

I'll be using `docker compose` to install Nginx Proxy Manager, it's my preferred way of running Docker containers. 

Create a `compose.yml` file and insert the following (or add it to an existing file):

```yaml
services:
  nginx-proxy-manager:
    container_name: nginx-proxy-manager
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

_Be sure to type in your own local paths_ to where you want Nginx Proxy Manager's directory to live in your server, e.g. `/opt/docker/nginxproxymanager/data`, etc. Using volumes as shown in the compose file example above makes your configuration files persistent and easy to migrate, so I highly recommend it.

Now run the command `docker compose up -d` (using the `-d` flag has it run in the background as a daemon) within the same directory where the compose file is located to create the container.

If you are running **Portainer** and want to create the container from within it's UI -- rather than creating the compose file and using commands in the terminal -- do the following:

1. In the Portainer UI, go into your environment and click **Stacks** from the sidebar.
2. Click the **+ Add Stack** button at the top-left. Name the stack, copy and paste the contents of the `compose.yaml` above into the web editor.
3. Once done, scroll down and click the **Deploy the stack** button.

Whichever method you use, wait a few moments while the image is downloaded and the container is created. Once it's up and running (you should not encounter any issues as long as ports **80** and **443** are not in use by another service) move on to the next part.

## Create the proxy hosts

Go into the Nginx Proxy Manager web UI at `http://<your-ip-address>:81`, login with the default email `admin@example.com` and password `changeme`, and change (ideally) both the email and password of the administrator account.

To add proxy hosts click on **Hosts** on the navigation bar at the top, then click the **Add Proxy Host** button. We'll proxy OpenMediaVault first. You'll begin in the **Details** tab, which is all you'll need to use for OMV, Plex and Navidrome.

We'll begin with OMV, add the following:

- Domain Names: `omv.home.arpa`
- Scheme: `http`
- Forward Hostname/IP: `192.168.0.100`
- Forward Port: `70`

Leave the rest as-is and click the **Save** button. You should see your new proxy host on the list, and under **Status** it should say **Online**. Go to `http://omv.home.arpa` on your browser to test it out. If it works, we can go ahead and add the rest of the proxy hosts.

For the **Plex** proxy host, use the following entries:

- Domain Names: `plex.home.arpa`
- Scheme: `http`
- Forward Hostname/IP: `192.168.0.100`
- Forward Port: `32400`

For the **Navidrome** proxy host, use the following entries:

- Domain Names: `music.home.arpa`
- Scheme: `http`
- Forward Hostname/IP: `192.168.0.100`
- Forward Port: `4533`

Once done, go to the URLs in your browser to test them out, making sure not to append any ports (like `:32400`) or directories (like `/web`), and it should work as intended. If you have any issues, check the Nginx Proxy Manager container logs with the terminal command `docker logs nginx-proxy-manager`. (Or whatever `container_name` you used in the compose file when creating the container.)

If you prefer to check the logs through OMV:

1. Login to the OMV workbench UI and click on **Services** in the sidebar.
2. Click **Compose**, then from the dropdown menu click **Containers**.
3. Select the **Nginx Proxy Manager** container and click the **Logs** button at the top.

To check the logs in Portainer:

1. Login to the Portainer UI and go into your environment.
2. Click on **Containers** in the sidebar.
3. Look for the Nginx Proxy Manager container in the list, and under **Quick Actions** click on the &#xf15c; icon to see the logs.

> You should now be all set up and able to reach your proxied services via `http://subdomain.home.arpa` on the browser, no more IPs and ports!

## Reference

- <a href="/blog/set-up-pihole-on-linux/" target="_blank">My blog post on how to install Pi-Hole</a>
- <a href="/blog/setting-up-plex-in-docker/" target="_blank">My blog post on how to install Plex</a>
- <a href="https://docs.openmediavault.org/en/latest" target="_blank">OpenMediaVault 6 documentation</a>
- <a href="https://nginxproxymanager.com" target="_blank">Website of Nginx Proxy Manager</a>
- <a href="https://github.com/NginxProxyManager/nginx-proxy-manager" target="_blank">GitHub of Nginx Proxy Manager</a>