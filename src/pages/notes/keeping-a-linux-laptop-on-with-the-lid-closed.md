---
layout: "@layouts/Note.astro"
title: "Keeping a Linux laptop on when the lid is closed"
description: "I sometimes use old laptops in my home lab when I want to test anything on Linux, and I prefer to keep them closed so they take up less space. A few quick commands will keep the laptop even on with the lid closed."
pubDate: "October 4, 2022"
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
      Referenced from <a href="https://man7.org/linux/man-pages/man5/logind.conf.5.html" target="_blank">Man page for logind.conf</a>
    </p>
  </div>
</div>
<br>

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

Save the file and reboot for the changes to take effect. After boot, your laptop will always remain on when closed.
