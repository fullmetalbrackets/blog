---
layout: "../../layouts/BlogPost.astro"
title: "How to autologin Ubuntu on reboot and go straight to terminal"
description: "Ever wanted to have a script automatically run when you reboot an Ubuntu server, but couldn't because the system prompts for a user login, and you're not sure how to skip that? Or maybe you just don't want to login each time you start up your workstation. Here's a quick and dirty guide on doing exactly this, so that on reboot your Ubuntu machine will just skip the prompt, go straight to terminal, and execute any scripts you have set up."
pubDate: "Sep 14 2021"
tags:
  - linux
  - terminal
---

Ever wanted to have a script automatically run when you reboot an Ubuntu server, but couldn't because the system prompts for a user login, and you're not sure how to skip that? Or maybe you just don't want to login each time you start up your workstation. Here's a quick and dirty guide on doing exactly this, so that on reboot your Ubuntu machine will just skip the prompt, go straight to terminal, and execute any scripts you have set up.

Note: I've only personally done this on Ubuntu, but it should work for most Linux distros, and almost certainly will also work for Debian-based distros at the very least.

### What do?!

In your server, use the following command:

```bash
sudo systemctl edit getty@.service
```

This should open the **override.conf** file in your default text editor, creating one if it does not already exist. Most likely it will not exist so the file will be newly created and empty, copy and paste this string of text into it (where `{{USER}}` is an existing user **with sudo privileges**):

```bash
ExecStart=-/sbin/agetty -a {{USER}} --noclear %I $TERM
```

If the file is already pre-populated with stuff, just look for the line `ExecStart=` and replace whatever is in there with the options above. Save and exit the editor. Next time you reboot, it should skip the login and go straight to the terminal.

### My Use Case

My reason for wanting to do this was to have my [PiHole](https://pi-hole.net) device automatically execute the [PADD](https://github.com/pi-hole/PADD) script automatically on reboot and display the stats. Using the above steps I was able to get the PiHole to boot up, skip login and automatically execute the script to display the stats.

### References

- I found this simple change buried in [this exhaustive post on AskUbuntu](https://askubuntu.com/a/659268).
