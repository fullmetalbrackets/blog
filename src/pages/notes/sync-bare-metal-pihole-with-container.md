---
layout: "@layouts/Note.astro"
title: "Sync a bare metal Pi-Hole instance with a Pi-Hole docker container on another host"
description: "I've run Pi-Hole bare metal for years and recently decided to run a secondary instance of Pi-Hole on another machine as a Docker container. Gravity Sync keeps them updated with all the same DNS records, block lists, etc. Here's how I set it up."
pubDate: "August 10, 2023"
tags:
  - Pi-Hole
---

<div>
  <div class="info">
    <span>
      <img src="/img/assets/info.svg" class="info-icon">
      <b>Note</b>
    </span>
    <p>
      I have a post explaining <a href="set-up-pihole-on-linux" target="_blank">how to install and configure Pi-Hole</a>. Here I will only be focusing on setting up <a href="https://github.com/vmstan/gravity-sync" target="_blank">Gravity Sync</a> with the assumption that both instances of Pi-Hole are already up and running on their hosts.
    </p>
  </div>
</div>
<div>
  <div class="alert">
    <span>
      <img src="/img/assets/alert.svg" class="alert-icon">
      <b>Important!</b>
    </span>
    <p>
      In order for Gravity Sync to work with a Pi-Hole container, you need to use <em>bind mounts</em> to map the <code>/etc/pihole</code> and <code>/etc/dnsmasq.d</code> directories inside the container to local directories on your host, so that Gravity Sync can access and interact with the config files. This is demonstrated in my post linked above.
    </p>
  </div>
<div>
<br>
SSH into the host where you have the Pi-Hole container running, and use the following command to execute the Gravity Sync install script:

```
curl -sSL https://raw.githubusercontent.com/vmstan/gs-install/main/gs-install.sh | bash
```

Enter the information as prompted and once configuration is done you'll see an explanation of additional steps. Next, SSH into the host running the bare metal Pi-Hole instance and use the same command to install Gravity Sync, follow the prompts, etc.

Once done, still on the bare metal host, edit the file at `/etc/gravity-sync/gravity-sync.conf`. Uncomment all the lines about the remote host and fill out the information. Here is mine as an example:

```ini
# REQUIRED SETTINGS ##########################

REMOTE_HOST='192.168.0.100'
REMOTE_USER='ariel'

# CUSTOM VARIABLES ###########################

# Pi-hole Folder/File Customization - Only need to be customized when using containers
# LOCAL_PIHOLE_DIRECTORY=''                         # Local Pi-hole data directory
REMOTE_PIHOLE_DIRECTORY='/home/ariel/docker/pihole/config'
# LOCAL_DNSMASQ_DIRECTORY=''                # Local DNSMASQ/FTL data directory
REMOTE_DNSMASQ_DIRECTORY='/home/ariel/docker/pihole/dnsmasq'
# LOCAL_FILE_OWNER=''                       # Local file owner for Pi-hole
REMOTE_FILE_OWNER='ariel'

# Pi-hole Docker/Podman container name - Docker will pattern match anything set below
# LOCAL_DOCKER_CONTAINER=''                                 # Local Pi-hole container name
REMOTE_DOCKER_CONTAINER='pihole'

# HIDDEN FIGURES #############################
# See https://github.com/vmstan/gravity-sync/wiki/Hidden-Figures
```

Now you should be all set. Go to whichever instance of Pi-Hole has all the DNS records and block lists that you want to sync between the two (for me that was the bare metal one) and use the command `gravity-sync push` to clone all the information to the other host. Once successful, use `gravity-sync auto` to enable regular syncs between both.
