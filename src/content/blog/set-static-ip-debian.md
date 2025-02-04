---
title: "Set a static IP in Debian"
description: "Debian's non-graphical install does not give you the option to set a static IP, here's a quick guide to doing it manually on the command line."
pubDate: 2022-10-07
updatedDate: 2025-02-04
tags:
  - networking
---

Login to Debian as `root` or as a user with sudo privileges (in which case, be sure to append `sudo` before every command). First, save a copy of the default network config as a back up:

```bash
cp /etc/network/interfaces ~/interfaces.bk
```

Now edit the file:

```bash
nano /etc/network/interfaces
```

Look for these lines towards the end of the file:

```ini
# The primary network interface
allow-hotplug enp3s0
iface enp3s0 inet dhcp
```

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> Although I use the example `enp3s0` in this post, your default network interface might be named differently, like `enp0s2` or `eth0`, or something else entirely. If you use wireless instead of ethernet it will be something like `wlan0`.
>
> See your default interface by using the command: `ip -o -4 route show to default`

Edit it to look like the following:

```ini
# The primary network interface
auto enp3s0
iface enp3s0 inet static
# server IP address
 address 192.168.0.125 
# /24 subnet
 netmask 255.255.255.0
# router IP address
 gateway 192.168.0.1
# dns
 dns-nameservers 1.1.1.1 8.8.8.8
```

Make sure to change the commented lines to your own server IP, router, DNS, and if necessary netmask (`255.255.255.0` is equivalent to `192.168.0.0`) -- then save and close the file, then use this command to restart the network interface:

```bash
systemctl restart ifup@enp3s0
```

Then restart the networking service and check it's status with these commands:

```bash
systemctl restart networking.service
systemctl status networking.service
```

If there's no errors, the output should look something like this:

```tcl
● networking.service - Raise network interfaces
     Loaded: loaded (/lib/systemd/system/networking.service; enabled; preset: enabled)
     Active: active (exited) since Sat 2025-01-18 14:19:00 EST; 2 weeks 3 days ago
       Docs: man:interfaces(5)
   Main PID: 812 (code=exited, status=0/SUCCESS)
        CPU: 26ms
```

If you get an error, try running `systemctl restart NetworkManager.service` or `systemctl restart network-manager` instead. If you still get an error, you may need to edit (or if it doesn't exist, create) the file at `/etc/resolv.conf`. Add your DNS resolvers like this:

```c
nameserver 1.1.1.1
nameserver 1.0.0.1
```

Save and close the file, then try restarting `networking.service` and checking the status again. You may need to reboot for the changes to take effect.

Once the `networking.service` is up and running, also check your IP address with the following command:

```bash
ip -c addr show enp3s0
```

Output should look similar to this:

```tcl
2: enp3s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 14:b3:1f:0a:81:37 brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.125/24 brd 192.168.0.255 scope global dynamic enp3s0
       valid_lft 24218sec preferred_lft 24218sec
    inet6 fe80::16b3:1fff:fe0a:8137/64 scope link
       valid_lft forever preferred_lft forever
```

If the static IP address you configured (in my case `192.168.0.125`) appears in the output, you're done!

## Related Articles

> [Linux Commands & Keyboard Shortcuts Cheat Sheet](/blog/basic-linux-commands/)

> [Rsync - A Quick Guide](/blog/rsync-a-quick-guide/)

## References

- <a href="https://www.debian.org/doc/manuals/debian-reference/ch05.en.html" target="_blank">Debian manual, network setup chapter</a>
- <a href="https://www.server-world.info/en/note?os=Debian_12&p=initial_conf&f=3">ServerWorld instructions</a>
