---
title: "Rsync - A Quick Guide"
description: "Rsync is a very handy tool for doing high-speed file transfers between Linux hosts over a local network or remote hosts on the internet, such as EC2 instances on Amazon Web Services. You can pass options to Rsync to do things like recursive transfer (all files and sub-directories within the source directory are also transferred), ignore existing or newer files at the destination, and more."
pubDate: 2021-09-15
updatedDate: 2023-07-24
tags: ["linux", "command line"]
related1: basic-linux-commands
related2: mounting-hard-drives-in-linux
---

# Rsync Basics

Let's start with using `rsync` to copy a directory, and all it's contents, to another location.

```bash
rsync -r /home/Chandler/stuff /opt/stuff
```

This will copy `stuff`, and all contents including sub-folders because of the `-r` option, into `/opt/`, creating a new `stuff` directory in the process.

If we wanted not to copy the `stuff` directory as a whole, but only the contents inside, to an existing directory, instead we'd use:

```bash
rsync -r /home/Chandler/stuff/* /opt/existing/
```

Here we're sending `stuff/*` the trailing slash and asterisk specifies only the contents, meaning at the destination we also add a trailing slash to `existing/` to specify the files being transferred go into that directory.

Now we upgrade to sending stuff between different machines on a network. Let's start with transferring a single file:

```bash
rsync /home/Chandler/report.txt Monica@192.168.1.20:/home/Monica/junk/report.txt
```

The above sends `report.txt` to the user `Monica` on machine `192.168.1.20` (Monica's IP address), into Monica's directory at `/home/Monica/junk`.

Likewise with a directory, it would be like this:

```bash
rsync /home/Chandler/stuff Monica@192.168.1.20:/home/Monica/stuff
```

Or only the contents of Chander's `/stuff` into Monica's `existing` directory:

```bash
rsync /home/Chandler/stuff/* Monica@192.168.1.20:/home/Monica/junk/
```

## Advanced Rsync-ing

To explain Rsync, let's pretend we want to transfer a directory of photos between two Linux hosts. The hostname of the computer with the photos is called **Workstation**, and the main user is **Monica**. The hostname of the receiving computer is unknown, but it's IP address is **192.168.1.19** and it's user is **Chandler**. Monica only wants photos in .jpg format to be transferred, wants to skip transferring any photos that already exist at the destination unless she has a newer version of it, and wants to NOT transfer files over 100MB in size. She will use the below command and options:

```bash
rsync -rvuogtz --progress --max-size=100M /home/Monica/photos/*.jpg Chandler@192.168.1.19:/mnt/storage/photos/
```

Let's break it down:

- `rsync` is the command to invoke Rsync, not much to explain here.
- `-r` or `--recursive` will copy directories recursively, which will include all sub-directories (and sub-directories within sub-directories) and all files within them.
- `-v` or `--verbose` displays information on the files being transferred, without this Rsync will work silently and not display any new information until it is done running.
- `-u` or `--update` will skip any files which exist on the destination and have a modified time that is newer than the source file; replaces existing file at destination if it has same modification time as source file, but different size.
- `-o`, `-g` and `-t` will preserve the owner, group and last modified times respectively of files when transferred to destination.
- `-z` or `--compress` will compress the files being transferred, which can significantly increase transfer speeds, especially when transferring to remote hosts over a network.
- `--progress` will display the progress of files as they are transferred, giving you even more information as Rsync runs.
- `--max-size=100M` prevents files at or over the specified file size (in this case 100MB) from being transferred.

This is just a small sample of the options available, but this set of options is a good base to start using Rsync. If copying important files, especially as backups, it's desirable to pass the flag `-a` for _archive mode_. According to the <a href="hhttps://download.samba.org/pub/rsync/rsync.1#opt--archive" target="_blank">Rsync man page</a>:

```
--archive, -a
archive mode is -rlptgoD (no -A,-X,-U,-N,-H)
```

Therefore using `-a` will automatically include the following:

- `-r`: recurse into directories
- `-l`: copy symlinks
- `-p`: preserve permissions
- `-t`: preserve modification times
- `-g`: preserve preserve group
- `-o`: preserve owner
- `-D`: preserve device files & special files

As explained by the rsync man page, archive mode does not include other flags, these can be important and might want to consider using them (in addition to archive mode) when backing up important system files:

- `-A`: preserve access control lists (ACLs)
- `-X`: preserve extended attributes
- `-U`: preserve access times
- `-N`: preserve create times
- `-H`: preserve hard links

Therefore, to backup important files with Rsync, like for example a `/home` directory to another machine, we should use this:

```bash
rsync -azAXUNH --progress /home/Monica Chandler@192.168.1.19:/mnt/storage/backups
```

## Using RSync with Cron

Rsync makes a decent automatic backup solution by using a cronjob and passing Rysnc the `--daemon` flag to schedule recurring background transfers during off-hours.

First use the following command:

```bash
crontab -e
```

This will open the `crontab` file in your default text editor. For this example, Monica wants to use Rsync to back up the contents her home directory (`/home/Monica`) which includes her entire media library to another directory located at `/mnt/backup`, and she wants this to happen automatically every Saturday at 3:00AM, so the transfer happens when no one is using the Workstation. She'll have to put this into the crontab just below the commented text:

```bash
0 3 * * SAT rsync -aq --daemon /home/Monica /mnt/backup/*
```

The Rsync stuff first. Besides using `--daemon` to run Rsync as a background process, we're using `-a` for archive mode and `-q` to suppress most information during transfer (the opposite of `-v`).

Now for the Cron stuff, the `0 3 * * SAT` before rsync is a schedule expression. You schedule cron jobs by expressing the timing in five fields, from left to right they are: _minute_ (0 - 60), _hour_ (0 - 23), _day of the month_ (1 - 31), _month_ (1 - 12), and _day of the week_. In my example above, `0 3 * * SAT` means it will run _every Saturday at 3:00 AM_.

If you think you'll have a hard time remembering the scheduling expressions, just know that I am right there with you, which is why I use a handy tool called <ato href="https://crontab.guru" target="_blank" rel="noopener noreferrer">Crontab Guru</ato schedule cron. To make Rsync a little less daunting to use, check out <a href="https://www.rsyncinator.app/web" target="_blank" rel="noopener noreferrer">Rsyncinator</a>, which has a slick GUI that lets you create your Rsync command with checkboxes and fields specifying what they do.

Finally, for a list of ALL the rsync options with short descriptions of what they do, check out the <a href="https://download.samba.org/pub/rsync/rsync.1" target="_blank">Rsync man page</a>, a truly exhaustive manual for understanding all the granular details of Rsync.

## References

- <a href="https://www.rsyncinator.app/web" target="_blank" rel="noopener noreferrer">Rsyncinator</a>
- <a href="https://crontab.guru" target="_blank" rel="noopener noreferrer">Crontab Guru</a>
- <a href="https://download.samba.org/pub/rsync/rsync.1" target="_blank">Rsync Man Page</a>
- <a href="https://man7.org/linux/man-pages/man8/cron.8.html" target="_blank">Cron Man Page</a>
- <a href="https://man7.org/linux/man-pages/man5/crontab.5.html" target="_blank">Crontab Man Page</a>