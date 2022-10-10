---
layout: "../../layouts/BlogPost.astro"
title: "Linux Commands Cheat Sheet"
description: "Just a quick cheat sheet of basic and slightly less basic Linux commands that I used when I was totally new to Linux, and have updated recently for my wife to use while she learns."
pubDate: "September 18, 2022"
tags:
  - Linux
  - Command Line
---

## Sections

1. [Commands](#cmd)
2. [Basic Usage](#basic)
3. [Advanced Commands & Usage](#adv)
4. [Reference](#ref)

<div id='cmd'/>

## Commands

| Command    | Effect                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------- |
| `ls`       | list contents of directory                                                                     |
| `cat`      | print contents of file onto terminal                                                           |
| `cd`       | change present working directory                                                               |
| `mkdir`    | create new directory, multiple directories separated by spaces                                 |
| `touch`    | create new file(s)                                                                             |
| `cp`       | copy a file                                                                                    |
| `mv`       | move a file, also the way to rename files                                                      |
| `rm`       | delete files(s)                                                                                |
| `rm -rf`   | delete recursively, necessary for deleting directories and all contents in them                |
| `whoami`   | show current user                                                                              |
| `reboot`   | reboots the machine                                                                            |
| `shutdown` | shuts down the machine                                                                         |
| `sudo`     | superuser/admin command to include before other commands that require administrator privileges |

<div id='basic'/>

## Basic Usage

| Command                           | Effect                                       |
| --------------------------------- | -------------------------------------------- |
| `ls /path/to/directory`           | list files in a directory                    |
| `cd /path/to/other-directory`     | change present working directory             |
| `mkdir new-directory`             | create a new directory                       |
| `touch filename`                  | create new files, can specify file extension |
| `cp file /path/to/directory/file` | copy a file to different directory           |
| `mv file /path/to/new-filename`   | move (or rename) a file                      |
| `rm -rf /path/to/directory`       | delete a directory and it's contents         |

<div id='adv'/>

## Advanced Commands & Usage

| Command                 | Effect                                                      |
| ----------------------- | ----------------------------------------------------------- |
| `sudo adduser mary`     | add new user (must be done by root or superuser)            |
| `usermod -aG sudo mary` | give a user sudo powers (must be done by root or superuser) |
| `su mary`               | switch to user (keep current environment variables)         |
| `su - mary`             | switch to user (new environment when using `-`)             |
| `sudo su mary passwd`   | change user password (must use with `sudo`)                 |
| `ssh-keygen`            | generate a basic SSH key pair                               |

<div id='ref'/>

## Reference

- <a href="https://ss64.com/bash" target="_blank" rel="noopener noreferrer">An A-Z Index of the Linux command line</a>
