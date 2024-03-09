---
title: "Set up NFS Shares between Linux hosts"
description: "Network File Share or NFS allows sharing directories between Linux hosts on the same network, similar to Samba though it has better performance with small and medium-sized files comparatively. Here's a quick guide on setting up an NFS share between Linux hosts."
pubDate: 2022-10-29
tags:
  - NFS
  - Linux
  - Command Line
---

## Table of Contents

1. [Set up the NFS server](#server)
2. [Set up the NFS client](#client)
3. [Add the NFS share to fstab](#fstab)
4. [References](#ref)

<div id='server'/>

## Set up the NFS server

Install the NFS server package and all dependencies on the Linux host that will be the NFS server, sharing one of it's directories over the network:

```bash
# Debian & Ubuntu
sudo apt install nfs-kernel-server -y

# Fedora & CentOS
sudo yum -y install nfs-utils
```

We will share the `media` folder from the `home` directory of user `ross`. Create/edit a config file at `/etc/exports` and add these settings:

```bash
/home/ross/media *(rw,no_subtree_check)
```

Explanation:

- `/home/ross/media` is the directory to be shared by the NFS server. (Obviously, set this to whatever you want.)
- `*` makes the share accessible by ALL clients on the network, you can also specify an IP address or multiple IPs separated by space after the parenthesis. (See below for example.)
- `rw` enables clients to both read and write> Without this NFS defaults to read-only, so be sure to specify it.
- `no_subtree_check` makes NFS not check if each subdirectory is accessible to the user which may slightly improve reliability, but slightly reduce security. <a href="https://linux.die.net/man/5/exports#no_subtree_check:~:text=no_subtree_check,change%20is%20pending." target="_blank">See here for details.</a>

You can alternately make the share accessible only to one or a few specific IPs, and specify different rules for each, for example:

```bash
/home/ross/media 192.168.1.201(rw) 192.168.1.202(rw) 192.168.1.203
```

Using the above settings, only 3 specific clients are allowed, the first two clients can read and write, but the third is read-only. (Since we did not specify `rw`.)

After editing `/etc/exports` and saving the file, use the following commands to apply the new settings and restart the NFS server:

```bash
sudo exportfs -a
sudo systemctl restart nfs-server
```

<div id='client'/>

## Set up the NFS client

Install the NFS client package and all dependencies on a Linux host you want to allow to access the NFS server share:

<div class="note">
  <span>
    <img src="/assets/note.svg" class="note-icon" alt="Note" loading="lazy" decoding="async" />
    <b>Note</b>
  </span>
  <p>
    If you're using <em>Fedora</em> or <em>CentOS</em>, you don't need to install a separate package, since both server and client packages are combined within <code>nfs-utils</code>.
  </p>
</div>

```bash
# Debian & Ubuntu only
sudo apt install nfs-common -y
```

To access the NFS share, it has to be mounted to a local directory. We'll mount it to `/mnt/share`. Create the directory you will mount the NFS share to:

```bash
cd /mnt
mkdir share
```

Now mount the share:

```bash
sudo mount -t nfs 192.168.1.100:/home/ross/share /mnt/share
```

`mount -t nfs` specifies the directory being mounted is an NFS share from another host, `192.168.1.100:/home/ross/share` is the IP address of the server (can also use hostname) and the path of the shared directory, and `/mnt/share` is the local directory to mount the network share to.

<div id='fstab'/>

## Add the NFS share to fstab

To have Linux auto-mount the share at boot, edit the _fstab_ file with `sudo nano /etc/fstab` and add the following to the bottom:

```bash
192.168.1.100:/home/ross/media /mnt/share nfs defaults 0 0
```

<div id='ref'/>

## References

- <a href="https://man7.org/linux/man-pages/man5/exports.5.html" target="_blank">Exports man page</a>
- <a href="https://cloud.netapp.com/blog/azure-anf-blg-linux-nfs-server-how-to-set-up-server-and-client" target="_blank">How to setup NFS server and client by Netapp Blog</a>
- <a href="https://www.golinuxcloud.com/nfs-exports-options-examples" target="_blank">Practical NFS share examples by OnLinuxCloud</a>
