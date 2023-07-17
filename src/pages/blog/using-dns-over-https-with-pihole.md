---
layout: "@layouts/BlogPost.astro"
title: "Using DNS over HTTPS with Pi-Hole"
description: "When using Pi-Hole as a network-wide ad blocker, your DNS requests still go out as plain text and can technically be seen by your ISP. By using DNS over HTTPS you can encrypt these DNS requests between your Pi-Hole and the upstream DNS provider. Here is a quick guide on how to set that up with Cloudflared daemon."
pubDate: "July 13, 2023"
tags:
  - Self-Hosting
  - Cloudflare
  - Pi-Hole
  - DNS
---

## Sections

1. [Caveats and pre-requisites](#pre)
2. [Install and setup the Cloudflared daemon](#install)
3. [Configure Pi-Hole to use Cloudflared](#config)
4. [References](#ref)

<div id='pre' />

## Caveats and pre-requisites

This guide will assume you already have Pi-Hole up and running. If you have not yet done so, check out <a href="" target="_blank">my blog post on setting up Pi-Hole on a Linux machine</a>. If you prefer to run Pi-Hole in a docker container, <a href="https://github.com/pi-hole/docker-pi-hole" target="_blank">check out the Pi-Hole docker container GitHub page</a> for instructions and a docker-compose yaml file to get up and running quickly.

Also, please note that although using DNS over HTTPS prevents your ISP or anyone else from snooping on your DNS requests, since they will be encrypted, whichever upstream DNS provider you use can technically see it. Obviously a measure of a trust is required in this case, but that would be the case with any upstream DNS, and only avoidable if you want to self-host your own DNS resolver. (Certainly possible, but beyond the scope of this guide.)

<div id='install' />

## Install and setup the Cloudflared daemon

<a href="https://github.com/cloudflare/cloudflared" target="_blank">Cloudflared</a> is normally used for Cloudflare Tunnels, but that's optional and we won't be using it in this setup, instead we'll be using Cloudflared strictly as a DNS-Over-HTTPS proxy. This can be done either as a daemon in Linux or via a docker container.

### Cloudflared as a container

To run Cloudflared in a container, we'll use **Docker Compose**. Create a `docker-compose.yml`, copy and paste the below into it, and then run it with the command `docker compose up -d`.

```yaml
version: "3.6"

services:
  cloudflared:
    container_name: cloudflared
    image: cloudflare/cloudflared
    command: proxy-dns
    environment:
      - "TUNNEL_DNS_UPSTREAM=https://1.1.1.1/dns-query,https://1.0.0.1/dns-query"
      - "TUNNEL_DNS_PORT=5053"
      - "TUNNEL_DNS_ADDRESS=0.0.0.0"
    restart: unless-stopped
```

Running Cloudflared as a container makes it easy to update, since you can simply use the command `docker compose pull` in the same directory where the `docker-compose.yml` is located to grab the latest image, then recreate the container with the updated image by running `docker compose up -d` again. You can even automate this with a cronjob or by using <a href="https://hub.docker.com/r/containrrr/watchtower" target="_blank">Watchtower</a>.

### Cloudflared as a daemon

To run Cloudflared as a daemon in Linux, you'll need to <a href="https://github.com/cloudflare/cloudflared/releases/latest" target="_blank">download and install the package from the GitHub</a>. Make sure you download the correct page for your machine's architecture. This guide will assume you're installing on Debian or Ubuntu, which means you'll download `cloudflared-linux-amd64.deb`. See the <a href="https://docs.pi-hole.net/guides/dns/cloudflared" target="_blank">Pi-Hole documentation</a> for installation instructions on other distributions or Raspberry Pi.

```bash
# download latest deb package
sudo wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# use apt to install deb package
sudo apt install ./cloudflared-linux-amd64.deb
```

Since we'll only be using Cloudflared as a DNS-Over-HTTPS proxy, and not to run a Cloudflare Tunnel, some manual configuration will be necessary. To run Cloudflared automatically at start up, let's first create a `cloudflared` user to run the daemon.

```bash
sudo useradd -s /usr/sbin/nologin -r -M cloudflared
```

Now let's create the config file with `sudo nano /etc/default/cloudflared`, paste the below into it:

```bash
CLOUDFLARED_OPTS=--port 5053 --upstream https://1.1.1.1/dns-query --upstream https://1.0.0.1/dns-query
```

This will use both of Cloudflare's DNS server, `1.1.1.1` and `1.0.0.1`. Note that you can use other upstream DNS providers, either instead of or in addition to Cloudflare's. For example Quad9 would be `--upstream https://9.9.9.9/dns-query`, Google would be `--upstream https://8.8.8.8/dns-query`, etc.

Next we need to update the permissions for the config file and the Cloudflared binary to allow access to the `cloudflared` user we created above:

```bash
sudo chown cloudflared:cloudflared /etc/default/cloudflared
sudo chown cloudflared:cloudflared /usr/local/bin/cloudflared
```

Next create the _systemd_ script with `sudo nano /etc/systemd/system/cloudflared.service`, copy and paste the below into it:

```bash
[Unit]
Description=cloudflared DNS over HTTPS proxy
After=syslog.target network-online.target

[Service]
Type=simple
User=cloudflared
EnvironmentFile=/etc/default/cloudflared
ExecStart=/usr/local/bin/cloudflared proxy-dns $CLOUDFLARED_OPTS
Restart=on-failure
RestartSec=10
KillMode=process

[Install]
WantedBy=multi-user.target
```

Finally, start the service and enable it to run at startup:

```bash
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

To run Cloudflared as a daemon is bit more involved than running it in a container, and a bit more annoying to update it, but it can still be automated with cron. I use a shell script via `cron.weekly` to download the latest deb package, stop the Cloudflared service, install the package, delete it after it's done, and start Cloudflared back up. Here's how I do it:

Create the script to be run by cron weekly with `sudo nano /etc/cron.weekly/cloudflared-updater` and paste the below into it:

```bash
#!/bin/bash

# download the latest cloudflared deb package
sudo wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -P ~/downloads

# stop the cloudflared service
sudo systemctl stop cloudflared

# install the deb package with apt
sudo apt install -y ~/downloads/cloudflared-linux-amd64.deb

# start the cloudflared service
sudo systemctl start cloudflared

# delete the deb package
sudo rm ~/downloads/cloudflared-linux-amd64.deb
```

Now just make the script executable and make sure the owner is `root`:

```bash
sudo chmod +x /etc/cron.weekly/cloudflared-updater
sudo chown root:root /etc/cron.weekly/cloudflared-updater
```

A little extra and totally optional thing. I semi-regularly SSH into the machine running Pi-Hole and Cloudflared, and made myself a simple MOTD script to show me that Cloudflared is up and running every time I log in.

Create the script with the command `sudo nano /etc/updated-motd.d/55-cloudflared` (be sure another script isn't named `55-something` and change the number if necessary) and paste the below:

```bash
#!/bin/bash

# empty space so MOTDs are not on top of each other
echo

# display text
echo "cloudflared status:"

# check that cloudflared is active and enabled
sudo systemctl is-active cloudflared &&  sudo systemctl is-enabled cloudflared
```

Don't forget to make it executable with `sudo chmod +x /etc/updated-motd.d/55-cloudflared`. Now whenever you login you should see an MOTD like this:

```bash
cloudflared status:
active
enabled
```

<div id='config' />

## Configure Pi-Hole

This is the last and easiest step. In the Pi-Hole web UI go to _Settings_ and click on the _DNS_ tab. Make sure to uncheck any public Upstream DNS Servers on the left, check _Custom 1 (IPv4)_ on the right and type in `127.0.0.1#5053`. (If you setup Cloudflared on another machine than the one running Pi-Hole, use that machine's IP address instead, but be sure to append `#5053`.)

<a href="/img/blog/cloudflared1.png" target="_blank"><img src="/img/blog/cloudflared1.png" alt="Screenshot of Pi-Hole DNS settings." /></a>

Scroll all the way down and hit _Save_. After a minute or two your DNS requests should all be going out encrypted in HTTPS. To verify go on your browser to <a href="https://1.1.1.1/help" target="_blank">Cloudflare's DNS checker</a> at `https://1.1.1.1/help`, under Debug Information you look at _Using DNS over HTTPS (DoH)_ and it should say _YES_ next to it.

<a href="/img/blog/cloudflared2.png" target="_blank"><img src="/img/blog/cloudflared2.png" alt="Screenshot of Cloudflare DNS checker at 1.1.1.1/help." /></a>

<div id='ref' />

## Reference

- <a href="set-up-pihole-on-linux" target="_blank">My blog post on how to install Pi-Hole</a>
- <a href="https://docs.pi-hole.net/guides/dns/cloudflared" target="_blank">Pi-Hole docs instructions to install Cloudflared</a>
- <a href="https://github.com/cloudflare/cloudflared" target="_blank">Cloudflared GitHub</a>
- <a href="https://1.1.1.1/help" target="_blank">Cloudflare DNS Checker</a>
