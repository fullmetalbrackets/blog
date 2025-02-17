---
title: "How to remove CasaOS from a ZimaBoard and upgrade to Debian 12 Bookworm"
description: "ZimaBoard is an x86 single board server that comes running Debian 11 Bullseye and CasaOS. It's a cool little machine, but after a few months I realizes I don't like CasaOS. Nothing against it, I'm just set in my way of doing things, and their GUI was limiting some of my options. In this post I'll explain how to remove CasaOS and then upgrade to the latest version of Debian."
pubDate: 2025-02-10
tags:
  - self-hosting
---

## About the ZimaBoard

<a href="https://www.zimaspace.com/products/single-board-server" target="_blank" data-umami-event="remove-casaos-zimaboard-site">ZimaBoard</a> is a "hackable" x86 single board server, by default it comes running _Debian 11 Bullseye_ and _CasaOS_, and is meant to be the hub of your personal self-hosted cloud. CasaOS provides a simple web GUI that includes an "app store" to install various apps and services as Docker containers, which are then managed through the GUI. The different models have varying CPUs and RAM, but all models of Zimaboard have a 32 GB eMMC and two SATA ports for more storage, two USB 3.0 ports, two gigabit ethernet ports and even a PCIe 2.0 x4 port. Overall, it's a pretty nice little machine.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> I used these exact steps on a **Zimaboard 216**, the cheapest and lowest end model, but it's safe to assume the process is identical on the 432 and 832 boards.

## Removing CasaOS

This will be quick and easy, to uninstall CasaOS just use the below command:

```bash
casaos-uninstall
```

Wait a few minutes until the uninstall is done then move on to the next step.

## Upgrading from Debian 11 to Debian 12

Zimaboard 216 comes with Debian 11 Bullseye installed (no idea if the 432 and 832 do as well) which has been superseded by Debian 12 Bookworm, so let's upgrade it.

First let's do a full upgrade of all existing packages:

```bash
sudo apt update && sudo apt full-upgrade
```

Now we need to change the `apt` repositories to fetch Debian 12 packages. Use the below command: (If prompted to choose a text editor just use `nano` or whatever you prefer.)

```bash
sudo apt edit-sources
```

What you need to do here is change every instance of `bullseye` to `bookworm`, including to `bullseye-security` to `bookworm-security` and `bullseye-updates` to `bookworm-updates`, then save and close the file.

Next we'll update the repositories and then do a _minimal_ upgrade using the `--without-new-pkgs` option, this will "hold back" some packages to prevent deleting any dependencies that could break things.

```bash
sudo apt update && sudo apt upgrade --without-new-pkgs
```

This will take a while most likely, so be patient. Pay attention during the upgrade, you may get some dialogs from `apt-listchanges`, just hit <kbd>q</kbd> on your keyboard to continue if this comes up.

When it's finally done, it's time to do a full upgrade from Debian 11 Bullseye to Debian 12 Bookworm. This will take some time too, so just be aware.

```bash
sudo apt full-upgrade -y
```

Like before, you will be prompted during the upgrade to make choices about which version of config files to use -- _it's usually best to keep your existing ones_ -- and also a dialog like the below to restart some services, use your arrow keys to select `<Yes>` and hit <kbd>Enter</kbd> to continue past these screens.

![Prompt to restart certain services during upgrade from Debian 11 to Debian 12.](../../img/blog/zimaboard-upgrade1.png 'Prompt to restart certain services during upgrade from Debian 11 to Debian 12')

Certain services like `openssh-server` and `samba` will also prompt a dialog about config files, once again it's best to keep your existing version, but it's up to you. Use your arrow keys to scroll through the options and hit <kbd>Enter</kbd> on the selected the highlighted option, and <kbd>Enter</kbd> again to continue.

![Prompt asking which version of SMB config file to keep.](../../img/blog/zimaboard-upgrade2.png 'Prompt asking which version of SMB config file to keep')

Once the full upgrade is done, you should purge any unused package dependencies and clean out your cache:

```bash
sudo apt --purge autoremove -y && sudo apt autoclean
```

Finally, reboot to have all the changes take effect!

```bash
sudo reboot
```

When the Zimaboard is back up, I suggest using `sudo apt update` again for final changes, you'll probably see something like the below in the output:

```bash
sudo apt update
...
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
All packages are up to date.
N: Repository 'Debian bookworm' changed its 'non-free component' value from 'non-free' to 'non-free non-free-firmware'
N: More information about this can be found online in the Release notes at: https://www.debian.org/releases/bookworm/amd64/release-notes/ch-information.html#non-free-split
```

### Related Articles

> <a href="/blog/factory-restore-zimaboard/" umami-data-event="remove-casaos-related-factory-restore-zimaboard">How to factory restore a ZimaBoard</a>
