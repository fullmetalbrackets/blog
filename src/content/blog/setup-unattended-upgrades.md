---
title: 'Setup auto-updates in Debian and Ubuntu with Unattended-Upgrades and NeedRestart'
description: "If you want your Linux machine to stay up-to-date on important security updates, but you don't want to SSH into it all the time to run updates and would rather set it and forget it, this is the way."
pubDate: 2022-10-14
updatedDate: 2025-03-03
tags: ['debian', 'linux', 'command line']
related1: bootstrapping-fresh-install-with-ansible
related2: setup-apt-cacher-ng-to-cache-packages-homelab
---

## Caveats

This guide is specifically for **Debian-based Linux distributions** since that is what I mostly use. I'm sure unattended upgrades can also be set up on Arch, Fedora, etc. It just may not work like this and I won't be covering how to do it.

## Install and configure Unattended-Upgrades

The Unattended-Upgrades package should be installed by default on Debian and Ubuntu, but if necessary install it with this command:

```bash
sudo apt install unattended-packages
```

Now we need to edit the configuration file, located at `/etc/apt/apt.conf.d/50unattended-upgrades` and scroll to the following lines:

```sh
Unattended-Upgrade::Allowed-Origins {
        "${distro_id}:${distro_codename}";
        "${distro_id}:${distro_codename}-security";
        // Extended Security Maintenance; doesn't necessarily exist for
        // every release and this system may not have it installed, but if
        // available, the policy for updates is such that unattended-upgrades
        // should also install from here by default.
        "${distro_id}ESMApps:${distro_codename}-apps-security";
        "${distro_id}ESM:${distro_codename}-infra-security";
//      "${distro_id}:${distro_codename}-updates";
//      "${distro_id}:${distro_codename}-proposed";
//      "${distro_id}:${distro_codename}-backports";
};
```

By default you'll see that only security updates are downloaded, if you want to also automatically download package updates un-comment the line `"${distro_id}:${distro_codename}-updates";`.

Next scroll to the following line:

```sh
// Automatically reboot *WITHOUT CONFIRMATION* if
//  the file /var/run/reboot-required is found after the upgrade
// Unattended-Upgrade::Automatic-Reboot "false";
```

If you want to reboot the machine when it's required after an update un-comment and change the line to `Unattended-Upgrade::Automatic-Reboot "true";`. If you do this, you should set a specific time to reboot. Scroll down to and change the following lines (this example will wait to reboot at 5:00am):

```sh
// If automatic reboot is enabled and needed, reboot at the specific
// time instead of immediately
// Default: "now"
Unattended-Upgrade::Automatic-Reboot-Time "05:00";
```

> Though you can configure Unattended-Upgrades to email you when it completes an automatic update or when it encounters an error. It requires installing and configuring other packages, which I will not get into here. I may update this in the future if I ever do set up email notification.

Finally, you'll want to check the file at `/etc/apt/apt.conf.d/20auto-upgrades` and make sure it has the following lines ("1" enables, while "0" disables):

```sh
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

You may also wish to add `APT::Periodic::AutocleanInterval "7";` which will clear out the Apt cache every 7 days. To test that everything is working correctly, you should simulate an auto-update with `sudo unattended-upgrades --dry-run --debug`.

You can see a log of all the times Unattended-Upgrades has run at `/var/log/unattended-upgrades/unattended-upgrades.log`.

## Install and configure NeedRestart

When upgrading packages and installing security updates, it is sometimes necessary to restart certain daemons for changes to take effect. When you update manually, you'll get a dialogue showing which daemons need restarting and confirming if you want to do so, but we can automate this with the Needrestart package.

Needrestart should be installed by default in Debian and Ubuntu, but if necessary install it with this command:

```bash
sudo apt install needrestart
```

Now all we need to do is edit the config file at `/etc/needrestart/needrestart.conf`. Look for the following line, un-comment and change from `i` to `a`:

```perl
# Restart mode: (l)ist only, (i)nteractive or (a)utomatically.
#
# ATTENTION: If needrestart is configured to run in interactive mode but is run
# non-interactive (i.e. unattended-upgrades) it will fallback to list only mode.
#
$nrconf{restart} = 'a';
```

All done! Now your server will download and install security updates (and package updates if you configured that) automatically with Unattended-Upgrades, and NeedRestart will automatically restart any daemons when necessary, without any input from you at all.

## References

- <a href="https://manpages.debian.org/bullseye/unattended-upgrades/unattended-upgrades.8.en.html" target="_blank">Unattended-Upgrade man page</a>
- <a href="https://manpages.debian.org/bullseye/needrestart/needrestart.1.en.html">NeedRestart man page</a>
