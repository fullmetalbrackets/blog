---
title: "Set a static IP in Debian"
description: "Debian's non-graphical install does not give you the option to set a static IP, here's a quick guide to doing it manually on the command line."
pubDate: 2022-10-07
updatedDate: 2023-07-18
tags:
  - networking
---

Login to Debian as `root` or as a user with sudo privileges (be sure to append `sudo` before every command). First, save a copy of the default network config as a back up:

```bash
cp /etc/network/interfaces /backups/
```

Now edit the file:

```bash
nano /etc/network/interfaces
```

Look for these lines towards the end of the file:

```ini
# The primary network interface
allow-hotplug enp0s25
iface enp0s25 inet dhcp
```

Edit to the following:

```ini
# The primary network interface
auto enp0s25
iface enp0s25 inet static
 address 192.168.1.250
 netmask 255.255.255.0
 gateway 192.168.1.254
 dns-nameservers 1.1.1.1 8.8.8.8
```

Save and close the file, then restart the network interface:

```bash
systemctl restart ifup@enp0s25
```

Then restart the networking service and check it's status:

```bash
systemctl restart networking.service
systemctl status networking.service
```

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

If you get an error, try running `systemctl restart NetworkManager.service` or `systemctl restart network-manager` instead. If you still get an error, you may need to edit (or if it doesn't exist, create) the file at `/etc/resolv.conf`. Add your DNS resolvers like this:

```bash
nameserver 1.1.1.1
nameserver 1.0.0.1
```

Save and close the file, then try checking restarting and checking the status again. You may need to reboot for the changes to take effect.

Once the `networking.service` is up and running, also check your IP address with the following command:

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

If the static IP Address you configured appears in the output, you're done!

## Related Articles

> [Linux Commands & Keyboard Shortcuts Cheat Sheet](/blog/basic-linux-commands)

> [Rsync - A Quick Guide](/blog/rsync-a-quick-guide)

## References

- <a href="https://www.debian.org/doc/manuals/debian-reference/ch05.en.html" target="_blank">Debian manual, network setup chapter</a>
- <a href="https://www.server-world.info/en/note?os=Debian_12&p=initial_conf&f=3">ServerWorld instructions</a>
