---
title: "Formatting disks in Linux command line"
description: "Commands necessary to delete partitions, wipe a disk completely and install a new filesystem."
pubDate: 2023-07-03
tags:
  - Linux
---

<div>
  <div class="info">
    <span>
      <img src="/assets/info.svg" class="info-icon" alt="Information" loading="lazy" decoding="async" />
      <b>Information</b>
    </span>
    <p>
      For more details see <a href="https://askubuntu.com/a/558412" target="_blank">this answer on AskUbuntu by Mateen Ulhaq</a>
    </p>
  </div>
</div>
<br>

List mounted disks

```bash
lsblk

NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda      8:0    0 111.8G  0 disk
├─sda1   8:1    0   512M  0 part /boot/efi
├─sda2   8:2    0 110.3G  0 part /
└─sda3   8:3    0   976M  0 part [SWAP]
sdb      8:16   1   7.2G  0 disk
└─sdb1   8:17   1   7.2G  0 part
```

Unmount the disk to re-format

```bash
sudo umount /dev/sdb
```

Use _fdisk_ utility

```bash
sudo fdisk /dev/sdb
```

Commands to use

```bash
  p         # List partitions
  d         # Delete partition
  # repeat p to list d to delete multiple partitions
  n         # Create new partition. Physical, accept defaults for size, etc.
  t         # Change type - for USB drives use option b (vfat) or c (bigger USB sticks)
  w         # Write changes & quit fdisk
```

Disk is now formatted with one new VFat partition. Now create filesystem:

```bash
sudo mkfs -t vfat /dev/sdb1
```

## All _fdisk_ commands

```bash
  GPT
   M   enter protective/hybrid MBR

  Generic
   d   delete a partition
   F   list free unpartitioned space
   l   list known partition types
   n   add a new partition
   p   print the partition table
   t   change a partition type
   v   verify the partition table
   i   print information about a partition

  Misc
   m   print this menu
   x   extra functionality (experts only)

  Script
   I   load disk layout from sfdisk script file
   O   dump disk layout to sfdisk script file

  Save & Exit
   w   write table to disk and exit
   q   quit without saving changes

  Create a new label
   g   create a new empty GPT partition table
   G   create a new empty SGI (IRIX) partition table
   o   create a new empty MBR (DOS) partition table
   s   create a new empty Sun partition table
```
