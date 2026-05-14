---
title: How to find out when a Linux filesystem was created
pubDate: 2026-05-14 15:00:00
description: If you want to find out when a Linux filesystem was created, the tune2fs command will give you this information, along with many more details.
tags: ['linux', 'command line', 'code snippet']
related: ['upgrade-debian-12-bookworm-debian-13-trixie', 'sudo-without-password']
---

## Where the command is available

`tune2fs` is part of the `e2fsprogs` package, which is usually included by default on Debian, Red Hat and Arch based distributions. Be sure to install it if necessary; for example, it is not present on Alpine Linux.

You can verify the command is available with `sudo tune2fs v`. (Using the command requires root.)

## Using the command

First, if necessary, you can list all your filesystems with the command `lsblk`.

The command to check a filesystem's creation date is:

```sh
sudo tune2fs -l /dev/sda | grep 'Filesystem created:'
```

The `-l` option gives many details about the specified filesystem, so using `grep` will let you only output the specific information you need.

If you want to check the date you installed Linux on your root filesystem, you can use the below command without needing to specify the location:

```sh
sudo tune2fs -l $(df / | tail -n 1 | awk -F' ' '{ print $1 }') | grep 'Filesystem created:'
```

## References

- [This answer from Stack Exchange](https://unix.stackexchange.com/a/9993)
- [tune2fs manpage](https://linux.die.net/man/8/tune2fs)