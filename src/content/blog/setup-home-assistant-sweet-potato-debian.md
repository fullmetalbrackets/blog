---
title: "Set up Home Assistant Supervised on a Libre Computer Sweet Potato SBC"
description: "Home Assistant is an open source home automation solution that gives you local control over your smart home. It can also be run on Libre Computer's boards, but I ran into some issues following the official instructions from Libre, so here's how I got it working."
pubDate: 2024-03-03
updatedDate: 2025-02-10
tags: ["self-hosting", "home assistant", "sbc"]
---

## Pre-Requisites

This guide assumes you already have either a Le Potato or a Sweet Potato (the instructions work for both) up and running with Debian 12 Bookworm. See <a href="https://hub.libre.computer/t/debian-11-bullseye-and-12-bookworm-for-libre-computer-boards/230" target="_blank" data-umami-event="hass-potato-libre-install-debian">Libre's official instructions</a> or <a href="/blog/setting-up-sweet-potato-debian-pihole/#boot" target="_blank" data-umami-event="hass-potato-to-setup-potato-pihole">see my blog post here</a> for how I run Debian 12 off a USB stick.

Note that SSH is disabled in Debian by default, so you'll have to plug in a monitor at least initially until that's installed. The default username and password are `root`, though you are prompted to change the root password immediately the first time you login, and you can go ahead and create a new user account after that.

> I'll be following Libre's official instructions for installing Home Assistant Supervised, however it seems the guide was made with Docker version 24.0.7, but the current version of 25.0.x has a bug that causes the setup to fail at the last step, when you first go into the Home Assistant UI.
> 
> Some googling led me to the only solution that worked, which was downgrading to Docker version 24.0.7 -- with a fresh install, you'll have to make sure you install that specific version of Docker to avoid the issue altogether, which is part of my instructions below.

## Install required packages

Perform the following command first to install the packages required for Home Assistant:

```bash
sudo eatmydata apt -y install apparmor jq wget curl udisks2 libglib2.0-bin network-manager dbus lsb-release systemd-journal-remote systemd-resolved
```

Once that's done (it may take a while) do the following commands in sequence:

```bash
echo 'GRUB_CMDLINE_LINUX_DEFAULT="$GRUB_CMDLINE_LINUX_DEFAULT apparmor=1 security=apparmor"' | sudo tee /etc/default/grub.d/apparmor.cfg
echo 'GRUB_CMDLINE_LINUX_DEFAULT="$GRUB_CMDLINE_LINUX_DEFAULT systemd.unified_cgroup_hierarchy=0"' | sudo tee /etc/default/grub.d/cgroupsv1.cfg
sudo update-grub
```

Once that's done, be sure to `sudo reboot` before you continue so that everything you did above takes effect.

## Install Docker

This is where I got tripped up, the instructions from Libre say to just use Docker's script to install everything, but that defaults to the latest version of Docker which, as I said above, causes issues later. Until this is resolved, you should we'll need to install Docker version 24.0.7 specifically. (24.0.9 might also work, but I went with .7 because that's what was working in the solution I found.)

First, download the install script and make it executable:

```bash
curl -fsSL https://get.docker.com -o install-docker.sh
sudo chmod +x install-docker.sh
```

Now we're going to run the script, but specify the version we need:

```bash
sudo sh install-docker.sh --version 24.0.7
```

Once again, this may take a while, but when done we can finally move on to installing Home Assistant.

## Install Home Assistant Supervised

Go to the <a href="https://github.com/home-assistant/os-agent/releases/latest" target="_blank" data-umami-event="hass-potato-hass-os-release">Home Assistant OS-Agent Release Page</a>, and the copy the URL for the latest version of the asset file ending in `_aarch64.deb`. (As of this writing, that's version 1.6.0)

```bash
wget https://github.com/home-assistant/os-agent/releases/download/1.6.0/os-agent_1.6.0_linux_aarch64.deb
```

Now to install the package:

```bash
sudo dpkg -i os-agent_1.6.0_linux_aarch64.deb
```

Once that's done, we need to download the Home Assistant Supervised package:

```bash
wget -O homeassistant-supervised.deb https://github.com/home-assistant/supervised-installer/releases/latest/download/homeassistant-supervised.deb
```

And we install it:

```bash
sudo apt install ./homeassistant-supervised.deb
```

Pay attention during the install process, you'll be prompted to _Select machine type_, use the down arrow key on your keyboard to highlight **qemuarm-64** and press <kbd>Enter</kbd> to select it. Once the installation process is completed, you'll be told to access the Home Assistant UI at your machine's IP address or hostname on port 8123, for example `192.168.0.100:8123` or `hostname:8123`.

You should arrive at the Home Assistant UI's welcome page, where you can follow the on-screen instructions to complete the setup.

> If you happen to be migrating from Home Assistant Core to Supervised, you can create a backup in Core and restore it here in Supervised to bring over most of your configuration and settings. (You may have to update some configs and re-authorize some integrations in Supervised to get them to work again, but at least you won't have to start from scratch.)

Once the setup finishes, which it should without issue if you installed Docker version 24.0.7 as stated above, you'll be ready to go! (If you migrated from Core to Supervised via backup, be sure to login with the same username and password that you used in Core!)

## References

- <a href="https://libre.computer" target="_blank" data-umami-event="hass-potato-libre-site">Libre Computer</a>
- <a href="https://hub.libre.computer/t/debian-11-bullseye-and-12-bookworm-for-libre-computer-boards/230" target="_blank" data-umami-event="hass-potato-libre-install-debian">Libre's instructions for installing Debian</a>
- <a href="https://hub.libre.computer/t/libre-computer-aml-s905x-cc-emmc-flashing-steps-from-linux/33" target="_blank" data-umami-event="hass-potato-libre-flash-emmc">Flashing Linux to eMMC</a>
- <a href="https://hub.libre.computer/t/booting-from-external-usb-device-or-bootrom-unsupported-device/51" target="_blank" data-umami-event="hass-potato-libre-usb-boot">Booting from External USB Device (alternative to eMMC boot)</a>
- <a href="https://www.home-assistant.io/docs" target="_blank" data-umami-event="hass-potato-hass-docs">Home Assistant Documentation</a>

### Related Articles

- <a href="/blog/setting-up-sweet-potato-debian-pihole/" data-umami-event="hass-potato-related-setup-potato-pihole">Setting up a Libre Computer Sweet Potato SBC with Debian and Pi-Hole</a>
- <a href="/blog/self-host-website-cloudflare-tunnel/" data-umami-event="hass-potato-related-tunnel-guide">Complete guide to self-hosting a website through Cloudflare Tunnel</a>