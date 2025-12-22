---
title: "How to upgrade from Debian 12 Bookworm to Debian 13 Trixie"
description: "My old Dell Optiplex has been a great desktop PC for just minimal interneting and coding. I've been running Debian 12 Bookworm on it since it became available. Now that Debian 13 Trixie is available I upgraded to it, and it was a smooth and painless transition. Here's the process."
pubDate: 2025-05-21
updatedDate: 2025-11-06
tags: ["linux", "debian", "command line"]
related1: remove-casaos-zimaboard-upgrade-debian-12
related2: basic-linux-commands
---

## About upgrading

Please note that I'm just basing this off my own experience. I upgraded from Debian 12 Bookworm with a desktop environment, and all my settings, installed apps and custom configurations were still there in Debian 13 Trixie. Applications like Google Chrome, VSCode, the Tailscale GUI client, LibreOffice and all pre-installed apps have worked completely fine after the upgrade too.

I've also used these same instructions (I write this stuff down mainly for my own future reference after all) to upgrade numerous headless Debian servers, both x86 and Arm-based systems like Raspberry Pi 5 and Libre Sweet Potato, as well as Windows System for Linux 2.

Just because I encountered no problems does not mean you won't. If you want to be absolutely safe, you should make a backup of your main user Home directory and anything else you deem important, just in case you encounter some irreversable fatal error and have to start from scratch. (Highly doubtful, but you never know.)

In the case of WSL2, you can create a backup of your instance by using this command in Windows Terminal or Powershell:

```psl
wsl --export Debian-WSL-Backup /path/to/Debian-WSL-Backup.tar
```

Follow all instructions as-is and when it's time to reboot at the end, just `exit` out of your WSL Debian instance and close the window with <kbd>Ctrl</kbd>+<kbd>D</kbd>, then open a new one.

## Upgrading apt repositories to Trixie

> [warning] Important note for Nvidia GPU users
>
> I've received reports from some people trying to use this guide that they've had trouble upgrading on a system with an Nvidia card. There may be some issue with Nvidia drivers on Trixie, so I recommend following either <a href="https://wiki.debian.org/NvidiaGraphicsDrivers#Debian_13_.22Trixie.22" target="_blank">these instructions on the Debian wiki</a> or <a href="https://github.com/mexersus/debian-nvidia-drivers" target="_blank">this GitHub gist</a>.
>
> I don't run Linux on any systems with a dedicated GPU, so unfortunately I cannot test these out myself.

Before anything else, let's do a full upgrade of all existing packages while still on Bookworm:

```bash
sudo apt update && sudo apt full-upgrade -y
```

Now we need to change the <a href="https://wiki.debian.org/AptCLI" target="_blank" umami-data-event="upgrade-debian-trixie-aptcli">APT</a> repositories from fetching `bookworm` packages to new-fangled `trixie` ones. Use the below command to edit the repos:

```bash
sudo apt edit-sources
```

Choose an editor to open the `sources.list` file with domains to the Debian repositories. What you need to do here is change every instance of `bookworm` to `trixie`, including from `bookworm-security` to `trixie-security` and `bookworm-updates` to `trixie-updates`. When done editting, save and close the editor.

If you have any 3rd party repositories in `/etc/apt/sources.list.d` I'd just leave them alone, things like Google Chrome and the Tailscale GUI client will continue to work as usual after the upgrade, most other 3rd party packages and all standard packages and utilities that came installed with Debian 12 should too.

Next we'll fetch from the new repositories and do a _minimal_ upgrade using the `--without-new-pkgs` option, this will "hold back" some packages to prevent deleting any important dependencies too soon.

```bash
sudo apt update && sudo apt upgrade --without-new-pkgs
```

This will take a while most likely, so be patient. When it's finally done, it's time to do a full upgrade from Debian 12 Bookworm to Debian 13 Trixie. This will take some time too, so just be aware as you'll want to babysit it to react to any prompts during the upgrade.

```bash
sudo apt full-upgrade --autoremove -y
```

During the upgrade you'll most likely get prompts to restart some services, use your arrow keys to select `<Yes>` and hit <kbd>Enter</kbd> to continue past this. You may also be prompted about configuration files, it's usually best to go with the default choice by hitting <kbd>Enter</kbd>, this will keep your existing configs rather than replacing them.

Once the full upgrade is done, I suggest double-checking that any unused package dependencies are purged and then cleaning out the apt cache:

```bash
sudo apt --purge autoremove -y
sudo apt autoclean
```

Finally, we need to reboot the machine to complete the upgrade. If using a desktop environment you may find that restarting through the GUI doesn't work, so just use a terminal command to reboot:

```bash
sudo reboot
```

When you're back in, you should notice some differences if you are using a desktop environment (for me, the new version of KDE Plasma was immediately apparent), but all your applications and most settings will be as you left them. I only had to re-favorite and re-pin to taskbar my important apps, and re-confirm Chrome as the default browser. On a headless server, it should look and work mostly the same, although you will probably notice the new look of <a href="https://news.itsfoss.com/apt-3-release/" target="_blank">Apt 3.0</a> when you use it.

Enjoy using the latest version of Debian!