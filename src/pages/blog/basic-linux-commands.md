---
layout: "../../layouts/BlogPost.astro"
title: "Linux Commands Cheat Sheet"
description: "Just a quick cheat sheet of basic and slightly less basic Linux commands that I used when I was totally new to Linux, and have updated recently for my wife to use while she learns."
pubDate: "September 18, 2022"
tags:
  - Linux
  - Command Line
---

## Commands

- `ls`: list contents of directory
- `cat`: print contents of file onto terminal
- `cd`: change present working directory
- `mkdir`: create new directory, multiple directories separated by spaces
- `touch`: create new file(s)
- `cp`: copy a file
- `mv`: move a file, also the way to rename files
- `rm`: delete files(s)
- `rm -rf`: delete recursively, necessary for deleting directories and all contents in them
- `whoami`: show current user
- `reboot`: reboots the machine
- `shutdown`: shuts down the machine
- `sudo`: superuser/admin command to include before other commands that require administrator privileges

## Basic Usage

List files in a directory:

```bash
ls ~/home/bob/directory
```

Change present working directory:

```bash
cd ~/home/bob/other-directory
```

Create a new directory:

```bash
mkdir ~/home/bob/new-directory
mkdir new-directory
```

Create new (empty) files:

```bash
touch index.html about.html folder/file.html
```

Copy a file to different directory:

```bash
cp file.html ~/home/bob/directory/file.html
```

Move (or rename) a file:

```bash
mv file.html new-file-name.html
mv file.html ~/home/bob/directory/file.html
mv file.html ~/home/bob/directory/new-file-name.html
```

Delete a directory and it's contents:

```bash
rm -rf ~/home/bob/directory
```

## Advanced Commands & Usage

Using sudo:

```bash
sudo reboot
sudo shutdown
sudo adduser mary
```

Add new user (must be done by root or existing sudo user):

```bash
sudo adduser mary
```

Give a user sudo powers (must be done by root or existing sudo user):

```bash
usermod -aG sudo mary
```

Change users:

```bash
su - mary
su - bob
```

Change to root user:

```bash
su -i
```

Generate a basic SSH key pair:

```bash
ssh-keygen
```

## References

- <a href="https://ss64.com/bash" target="_blank">An A-Z Index of the Linux command line</a>
