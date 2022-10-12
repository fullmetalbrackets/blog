---
layout: "../../layouts/BlogPost.astro"
title: "Linux Commands Cheat Sheet"
description: "Just a quick cheat sheet of basic and slightly less basic Linux commands that I used when I was totally new to Linux, and have updated recently for my wife to use while she learns."
pubDate: "September 18, 2022"
updatedDate: "October 12, 2022"
tags:
  - Linux
  - Command Line
---

## Sections

1. [Commands](#cmd)
2. [Basic Usage Examples](#basic)
3. [Advanced Commands & Usage](#adv)
4. [Handy Keyboard Shortcuts](#shortcuts)
5. [Reference](#ref)

<div id='cmd'/>

## Commands

| Command    | Effect                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------- |
| `ls`       | list contents of directory (use `-a` to show hidden files, `-l` to show in long list format) |
| `cat`      | print contents of file onto terminal                                                         |
| `cd`       | change present working directory                                                             |
| `cd ..`    | move back one directory (e.g. from `/var/lib/docker` to `/var/lib`)                          |
| `cd ~`     | go to user directory (`/home/user`)                                                          |
| `mkdir`    | create new directory, multiple directories separated by spaces                               |
| `touch`    | create new file(s)                                                                           |
| `cp`       | copy a file                                                                                  |
| `mv`       | move a file, also the way to rename files                                                    |
| `rm`       | delete files(s)                                                                              |
| `rm -rf`   | delete recursively, necessary for deleting directories and all contents in them              |
| `!!`       | repeat last command                                                                          |
| `date`     | shows system date                                                                            |
| `uptime`   | show system uptime                                                                           |
| `whoami`   | show current user                                                                            |
| `which`    | shows path of a command, if present (ex. `which nano` shows path of `nano`                   |
| `history`  | shows history of commands used, numbered in order                                            |
| `&&`       | append between commands to run them in order (e.g. `apt update && apt upgrade`)              |
| `reboot`   | reboots the machine (may require `sudo`)                                                     |
| `shutdown` | shuts down the machine (may require `sudo`)                                                  |
| `sudo`     | append prior to a command to use with elevated privileges (e.g. `sudo shutdown`)             |

<div id='basic'/>

## Basic Usage Examples

| Command                           | Effect                                         |
| --------------------------------- | ---------------------------------------------- |
| `ls /path/to/directory`           | list files in a directory                      |
| `cd /path/to/other-directory`     | change present working directory               |
| `mkdir new-directory`             | create a new directory                         |
| `touch filename`                  | create new files, can specify file extension   |
| `cp file /path/to/directory/file` | copy a file to another directory               |
| `mv file /path/to/new-filename`   | move (or rename) a file, leaves no copy behind |
| `rm -rf /path/to/directory`       | delete a directory and it's contents           |

<div id='adv'/>

## Advanced Commands & Usage

| Command                 | Effect                                                        |
| ----------------------- | ------------------------------------------------------------- |
| `sadduser mary`         | add new user (must be done by root or with `sudo`)            |
| `usermod -aG sudo mary` | give a user sudo powers (must be done by root or with `sudo`) |
| `su mary`               | switch to user (keep current environment variables)           |
| `su - mary`             | switch to user (new environment when using `-`)               |
| `su mary passwd`        | change user password (must be done by root or with `sudo`)    |
| `ssh-keygen`            | generate a basic SSH key pair                                 |

<div id='shortcuts'/>

## Handy Keyboard Shortcuts

| Key Combination                | Effect                             |
| ------------------------------ | ---------------------------------- |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | interupt/terminate current process |
| <kbd>Ctrl</kbd> + <kbd>A</kbd> | go to start of line                |
| <kbd>Ctrl</kbd> + <kbd>E</kbd> | go to end of line                  |
| <kbd>Ctrl</kbd> + <kbd>U</kbd> | delete entire line                 |

<div id='ref'/>

## Reference

- <a href="https://ss64.com/bash" target="_blank" rel="noopener noreferrer">An A-Z Index of the Linux command line</a>
