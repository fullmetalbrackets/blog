---
title: "Transferring files between hosts with SCP"
description: "Using the Secure Copy (SCP) utility in Linux lets you securely copy files to and from remote hosts, and it's very easy to use."
pubDate: 2022-09-26
tags:
  - command line
---

## Sections

1. [Introduction](#intro)
2. [SCP Command Syntax](#syntax)
3. [SCP Options](#options)
4. [Copying files and directories to a remote host](#remote)
5. [Copying from a remote host to a local machine](#local)
6. [Transferring files between two remote hosts](#transfer)
7. [References](#ref)

<div id='intro'/>

## Introduction

Secure Copy is a command line utility that transfers files between the local host and a remote host via the SSH protocol. You will be prompted for the remote user's password, or you can use an <a href="/blog/generating-an-ssh-key-pair/" target="_blank">authorized SSH key</a>.

<div id='syntax'/>

## SCP Command Syntax

```bash
scp -OPTION user@SourceIP:file.txt user@DestinationIP:file.txt
```

<div id='options'/>

## SCP Options

- `-r`: Recursively copy entire directories, also follows symbolic links
- `-P`: Specifies an SSH port on destination host, use if destination uses SSH port other than 22
- `-p`: Copied files keep modification times, access times, permissions and modes
- `-v`: Verbose mode; prints additional debugging messages about transfer progress
- `-q`: Quiet mode; disables the progress bar and warning/diagnostic messages
- `-C`: Compresses sent data for faster transfer speeds

<div id='remote'/>

## Copying files and directories to a remote host

Copy a file from local host to a remote host:

```bash
scp file.txt remote-user@192.168.1.10:/directory
```

If preferred, use hostnames instead of IP addresses:

```bash
scp file.txt remote-user@hostname:/directory
```

You can also copy a file with a different name at the destination:

```bash
scp file.txt remote-user@192.168.1.10:/directory/newfilename.txt
```

If the remote host uses a port besides the default 22 for SSH, specify it with the <em>-P</em> option:

```bash
scp -P 2222 file.txt remote-user@192.168.1.10:/directory
```

<br>
To copy a directory, you'll need to do so recursively with the <em>-r</em> option:

```bash
scp -r /directory remote-user@192.168.1.10:/directory
```

<div id='local'/>

## Copying from a remote host to the local machine

To copy from the local host rather than to it, put the remote host's info first and the local host info after:

```bash
scp remote-user@192.168.1.10:/directory/file.txt /local-directory
```

<div id='transfer'/>

## Transfer files between two remote hosts

With **SCP** its even possible to transfer between two other systems, as long as your local machine has access to both via SSH or password.

```bash
scp user@192.168.0.10:/directory/file.txt user@192.168.0.12:/directory/file.txt
```

<div id='ref'/>

## References

- <a href="https://linux.die.net/man/1/scp" target="_blank">SSH Man Page</a>
- <a href="https://www.ssh.com/academy/ssh/scp" target="_blank">SSH Academy</a>
