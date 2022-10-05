---
layout: "../../layouts/BlogPost.astro"
title: "Transferring files between hosts with SCP"
description: "Using the Secure Copy (SCP) utility in Linux lets you securely copy files to and from remote hosts, and it's very easy to use."
pubDate: "September 26, 2022"
tags:
  - SCP
  - Linux
  - Command Line
---

## Sections

1. [SCP Command Syntax](#syntax)
2. [SCP Options](#options)
3. [Copying files and directories to a remote host](#remote)
4. [Copying from a remote host to a local machine](#local)
5. [Transferring files between two remote hosts](#transfer)
6. [References](#ref)

<div id='syntax'/>

Secure Copy is a command line utility that transfers files between the local host and a remote host via the SSH protocol. You will be prompted for the remote user's password, or you can use an <a href="https://arieldiaz.codes/blog/generating-an-ssh-key-pair" target="_blank">authorized SSH key</a>.

## SCP Command Syntax

```bash
scp -OPTION user@Source:file1 user@Destination:file2
```

<div id='options'/>

## SCP Options

- `-r`: Recursively copy directories (copy directory contents and sub-directories and their content)
- `-P`: Specifies an SSH port on destination host, use if destination uses SSH port other than 22
- `-p`: Copied files keep modification and access times
- `-q`: Quiets the progress bar and other messages
- `-c`: Compresses sent data for faster transfer speeds

<div id='remote'/>

## Copying files and directories to a remote host

Copy a file from local host to a remote host:

```bash
scp file.txt remote-user@192.168.1.10:/directory
```

<br>
If preferred, use hostnames instead of IP addresses:

```bash
scp file.txt remote-user@hostname:/directory
```

<br>
You can also copy a file with a different name at the destination:

```bash
scp file.txt remote-user@192.168.1.10:/directory/newfilename.txt
```

<br>
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
