---
title: 'How to autologin on Ubuntu and go straight to terminal'
description: 'Configure an Ubuntu machine to autologin and go straight into the terminal on boot.'
pubDate: 2022-11-25
tags: ['linux', 'command line', 'code snippet']
related: ['formatting-on-linux', 'mounting-hard-drives-in-linux']
howto: true
---

> Works on Ubuntu **20.04** but untested in 22.04 or other distros.

## How to do it

```bash
sudo systemctl edit getty@.service
```

This should open the `override.conf` file in your default text editor, creating one if it does not already exist. (If the above does not work, try `sudo systemctl edit getty@tty1` instead.) Most likely the file will not exist so it will be newly created and empty, copy and paste this string of text into it (where `[user]` is an existing user _with sudo privileges_):

```bash
ExecStart=-/sbin/agetty --autologin [user] --noclear %I $TERM
```

Look for the line `ExecStart=` and replace whatever is in there with the above. Save the file and next reboot skip the login and go straight to the terminal.

## My use case

My reason for wanting to do this was to have my [PiHole](https://pi-hole.net) device automatically execute the [PADD](https://github.com/pi-hole/PADD) script automatically on reboot and display the stats. Using the above steps I was able to get the PiHole to boot up, skip login and automatically execute the script to display the stats.

## Reference

- I found this simple change buried in [this exhaustive post on AskUbuntu](https://askubuntu.com/a/659268).
