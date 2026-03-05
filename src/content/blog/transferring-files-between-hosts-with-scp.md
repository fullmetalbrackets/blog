---
title: 'How to transfer files between hosts with Secure Copy utility (SCP)'
description: "Using the Secure Copy utility in Linux lets you securely transfer files to and from remote hosts via the SSH protocol, it comes with every Linux distribution, and it's very easy to use."
pubDate: 2022-09-26
updatedDate: 2025-03-05
tags: ['linux', 'command line']
related: ['copy-ssh-keys-between-hosts']
---

When using it, you will be prompted for the remote user's password, or you can use an <a href="/blog/generating-an-ssh-key-pair/" target="_blank" data-umami-event="transfer-scp-to-generating-ssh-key-pair">authorized SSH key</a> if you have previously authorized it.

## SCP Command Syntax

```bash
scp -OPTION user@SourceIP:file.txt user@DestinationIP:file.txt
```

When go through the options/flags that you can pass with the command:

- `-r`: Recursively copy entire directories, also follows symbolic links
- `-P`: Specifies an SSH port on destination host, use if destination uses any SSH port other than 22
- `-p`: Copied files keep modification times, access times, permissions and modes
- `-v`: Verbose mode; prints additional debugging messages about transfer progress
- `-q`: Quiet mode; disables the progress bar and warning/diagnostic messages
- `-C`: Compresses sent data for faster transfer speeds (useful for large files)

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

## Copying from a remote host to the local machine

To copy from the local host rather than to it, put the remote host's info first and the local host info after:

```bash
scp remote-user@192.168.1.10:/directory/file.txt /local-directory
```

## Transfer files between two remote hosts

With **SCP** its even possible to transfer between two other systems, as long as your local machine has access to both via SSH or password.

```bash
scp user@192.168.0.10:/directory/file.txt user@192.168.0.12:/directory/file.txt
```

## Alternatively, use Rsync for large transfers

SCP is great for single files, or several small files, but when you're dealing with many files or especially multiple directories with multiple sub-directories and files, a better option is [Rsync](/blog/rsync-a-quick-guide/).

## References

- <a href="https://linux.die.net/man/1/scp" target="_blank" data-umami-event="transfer-scp-ssh-manpage">SSH Man Page</a>
- <a href="https://www.ssh.com/academy/ssh/scp" target="_blank" data-umami-event="transfer-scp-ssh-academy">SSH Academy</a>
