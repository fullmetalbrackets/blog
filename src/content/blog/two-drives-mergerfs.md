---
title: "Using MergerFS to combine multiple hard drives into one unified media storage"
description: 'My situation was simple -- I have on my home server a 2 TB hard drive for media storage that was filling up, and I wanted to add a second drive, but not have to keep track of which drive specific files were in. Enter mergerfs, an open source "union filesystem" that lets you merge multiple storage drives into one mount point.'
pubDate: 2024-03-11
updatedDate: 2025-02-03
tags:
  - command line
---

## Sections

1. [What and why](#what)
2. [Install and configure MergerFS](#install)
3. [References](#ref)

<div id='what' />

## What and Why

<a href="https://github.com/trapexit/mergerfs" target="_blank">MergerFS</a> is free and open source software described as a "featureful union filesystem." I discovered it (along with easy to understand set up instructions) via <a href="https://perfectmediaserver.com/02-tech-stack/mergerfs" target="_blank">Perfect Media Server</a>, itself a great resource for self-hosters. Essentially what MergerFS does is act as a proxy so that multiple hard drives can be accessed at one mount point. What does that mean? Well, lets go over my situation.

I had a 2 TB hard drive where I kept only video files mounted at `/mnt/videos`, and another 1 TB drive with my music and photos mounted at `/mnt/other`. I wanted to add a third drive that already had some other movies and lots of free space, which I was considering mounting at `/mnt/extra`. The folder structure would have looked like this:

```bash
/mnt/videos
  ├── movies
  └── tvshows
/mnt/other
  ├── music
  └── photos
/mnt/extra
  └── movies
```

What a mess! And with movies spread across multiple drives, how to keep track of what files are in which hard drive? What if we could just not worry about which drives specific files are in and they could all be together in mount point? MergerFS to the rescue! It will unify all three drives into one mount point where you can access everything. The new file structure will then be like this:

```bash
/srv/media
  ├── movies
  ├── music
  ├── photos
  └── tvshows
```

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> Not that I am using `/srv/media` as a unified mount point just as an example. My drives will have new mount points at `/mnt/media1`, `/mnt/media2`, etc. and so I chose `/srv/media` as the unified mount point to avoid any conflicts or other weirdness. Feel free to put your unified mount point where ever you like, e.g. `/opt/media` or whatever.

With their powers combined, I gain access any media across all three drives at my chosen single mount point, at `/srv/media`.

<div id='install' />

## Install and configure MergerFS

MergerFS can be installed via package manager, for example on Debian use the command `sudo install mergerfs`, but the stable release on your distro's repositories may not have the most up-to-date version of it available. I'll be using the <a href="https://github.com/trapexit/mergerfs/releases/latest" target="_blank">latest release from the GitHub page</a> as recommended by the developer. (Note, the examples below use the `.deb` package and `amd64` architecture because that's what I use, make sure you get the correct version for the system you're running!)

First download the package from GitHub:

```bash
❯ wget https://github.com/trapexit/mergerfs/releases/download/2.40.2/mergerfs_2.40.2.debian-bookworm_amd64.deb
```

Then install it with this command:

```bash
❯ dpkg -i mergerfs_2.40.2.debian-bookworm_amd64.deb
```

Configuration is simple, done just by editing `/etc/fstab`. First, an example of how my fstab file looked before MergerFS, when I was mounting each HDD into a subdirectory within my home directory.

```bash
...
UUID=218236ca-8e14-47ae-866a-a91e70c88a2a   /mnt/videos   ext4    errors=remount-ro   0   0
UUID=5e3d1d44-2979-488d-a21a-9fa06508c470   /mnt/other    ext4    errors=remount-ro   0   0
UUID=cce7cdab-a2df-4d4f-aac3-98fab2afdbd5   /mnt/extra    ext4    errors=remount-ro   0   0
```

As suggested by Perfect Media Server, I changed the mount points for each drive to be `/mnt/media1`, `/mnt/media2`, and `/mnt/media3`. This way by using `/mnt/media*` for the new mergerfs entry in fstab, it will pick up all the drives and any future ones I add that uses the same naming scheme. The new unified single mount point will be in `/srv/media` where it'll be accessible by qBittorrent for saving downloaded media and by Plex for streaming that media.

Here's how my fstab file looks now.

```bash
...
UUID=218236ca-8e14-47ae-866a-a91e70c88a2a   /mnt/media1   ext4    errors=remount-ro   0   0
UUID=5e3d1d44-2979-488d-a21a-9fa06508c470   /mnt/media2   ext4    errors=remount-ro   0   0
UUID=cce7cdab-a2df-4d4f-aac3-98fab2afdbd5   /mnt/media3   ext4    errors=remount-ro   0   0
/mnt/media*   /srv/media    fuse.mergerfs   defaults,allow_other,use_ino,moveonenospc=true,dropcacheonclose=true,category.create=mfs,fsname=mergerfs    0   0
```

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> I used the options suggested at Perfect Media Server and have had no issues, so I've just kept using them. Make sure to <a href="https://github.com/trapexit/mergerfs?tab=readme-ov-file#options" target="_blank">read up on all the available options</a> if you want use different options.

Once the changes were made in `/etc/fstab`, I unmounted all the drives from their old mount points, created the new mount point, and rebooted so the new `fstab` config would take effect and remount the drives to their new mount points.

```bash
❯ sudo umount /mnt/videos /mnt/other /mnt/extra
❯ mkdir /srv/media
❯ sudo reboot
```

Once the machine is back up and I'm reconnected via SSH, it's time to check if everything shows up where it's supposed to.

```bash
❯ ls /srv/media
movies  music  photos  tvshows
```

Exploring your new unified mount point should show all your data! At that point you can delete the old mounts points if you haven't already and point your services at the new unified mount point.

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> If you encounter a problem after reboot, you probably messed something up in the fstab file, the syntax can be tricky. Edit it to fix any issues and reboot again. If you want to be safe, try commenting out rather than editing any existing fstab entries until you know everything is working properly.

## Related Articles

> [Bootstrapping a fresh Linux install with Ansible](/blog/bootstrapping-fresh-linstall-with-ansible/)

> [Mounting (either internal or external) hard drives in Linux](/blog/mounting-hard-drives-in-linux/)

<div id='ref' />

## References

- <a href="https://github.com/trapexit/mergerfs" target="_blank">MergerFS</a>
- <a href="https://perfectmediaserver.com" target="_blank">Perfect Media Server</a>