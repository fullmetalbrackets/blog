---
title: "Using MergerFS to combine multiple hard drives into one unified media storage"
description: 'My situation was simple -- I have on my home server a 2 TB hard drive for media storage that was filling up, and I wanted to add a second drive, but not have to keep track of which drive specific files were in. Enter mergerfs, an open source "union filesystem" that lets you do exactly this right in the fstab config.'
pubDate: 2024-03-11
tags:
  - Linux
  - Self-Hosting
---

## Sections

1. [What and why](#what)
2. [Install and configure MergerFS](#install)
3. [References](#ref)

<div id='what' />

## What and Why

<a href="https://github.com/trapexit/mergerfs" target="_blank">MergerFS</a> is free and open source software described as a "featureful union filesystem." I discovered it (along with easy to understand set up instructions) via <a href="https://perfectmediaserver.com/02-tech-stack/mergerfs" target="_blank">Perfect Media Server</a>, itself a great resource for self-hosters. Essentially what MergerFS does is act as a proxy so that multiple hard drives can be accessed at one mount point. What does that mean? Well, lets go over my situation: I had a 2 TB hard drive where I kept only video files at `/dev/sdb`, and another 1 TB drive with my music and photos at `/dev/sdc`. I wanted to add a third drive with some other movies (with lots of free space compared to the others) at `/dev/sdd`, but I'd rather store all file types there, not just (for example) more movies. How to keep track of what's where? And now I'd be juggling three different mount points? MergerFS lets you avoid this, unifying all three drives into one mount point where you can access everything.

Let's visualize it:

```bash
├── /dev/sdb # existing HDD mounted at ~/home/ad/videos
│   ├── movies
│   └── tvshows
├── /dev/sdc # existing HDD mounted at ~/home/ad/pics-music
│   ├── music
│   └── photos
├── /dev/sdd # newly added HDD mounted at /home/ad/new-drive
│   └── movies
└── /home/ad/media # unified mount point via mergerfs
    ├── movies
    ├── music
    ├── photos
    └── tvshows
```

<div>
  <div class="note">
    <span>
      <img src="/img/assets/note.svg" class="note-icon" loading="eager" decoding="async" alt="Note" />
      <b>Note</b>
    </span>
    <p>
      I like to put all my stuff in my home directory (<code>/home/ad/...</code>) so I had each drive mounted there and will still mount the new unified storage in there at <code>/home/ad/media</code>. You don't have to do this and it may not even be best practice, but I'm set in my ways and I'm the only one that accesses this server.
    </p>
  </div>
</div>

With their powers combined, I gain access any media across all three drives at my chosen single mount point at `/home/ad/media`, where it's all accessible by Plex and other services.

<div id='install' />

## Install and configure MergerFS

MergerFS can be installed via `sudo install mergerfs`, but the stable release on your distro's repositories may not have the most up-to-date available. I'll be using the <a href="https://github.com/trapexit/mergerfs/releases/latest" target="_blank">latest release from the GitHub page</a> as recommended. (Make sure you get the correct version for the system you're running, the examples below use the version specific to my distro and architecture.)

First download it:

```bash
wget https://github.com/trapexit/mergerfs/releases/download/2.40.2/mergerfs_2.40.2.debian-bookworm_amd64.deb
```

Then install it:

```bash
dpkg -i mergerfs_2.40.2.debian-bookworm_amd64.deb
```

Configuration is simple, done just by editing `/etc/fstab`. First, an example of how my fstab file looked before MergerFS, when I was mounting each HDD into it's own directory.

```bash
...
UUID=218236ca-8e14-47ae-866a-a91e70c88a2a   /home/ad/videos       ext4    errors=remount-ro   0   0
UUID=5e3d1d44-2979-488d-a21a-9fa06508c470   /home/ad/pics-music   ext4    errors=remount-ro   0   0
UUID=cce7cdab-a2df-4d4f-aac3-98fab2afdbd5   /home/ad/new-drive    ext4    errors=remount-ro   0   0
```

As suggested by Perfect Media Server, I changed the mount points for each drive to be `/mnt/media1`, `/mnt/media2`, and `/mnt/media3`. This way by using `/mnt/media*` for the new mergerfs entry, it will pick up all the drives and any future ones I add. The new unified single mount point will be in `/home/ad/media`, still in my home directory like I had it before, but now everything in one spot instead of multiple directories.

Here's how my fstab file looks now.

```bash
...
UUID=218236ca-8e14-47ae-866a-a91e70c88a2a   /mnt/media1   ext4    errors=remount-ro   0   0
UUID=5e3d1d44-2979-488d-a21a-9fa06508c470   /mnt/media2   ext4    errors=remount-ro   0   0
UUID=cce7cdab-a2df-4d4f-aac3-98fab2afdbd5   /mnt/media3   ext4    errors=remount-ro   0   0
/mnt/media*   /home/ad/media    fuse.mergerfs   defaults,allow_other,use_ino,cache.files=off,moveonenospc=true,dropcacheonclose=true,category.create=mfs,fsname=mergerfs    0   0
```

<div>
  <div class="note">
    <span>
      <img src="/img/assets/note.svg" class="note-icon" loading="eager" decoding="async" alt="Note" />
      <b>Note</b>
    </span>
    <p>
      I used the options suggested at Perfect Media Server and have had no issues, but feel free to <a href="https://github.com/trapexit/mergerfs?tab=readme-ov-file#options" target="_blank">read up on all the available options</a> use different ones.
    </p>
  </div>
</div>

Once the changes were made in `/etc/fstab`, I unmounted all the drives from their old mount points, created the new mount point, and rebooted so the new fstab config would take effect.

```bash
cd ~/
sudo umount videos pics-music new-drive
mkdir media
```

Let's see if everything shows up where it's supposed to.

```bash
ls ~/media
movies  music  photos  tvshows
```

<div class="success">
  <span>
    <img src="/img/assets/success.svg" class="success-icon" loading="lazy" decoding="async" alt="Success" />
    <b>Success!</b>
  </span>
  <p>
    Exploring your new unified mount point should show all your data! At that point you can delete the old mounts points if you haven't already and point your services at the new unified mount point.
  </p>
  <p>
    If you encounter a problem after reboot, you probably messed something up in the fstab file, the syntax can be tricky. Edit it to fix any issues and reboot again. If you want to be safe, try commenting out rather than editing any existing fstab entries until you know everything is working properly.
  </p>
</div>

<div id='ref' />

## References

- <a href="https://github.com/trapexit/mergerfs" target="_blank">MergerFS</a>
- <a href="https://perfectmediaserver.com" target="_blank">Perfect Media Server</a>

- <a href="https://libre.computer" target="_blank">Libre Computer</a>
- <a href="https://hub.libre.computer/t/debian-11-bullseye-and-12-bookworm-for-libre-computer-boards/230" target="_blank">Libre's instructions for installing Debian</a>
- <a href="https://hub.libre.computer/t/libre-computer-aml-s905x-cc-emmc-flashing-steps-from-linux/33" target="_blank">Flashing Linux to eMMC</a>
- <a href="https://hub.libre.computer/t/booting-from-external-usb-device-or-bootrom-unsupported-device/51" target="_blank">Booting from External USB Device (alternative to eMMC boot)</a>
- <a href="https://www.home-assistant.io/docs" target="_blank">Home Assistant Documentation</a>
