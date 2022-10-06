---
layout: "../../layouts/BlogPost.astro"
title: "Initial setup for debian fresh installs"
description: "Most of my experience with Linux is via the Ubuntu distribution, which includes many defaults that make it very user friendly and easier to use than other distros. Debian is pretty minimal, however, so I need a reminder of those extra steps that are necessary on a fresh install of Debian."
pubDate: "October 6, 2022"
tags:
  - Debian
  - Networking
  - Command Line
---

## Sections

1. [Installing and configuring sudo](#sudo)
2. [Setting a static IP address](#ip)
3. [Reference](#ref)

<div id='sudo'>

## Installing and configuring sudo

The almighty `sudo` command is not even available in Debian by default -- instead you have to switch to the root user to do things that require administrative privileges. So first thing I always do is get it installed.

```bash
apt install sudo -y
```

Once installed, add a user to the sudo group:

```bash
adduser user sudo
```

Now switch to the user that was just added to the sudo group, and verify the user is authorized:

```bash
sudo -v
```

> _Note:_ The rest of this guide will assume you are still the `root` user when performing the following actions, if you are instead using your new superuser, you will need to append `sudo` for some commands.

<div id='ip'>

## Set a static IP address

Debian's non-graphical install does not give you the option to set a static IP, so let's do it manually. First, save a copy of the default network config as a back up.

```bash
cp /etc/network/interfaces /backups/
```

Now edit the file:

```bash
nano /etc/network/interfaces
```

Look for these lines towards the end of the file:

```conf
# The primary network interface
allow-hotplug enp0s25
iface enp0s25 inet dhcp
```

Edit to the following:

```conf
# The primary network interface
auto enp0s25
iface enp0s25 inet static
 address 192.168.1.250
 netmask 255.255.255.0
 gateway 192.168.1.254
 dns-nameservers 1.1.1.1 8.8.8.8
```

Save and close the file, then restart the networking service and check it's status:

```bash
systemctl restart networking.service
systemctl status networking.service
```

> _Note:_ If you get an error, you probably have to run `systemctl restart NetworkManager.service` or `systemctl restart network-manager` instead.

If there's no errors, the output should look something like this:

```bash
● networking.service - Raise network interfaces
     Loaded: loaded (/lib/systemd/system/networking.service; enabled; vendor preset: enabled)
     Active: active (exited) since Wed 2022-10-05 16:44:08 EDT; 2h 5min ago
       Docs: man:interfaces(5)
   Main PID: 490 (code=exited, status=0/SUCCESS)
      Tasks: 0 (limit: 1112)
     Memory: 0B
        CPU: 0
     CGroup: /system.slice/networking.service
```

Also check your IP address:

```bash
ip -c addr show enp0s25
```

Output should look similar to this:

```bash
2: enp0s25: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 70:5a:b6:ac:52:d6 brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.250/24 brd 192.168.0.255 scope global enp0s25
       valid_lft forever preferred_lft forever
    inet6 fe80::725a:b6ff:feac:52d6/64 scope link
       valid_lft forever preferred_lft forever
```

<div id='ref'/>

## References

- <a href="https://wiki.debian.org/sudo" target="_blank">Debian wiki, sudo page</a>
- <a href="https://www.debian.org/doc/manuals/debian-reference/ch05.en.html" target="_blank">Debian manual, network setup chapter</a>
