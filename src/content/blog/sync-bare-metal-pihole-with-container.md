---
title: "Sync a bare metal Pi-Hole instance with a Pi-Hole docker container on another host"
description: "I've run Pi-Hole bare metal for years and recently decided to run a secondary instance of Pi-Hole on another machine as a Docker container. Gravity Sync keeps them updated with all the same DNS records, block lists, etc. Here's how I set it up."
pubDate: 2023-08-10
tags:
  - pi-hole
---

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> Gravity Sync was archived on July 26, 2024 and it will no longer be updated. As a result, the upcoming Pi-Hole v6 will not work with Gravity Sync, however it continues to work with the current (as of October 2024) Pi-Hole v5.
> 
> 

I already have a post explaining <a href="set-up-pihole-on-linux" target="_blank">how to install and configure Pi-Hole</a>. Here I will only be focusing on setting up <a href="https://github.com/vmstan/gravity-sync" target="_blank">Gravity Sync</a> with the assumption that both instances of Pi-Hole are already up and running on their hosts.

In order for Gravity Sync to work with a Pi-Hole container, you need to use **volumes** to map the `/etc/pihole` and `/etc/dnsmasq.d` directories inside the container to local directories on your host, so that Gravity Sync can access and interact with the config files.

SSH into the host where you have the Pi-Hole container running, and use the following command to execute the Gravity Sync install script:

```
curl -sSL https://raw.githubusercontent.com/vmstan/gs-install/main/gs-install.sh | bash
```

Enter the information as prompted and once configuration is done you'll see an explanation of additional steps.

Next, SSH into the host running the bare metal Pi-Hole instance and use the same command to install Gravity Sync, follow the prompts, etc.

Finally, go to your "main" instance of Pi-Hole, whichever one has all the DNS records and block lists that you want to sync between the two. On that machine, use the command `gravity-sync push` and follow the prompts to enter information for the remote host running Pi-Hole in a container. The config will then be pushed to the container so that both have the same exact configuration.

From here on, you can manually use `gravity-sync push` or `gravity-sync pull` to sync the two Pi-Holes, or preferably use `gravity-sync auto` to enable regularly scheduled syncs between them.

## References

- <a href="https://github.com/vmstan/gravity-sync/wiki/Installing" target="_blank">Gravity Sync docs</a>