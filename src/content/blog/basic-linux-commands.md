---
title: "Linux Commands & Keyboard Shortcuts Cheat Sheet"
description: "Just a quick cheat sheet of basic and slightly less basic Linux commands, as well as handy keyboard shortcuts, that I maintain for myself since I can't always remember them all."
pubDate: 2022-09-18
updatedDate: 2025-02-17
tags:
  - command line
---

## Common Commands

| Command      | Effect                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------- |
| `man`        | open "manual page" for specified command/utility (e.g. `man ls` opens ls command's man page) |
| `clear`      | clears the terminal screen                                                                   |
| `ls`         | list contents of directory (use `-a` to show hidden files, `-l` to show in long list format) |
| `cd`         | change present working directory (`cd ..` to move back one directory)                        |
| `mkdir`      | create new directory, multiple directories separated by spaces                               |
| `touch`      | create new file(s)                                                                           |
| `cp`         | copy a file                                                                                  |
| `mv`         | move a file, also the way to rename files                                                    |
| `rm`         | delete files(s)                                                                              |
| `rm -rf`     | delete recursively, necessary for deleting directories and all contents in them              |
| `du`         | output sizes of files within a directory recursively (use `-m` for MiB or `-g` for GiB)      |
| `cat`        | output all lines of a file onto terminal                                                     |
| `head`       | outputs first 10 lines of a file (use `-n` followed by a number to display different amount) |
| `tail`       | outputs last 10 lines of a file (use `-n` followed by a number to display different amount)  |
| `less`       | opens file in its own "page" similar to `man`, rather than outputting to terminal like `cat` |
| `!!`         | repeat last command                                                                          |
| `date`       | output system date                                                                           |
| `uptime`     | output system uptime                                                                         |
| `whoami`     | output current user                                                                          |
| `which`      | output path of a command, if present (e.g. `which nano` shows path of `nano`                 |
| `find`       | search for files/directories matching a particular pattern (see usage examples below)        |
| `history`    | output history of commands used, numbered in order                                           |
| `&&`         | append between commands to run them in order (e.g. `apt update && apt upgrade`)              |
| `df`         | output used and available space on mounted disks in bytes (`-h` to show MiB, GiB, TiB)       |
| `ps`         | output of user-initiated processes and their process IDs                                     |
| `top`        | opens separate page showing real-time information on running processes                       |
| `kill {PID}` | terminate a running process, must specify the PID                                            |
| `reboot`     | reboots the machine (may require `sudo`)                                                     |
| `shutdown`   | shuts down the machine (may require `sudo`)                                                  |
| `sudo`       | append prior to a command to use with elevated privileges (e.g. `sudo shutdown`)             |

## Basic Usage Examples

| Command                           | Effect                                                         |
| --------------------------------- | -------------------------------------------------------------- |
| `ls /path/to/directory`           | list files in a specific directory                             |
| `cd /path/to/other-directory`     | change from current working directory to another               |
| `mkdir new-directory-name`        | create a new directory within current working directory        |
| `touch filename`                  | create new files, can specify file extension                   |
| `cp file /path/to/directory/file` | copy a file to another directory                               |
| `mv file /path/to/new-filename`   | move (or rename) a file, leaves no copy behind                 |
| `rm -rf /path/to/directory`       | delete a directory and it's contents                           |
| `find /etc -name hosts`           | shows any files in `/etc` with `hosts` in filename             |
| `find /etc -type d -name '*.conf` | shows any directories (`d`) in `/etc` with `.conf` in filename |

## Advanced Commands & Usage

| Command                 | Effect                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| `ln file1 file2`        | creates a hard link between files, updates to either file syncs with the other                    |
| `ln -s file1 file2`     | creates a symbolic link between files, but if original is deleted, symlinked file no longer works |
| `sadduser mary`         | add new user (must be done by root or with `sudo`)                                                |
| `usermod -aG sudo mary` | give a user sudo powers (must be done by root or with `sudo`)                                     |
| `su mary`               | switch to user (keep current environment variables)                                               |
| `su - mary`             | switch to user (new environment when using `-`)                                                   |
| `su mary passwd`        | change user password (must be done by root or with `sudo`)                                        |
| `ssh-keygen`            | generate a basic SSH key pair                                                                     |

## Handy Keyboard Shortcuts

| Key Combination                | Effect                             |
| ------------------------------ | ---------------------------------- |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | interrupt/terminate current process |
| <kbd>Ctrl</kbd> + <kbd>A</kbd> | go to start of line                |
| <kbd>Ctrl</kbd> + <kbd>E</kbd> | go to end of line                  |
| <kbd>Ctrl</kbd> + <kbd>U</kbd> | delete entire line                 |

## Reference

- <a href="https://ss64.com/bash" target="_blank" rel="noopener noreferrer">An A-Z Index of the Linux command line</a>

### Related Articles

> [Formatting disks in Linux command line](/blog/formatting-on-linux/)

> [Mounting (either internal or external) hard drives in Linux](/blog/mounting-hard-drives-in-linux/)