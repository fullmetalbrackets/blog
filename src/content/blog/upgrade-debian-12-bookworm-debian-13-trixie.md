---
title: "How I upgraded my Linux desktop from Debian 12 Bookworm to Debian 13 Trixie"
description: "My old Dell Optiplex has been a great desktop PC for just minimal interneting and coding. I've been running Debian 12 Bookworm on it since it became available, and usually I stick to the latest Stable release of Debian. However, I decided to live on the edge just a little and upgrade to Debian 13 Trixie, which is still in testing."
pubDate: 2025-05-21
updatedDate: 2025-09-11
tags:
  - linux
---

## About upgrading

Note that I'm just basing this off my own experience. I went from Debian 12 Bookworm, with all my settings, installed apps and custom configurations to Debian 13 Trixie, and had no major issues during or after the upgrade. Applications like Google Chrome, VSCode, the Tailscale GUI client, LibreOffice and all pre-installed apps have worked completely fine.

Just because I encountered no problems does not mean you won't. Make sure to make a backup of your main user Home directory and anything else you deem important, just in case you encounter some fatal error and have to start from scratch. (Highly doubtful, but just saying.)

> Note: I originally wrote this post in May 2025, when Trixie was in "release candidate" state. Trixie officially released on August 9, so if you're here after that date, you should have absolutely zero problems updating from Bookworm to Trixie.

## Upgrading apt repositories to Trixie

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

Finally, we need reboot the machine to complete the upgrade. Trying to restart through the GUI was not working for me, so just use a terminal command to reboot:

```bash
sudo reboot
```

When you're back in, you may notice some things look different (for me, the new version of KDE Plasma was immediately apparent) but all your applications and most settings will be as you left them. I only had to re-favorite and re-pin to taskbar my important apps, and re-confirm Chrome as the default browser.