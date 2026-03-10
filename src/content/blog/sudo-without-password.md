---
title: 'How to use Sudo command without being prompted for password'
description: 'If you find yourself using the sudo command a lot and are tired of typing your password constantly, you can make the password prompt go away by editting a single line in one configuration file.'
pubDate: 2022-04-20
updatedDate: 2026-03-05
tags: ['linux', 'command line']
related: ['basic-linux-commands']
---

## Edit the sudoers file

Sudo configuration is done via the `/etc/sudoers` file. However you should never edit this file directly (e.g. `nano /etc/sudoers`) and instead use this command to do it:

```bash
sudo visudo
```

Editting this file with `visudo` instead of other text editors parses the file for syntax errors, only saving the changes if the check passes and preventing a save if the check fails, and it also locks the file while it's being editted. (Important for systems with multiple administrators, while one is editting the file another cannot.)

The `sudoers` file will look something like this:

```bash
# User privilege specification
root    ALL=(ALL:ALL) ALL

# Members of the admin group may gain root privileges
%admin  ALL=(ALL) ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
```

There's two ways to disable the password prompt.

## Disable password prompt for a specific user

Use `sudo visudo` and add the following line to `/etc/sudoers` file:

```bash
user    ALL=(ALL) NOPASSWD: ALL
```

This affects only the specific user, other users with `sudo` privileges will still get a password prompt when using it.

## Disable password prompt for all sudoers

Use `sudo visudo` and edit the `%sudo` line in `/etc/sudoers` file:

```bash
%sudo   ALL=(ALL:ALL) NOPASSWD: ALL
```

This affects **all users**, so **no one** will get a password prompt when using `sudo`. *Be careful doing this on systems with more than one administrator.*

After editing `/etc/sudoers`, you can double-check that the syntax is OK and you didn't break anything with the command `visudo -c`, you should get output like the below:

```bash
❯ visudo -c

/etc/sudoers: parsed OK
/etc/sudoers.d/README: parsed OK
```

## Reference

- <a href="https://man7.org/linux/man-pages/man5/sudoers.5.html" target="_blank">Man page for logind.conf</a>
