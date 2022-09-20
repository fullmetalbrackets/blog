---
layout: "../../layouts/BlogPost.astro"
title: "Rsync - A Quick Guide"
description: "Rsync is a very handy tool for doing high-speed file transfers between Linux hosts over a local network or remote hosts on the internet, such as EC2 instances on Amazon Web Services. You can pass options to Rsync to do things like recursive transfer (all files and sub-directories within the source directory are also transferred), ignore existing or newer files at the destination, and more."
pubDate: "September 15, 2021"
tags:
  - linux
  - terminal
---

Rsync is a very handy tool for doing high-speed file transfers between Linux hosts over a local network or remote hosts on the internet, such as EC2 instances on Amazon Web Services. You can pass options to Rsync to do things like recursive transfer (all files and sub-directories within the source directory are also transferred), ignore existing or newer files at the destination, and more.

To explain Rsync, let's pretend we want to transfer a directory of photos between two Linux hosts. The hostname of the computer with the photos is called **Workstation**, and the main user is **Monica**. The hostname of the receiving computer is unknown, but it's IP address is **192.168.1.100** and it's user is **Chandler**. Monica only wants photos in .jpg format to be transferred, wants to skip transferring any photos that already exist at the destination unless she has a newer version of it, and wants to NOT transfer files over 100MB in size. She will use the below command and options:

```bash
rsync -rvuz --progress --max-size=100M /home/Monica/photos/*.jpg Chandler@192.168.1.100:/mnt/storage/photos/
```

Let's break it down:

- `rsync` is the command to invoke Rsync, not much to explain here.
- `-r` or `--recursive` will copy directories recursively, which will include all sub-directories (and sub-directories within sub-directories) and all files within them.
- `-v` or `--verbose` displays information on the files being transferred, without this Rsync will work silently and not display any new information until it is done running.
- `-u` or `--update` will skip files present at the destination IF the file at the destination is newer. This way you'll only transfer files that are new or existing files that were modified.
- `-z` or `--compress` will compress the files being transferred, which can significantly increase transfer speeds, especially when transferring to remote hosts over the internet.
- `--progress` will display the progress of files as they are transferred, giving you even more information as Rsync runs.
- `--max-size=100M` prevents files at or over the specified file size (in this case 100MB) from being transferred.

This is just a small sample of the options available, but this set of options is a good base to start using Rsync. A lot of people use Rsync as an automatic backup solution by using a cronjob to schedule transfers and using specific options only transfer certain files.

## Using RSync with Cron

Let's have Monica do that now with the following command:

```bash
crontab -e
```

This will open the Cron file in your default text editor. Monica wants to run the same Rsync command as above every Saturday at 3:00AM, so the transfer happens when no one is using the Workstation. She'll have to put this into the crontab just below the commented text:

```shell
0 3 * * SAT rsync -rvuz --progress --max-size=100M /home/Monica/photos/*.jpg Chandler@192.168.1.100:/mnt/storage/photos/
```

What's all that junk before the rsync command? You schedule cron jobs by expressing the timing in five fields: minutes, hours, day of the month, month, and day of the week. If this makes no sense, just know that I am right there with you, which is why I use a handy tool called [CronMaker](https://cronmaker.com) to make sense of it. Also, although it kind of defeats the purpose of this post, there is a handy tool with a slick GUI that lets you create your Rsync command with checkboxes and fields specifying what they do, go check out [Rsyncinator](https://www.rsyncinator.app/web).

Finally, for a list of ALL the rsync options with short descriptions of what they do, check out the [Rsync man page](https://download.samba.org/pub/rsync/rsync.1), a truly exhaustive manual for understanding all the granular details of Rsync.

## References

- [Rsyncinator](https://www.rsyncinator.app/web)
- [Cronmaker](https://cronmaker.com)
- [Rsync Man Page](https://download.samba.org/pub/rsync/rsync.1)
- [Cron Man Page](https://man7.org/linux/man-pages/man8/cron.8.html)
- [Crontab Man Page](https://man7.org/linux/man-pages/man5/crontab.5.html)
