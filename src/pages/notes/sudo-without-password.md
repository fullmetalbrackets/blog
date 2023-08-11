---
layout: "@layouts/Note.astro"
title: "Sudo without password"
description: "How to use sudo command in Linux without the password prompt, by adding a line to the sudoers file."
pubDate: "April 20, 2022"
tags:
  - Linux
---

<div>
  <div class="info">
    <span>
      <img src="/img/assets/info.svg" class="info-icon">
      <b>Information</b>
    </span>
    <p>
      <a href="https://man7.org/linux/man-pages/man5/sudoers.5.html" target="_blank">Man page for logind.conf</a>
    </p>
  </div>
</div>
<br>

Removing the sudo password prompt is done by editing the `/etc/sudoers` file, however you should never edit this file directly, but instead use `sudo visudo` to do so.

The file will look something like this:

```bash
# User privilege specification
root    ALL=(ALL:ALL) ALL

# Members of the admin group may gain root privileges
%admin  ALL=(ALL) ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
```

There's two ways to disable the password prompt.

### Disable password prompt for a specific user

Use `sudo visudo` and add the following line to `/etc/sudoers` file:

```bash
username    ALL=(ALL) NOPASSWD: ALL
```

### Disable password prompt for all sudoers

Use `sudo visudo` and edit the `%sudo` line in `/etc/sudoers` file:

```bash
%sudo   ALL=(ALL:ALL) NOPASSWD: ALL
```

After editing `/etc/sudoers` check the syntax is OK.

```bash
visudo -c
/etc/sudoers: parsed OK
/etc/sudoers.d/README: parsed OK
```
