---
title: "Setting up a Libre Computer Sweet Potato SBC"
description: "I've been wanting to get a Raspberry Pi for ages, but they were out of stock for the longest time, and even now as they return to stock the prices are higher than they used to be. So I settled for a Pi-alternative from Libre Computer, and paid the $30 early access price for their new Sweet Potato SBC. Here's how I set it up."
pubDate: 2023-09-16
draft: true
tags:
  - SBC
  - Linux
  - Self-Hosting
---

## Sections

1. [WTF is Libre Computer and Sweet Potato?](#what)
2. [Booting up Ubuntu off a USB stick](#boot)
3. [Updating, configuring, and installing packages](#config)
4. [Installing and Configuring Pi-Hole](#pihole)
5. [References](#ref)

<a href="/img/blog/sweet-potato.jpg" target="_blank"><img src="/img/blog/sweet-potato.jpg" alt="Picture of Libre Computer's Sweet Potato Single-Board Computer." /></a>

<div id='what' />

## WTF is Libre Computer and Sweet Potato?

Libre Computer Project is a crowdfunded designer of single-board computers which effectively are alternatives to Raspberry Pi. Amongst their products is the <a href="https://libre.computer/products/aml-s905x-cc/" target="_blank">Le Potato</a> which is equivalent in features to a low-end Raspberry Pi 3B, which some slight differences.

Recently as of early September 2023, they've come out with a new revision known as the "Sweet Potato" with a few minor upgrades. (<a href="https://www.loverpi.com/products/libre-computer-board-aml-s905x-cc-v2" target="_blank">See here</a> for a product page with the differences.) I made the plunge and ordered it blind from <a href="https://www.loverpi.com" target="_blank">LoveRPi</a>, and it got here a week later.

<div id='boot' />

## Booting up Ubuntu off a USB stick

Libre's Sweet Potato is so new, there's no documentation or instructions of any kind for it. However it's so similar to the Le Potato that those instructions seem to work just fine. One exception seemed to be about booting from a USB drive -- <a href="https://hub.libre.computer/t/booting-from-external-usb-device-or-bootrom-unsupported-device/51" target="_blank">it says here</a> that the _AML-S905X-CC_ (Le Potato) board cannot boot from USB without additional configuration, and the newer _AML-S905X-CC-V2_ (the Sweet Potato I have) is not mentioned. I took a shot in the dark hoping that it would just boot from a USB stick anyway, and turns out it did!

First I found the <a href="https://distro.libre.computer/ci/ubuntu/22.04" target="_blank">latest release of Ubuntu 22.04 LTS</a> and downloaded the `aarch64` package. This comes as a `.img.xz` file but there's no need to extract it, using <a href="https://rufus.ie/en" target="_blank">Rufus</a> I just created a bootable USB drive right from the archive file.

I plugged it into the top-left USB port on the Sweet Potato, then plugged in the USB-C power supply. Sweet Potato turned on and automatically installed Ubuntu via _cloud-init_, it was up and running in a few minutes.

<div id='config' />

## Updating, configuring, and installing packages

For the next section I consulted <a href="https://hub.libre.computer/t/ubuntu-22-04-lts-server-release-notes/63" target="_blank">Libre's Ubuntu Jammy LTS release notes</a>. The default sudo user is `ubuntu`, which I just went ahead and kept using, and the default password is the same, but you'll be prompted to change the password on login.

First things first, of course, is updating everything with `sudo apt update && sudo apt dist-upgrade -y` which took a while this first time. Next, I always like to set a static IP address on all my Linux hosts. On Ubuntu this is done via _Netplan_ by editing the file at `/etc/netplan/50-cloud-init.yaml`. First I made a back-up of the default, then edited it to the following:

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: false
      dhcp6: false
      addresses:
        - 192.168.0.200/24
      routes:
        - to: default
          via: 192.168.0.1
      nameservers:
        addresses: [1.1.1.1, 1.0.0.1]
```

I applied the changes with `sudo netplan apply` and verified the new IP address with `ip a`, which gave the following output:

```bash
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 6a:ce:e2:b8:70:43 brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.200/24 brd 192.168.0.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::68ce:e2ff:feb8:7043/64 scope link
       valid_lft forever preferred_lft forever
```

Next I wanted to change the hostname, by default it is `aml-s905x-cc` but I wanted to change this to `potato`. I made the change in `/etc/hostname`, but to my surprise it would reset to the original after reboot. Tried `sudo hostnamectl set-hostname potato` but it still would revert. A quick google search revealed <a href="https://hub.libre.computer/t/hostname-keep-changing-when-reboot/138" target="_blank">this thread on the Libre forums</a> that explained I had to modify `/etc/cloud/cloud.cfg` and set `preserve_hostname: true`. That did the trick.

Finally, since I plan to install Pi-Hole, I need to make a slight change in Ubuntu ahead of time. Using the command `netstat -tulpn | grep ':53'` should show Port 53 to be in use, but I need it free for Pi-Hole. I edited the file at `/etc/systemd/resolved.conf`, uncommented the line `DNSStubListener=yes` and changed it to `DNSStubListener=no`, then I used `sudo service systemd-resolved restart` to apply the change. I also edited `/etc/hosts` and changed `127.0.0.1 localhost` to `127.0.0.1 potato`, otherwise Ubuntu will complain that it can't resolve the hostname.

<div id='pihole' />

## Installing and configuring Pi-Hole

Basically I followed <a href="set-up-pihole-on-linux" target="_blank">my own guide on setting up Pi-Hole</a>, using the auto-install script with `curl -sSL https://install.pi-hole.net | bash`. (I decided to install bare metal instead of as a Docker container.) I also made sure to change the random generated password with `pihole -a -p`.

Since I already had an instance of Pi-Hole running on another host, I used <a href="https://github.com/vmstan/gravity-sync" target="_blank">Gravity Sync</a> to push the configuration from there onto the new Pi-Hole instance in the Sweet Potato -- first by installing and setting it up on both hosts with `curl -sSL https://raw.githubusercontent.com/vmstan/gs-install/main/gs-install.sh | bash`, then on pushing the config from the original Pi-Hole to the Sweet Potato with command `gravity-sync push`. (I won't set up syncing, since I plan to only run Pi-Hole on the Sweet Potato for now -- but in the future that can be done with command `gravity-sync auto`.)

Now that all my ad lists, DNS records and other settings are on the Sweet Potato's Pi-Hole instance, I downloaded up cloudflared to use **DNS over HTTPS**, using <a href="https://pkg.cloudflare.com/index.html#ubuntu-jammy" target="_blank">the official instructions</a>:

```bash
# Add cloudflare gpg key
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

# Add this repo to your apt repositories
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main' | sudo tee /etc/apt/sources.list.d/cloudflared.list

# install cloudflared
sudo apt-get update && sudo apt-get install cloudflared
```

Then to set it up I followed <a href="using-dns-over-https-with-pihole" target="_blank">my own guide</a>.

<div id='ref' />

## Reference

- <a href="https://libre.computer" target="_blank">Libre Computer</a>
- <a href="https://hub.libre.computer/t/ubuntu-22-04-lts-server-release-notes/63" target="_blank">Release Notes for Ubuntu 22.04 LTS</a>
- <a href="https://hub.libre.computer/t/booting-from-external-usb-device-or-bootrom-unsupported-device/51" target="_blank">Booting from External USB Device</a>
- <a href="https://hub.libre.computer/t/libre-computer-aml-s905x-cc-emmc-flashing-steps-from-linux/33" target="_blank">Flashing Linux to eMMC (alternative to USB boot)</a>
