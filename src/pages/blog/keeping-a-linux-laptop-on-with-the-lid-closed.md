---
layout: "../../layouts/BlogPost.astro"
title: "Keeping a Linux laptop on when the lid is closed"
description: "I tend to use old laptops as my home lab when I want to test anything on Linux, and for the longest time my home server was an old gaming laptop with a broken screen. Laptops barely take up space with the lid closed, and it only takes few quick commands to keep laptops on with the lid closed."
pubDate: "October 4, 2022"
tags:
  - Linux
  - Command Line
---

Run the following command to edit the _login configuration file_:

```bash
sudo nano /etc/systemd/logind.conf
```

Look for the following commented lines in the file:

```ini
#HandleLidSwitch=suspend
#HandleLidSwitchExternalPower=suspend
#HandleLidSwitchDocked=ignore
```

> #### What they do:
>
> - `HandleLidSwitch`: Lid close behavior _while not plugged in_.
> - `HandleLidSwitchExternalPower`: Lid close behavior _while plugged in_.
> - `HandleLidSwitchDocked`: Lid close behavior _while docked_.

Let's assume you want the laptop to stay on no matter what when the lid is closed, we'll uncomment and edit all three lines, telling Linux to _ignore_ these events:

```ini
HandleLidSwitch=ignore
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
```

Save the file and reboot for the changes to take effect. After boot, your laptop will always remain on when closed.

## References

- <a href="https://man7.org/linux/man-pages/man5/logind.conf.5.html" target="_blank">Man page for logind.conf</a>
