---
title: 'How to keep a Linux laptop on when the lid is closed'
description: 'I sometimes use old laptops as headless servers in my homelab when I want to test something on Linux, or play around with a new distribution, and I prefer to keep them closed so they take up less space. A few quick commands will keep the laptop even on with the lid closed.'
pubDate: 2022-10-04
updatedDate: 2026-03-05
tags: ['linux', 'command line']
related: ['basic-linux-commands', 'mounting-hard-drives-in-linux']
---

> This is specifically for *headless* Linux on a laptop, meaning there is no GUI or desktop environment.

## Edit configuration file

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

> What they do:
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

Save the file and restart the service for changes to take effect.

```bash
sudo systemctl restart systemd-logind
```

If even after these changes the laptop does not stay on when closed, you probably need to disable Sleep and Suspend states. Do so with this command:

```bash
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

## Shutdown the display when lid is closed (optional)

Doing the above, the display will stay on when the lid is closed. To make the display shut down when the lid is closed and save some power, we'll need to do some additional work.

We'll need to install the packages `vbetool` (to control the display) and `acpid` (a daemon to monitor hardware power events).

```bash
sudo apt install vbetool acpid
```

Now we're going to create a super simple shell script that will trigger when the lid is closed and shut down the display.

Create the script in the necessary directory with `sudo nano /etc/acpi/lid.sh` and copy/paste in the below:

```bash
#!/bin/bash

grep -q close /proc/acpi/button/lid/*/state
if [ $? = 0 ]; then
    vbetool dpms off
fi

grep -q open /proc/acpi/button/lid/*/state
if [ $? = 0 ]; then
    vbetool dpms on
fi
```

The first block of code will detect when the lid is closed and use `vbetool` to turn off the display, while the second detects the lid is open and turns the display on. That's it.

Use the below command to make the script executable:

```bash
sudo chmod +x /etc/acpi/lid.sh
```

Now we have to tell the system to run this script whenever a lid event (opening/closing) occurs.

Create this file `sudo nano /etc/acpi/events/lid-button` and copy/paste the below:

```bash
event=button/lid.*
action=/etc/acpi/lid.sh
```

Finally, restart the `acpi` service so it will pick up the new event file.

```bash
sudo service acpid restart
```

> [warning] Note
>
> `vbetool` requires root privileges to interact with video hardware. If you encounter `Real mode call failed` errors, your hardware may not support `vbetool`.
>
> Consider instead using `xset dpms force off` (for X11) or `setterm --blank 1` (for TTY).

## Reference

- <a href="https://man7.org/linux/man-pages/man5/logind.conf.5.html" target="_blank" data-umami-event="keep-lid-open-logind-conf-manpage">Man page for logind.conf</a>
