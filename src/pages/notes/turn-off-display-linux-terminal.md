---
layout: "@layouts/Note.astro"
title: "Commands to turn off display in the Linux terminal"
description: "Sometimes I use laptops in the home lab, and to save myself on a few watts of power usage I use these terminal commands to turn off the display, then just SSH into it from my PC."
pubDate: "December 3, 2022"
tags:
  - Command Line
---

<div>
  <div class="info">
    <span>
      <img src="/img/assets/info.svg" class="info-icon">
      <b>Information</b>
    </span>
    <p>
      Reference: <a href="https://askubuntu.com/questions/62858/turn-off-monitor-using-command-line" target="_blank">Several answers to this post on AskUbuntu</a>
    </p>
  </div>
</div>

## With VBETool

_Source:_ https://askubuntu.com/a/62861

Install `vbetool` if missing:

```bash
sudo apt install vbetools
```

Turn off monitor in console:

```bash
sudo vbetool dpms off
```

To regain control of the console on pressing Enter key:

```bash
sudo sh -c 'vbetool dpms off; read ans; vbetool dpms on'
```

## With XServer

_Source:_ https://askubuntu.com/a/116806

To Turn Off:

```bash
xset -display :0.0 dpms force off
```

To Turn On:

```bash
xset -display :0.0 dpms force on
```

If your display turns off and then immediately back on then try the following which adds a delay of 1 second before turning the screen off. This give a chance for all events to be processed by the X server before turning the display off.

```bash
sleep 1 && xset -display :0.0 dpms force off
```

## With setterm

_Source:_ https://askubuntu.com/a/1076734 & https://askubuntu.com/a/1194293

The below command will make the screen go blank automatically every minute (if idle) and any key press will turn it back on:

```bash
setterm --blank 1
```

Append `--powerdown 5` to power off the display after 5 minutes:

```bash
setterm --blank 1 --powerdown 5
```

And even better, if you want the command to be executed automatically at boot, you can add it to the GRUB command line, to do so we have to edit the next file:

```bash
sudo nano /etc/default/grub
```

Once there, just add `consoleblank=60` to `GRUB_CMDLINE_DEFAULT`, it should look like this:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet consoleblank=60"
```

Then close the file and save it, after that just run `sudo update-grub` and voila, every time you boot the screen will turn off automatically every 60 sec. (again, if idle).

And this way (adding the _consoleblank_ to the GRUB) works even from remote terminals via SSH.

Alternately you can create a bash script to execute at boot. Create the script file somewhere, for example:

```bash
nano /home/USER/.boot-scripts/screen-off.sh
```

Copy & paste the below into it:

```bash
#!/bin/bash
setterm --blank 1 --powerdown 5
```

Make the script executable by _systemctl_. Create file `/etc/systemd/system/screen-off.service` and insert:

```bash
[Unit]
Description=Blank screen after 1 min and turn it off after 5 min. Any keypress will turn it back on.
After=ssh.service

[Service]
Type=oneshot
Environment=TERM=linux
StandardOutput=tty
TTYPath=/dev/console
ExecStart=/home/USER/.boot-scripts/screen-off.sh

[Install]
WantedBy=local.target
```

Make it executable:

```bash
sudo chmod +x /home/USER/.boot-scripts/screen-off.sh
sudo chmod +x /etc/systemd/system/screen-off.service
```

And finally get it working and enabled on boot:

```bash
sudo systemctl start screen-off.service
sudo systemctl enable screen-off.service
```

To disable it:

```bash
sudo systemctl disable screen-off.service
```
