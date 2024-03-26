---
title: "How to format and/or partition disks in Linux"
description: "Just a quick guide to format and partition hard drives in Linux command line that I wrote for myself a long time ago, and recently had to reference again."
pubDate: 2022-10-08
tags:
  - Linux
  - Command Line
---

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> Be aware that using these instructions to format a disk or delete partitions will lead to the loss of any data contained therein.

## Formatting a disk

Let’s assume you have two disks on your Linux machine and you want to format a specific one. First list your disks with `df -h` and you should get output like this:

```bash
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           385M  1.3M  383M   1% /run
/dev/sda2       458G  7.3G  427G   2% /
/dev/sdb        687G  538G  114G  83% /mnt/data
tmpfs           1.9G     0  1.9G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           385M  4.0K  385M   1% /run/user/1000
```

We want to format `/dev/sdb`, but first it needs to be unmounted with `sudo umount /dev/sdb`, then you would do the following, depending on filesystem you want to use:

```bash
sudo mkfs.ext4 /dev/sdb # ext4 filesystem
sudo mkfs.ntfs /dev/sdb # ntfs filesystem
sudo mkfs.vfat /dev/sdb # vfat filesystem
```

## Managing partitions

To manage partitions on a disk, I like to use `fdisk` since it’s dialog-based and easy to use. Let’s assume `/dev/sdb` has two partitions -- `sdb1` and `sdb2` -- but you want to delete one. Use this command to enter the `fdisk` dialog:

```bash
sudo fdisk /dev/sdb
Command (m for help):
```

Quick list of some important commands:

- `m` will list all available commands
- `d` will prompt you to choose an existing partition to _delete_ (type a number to delete that partition)
- `n` will prompt you to _add a new partition_ and choose the _partition type_ (`p` for _primary_ or `e` for _extended_)
- `q` will quit without saving changes
- `w` will write to disk and reboot the system

In our case we want to delete the second partition, so at the prompt we’d use `d` and then `2` to delete that second partition. If we wanted to, we could then delete the first partition (`d` and `1`) then create a new partition to take up the whole disk with `n`, choosing the defaults for first and last sector.

You’d then use `mkfs` as above to format the partition with a filesystem, if one is not already present. Alternately, you could delete all partitions and not add any, then use `fdisk` to format the entire disk. This is actually my preferred method since I have little need for partitions in my home server, and it’s really only necessary if you want to use multiple filesystems in one disk, or if you’re using the disk for swap space.

## References

- <a href="https://man7.org/linux/man-pages/man8/fdisk.8.html" target="_blank">FDisk man page</a>
- <a href="https://man7.org/linux/man-pages/man8/mkfs.8.html" target="_blank">MKFS man page</a>
