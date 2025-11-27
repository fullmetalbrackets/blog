---
title: "Quick guide to setting up SMB shares"
description: "Setting up SMB shares is fairly easy, but I do it so infrequently I often forget the steps and need to look them up anyway. So I made myself two sets of smb config files for quickly setting up shares, either public or with a login required."
pubDate: 2023-11-01
tags: ["smb", "networking", "linux"]
---

## Why SMB shares?

My personal use case is that my main home server, which doubles as a NAS, is a Linux machine and holds copies of most of my important data -- but I access them from my PC and laptop, both of which use Windows 10. After several years of using SMB at home (and I need to stress this is for home use only and probably completely insecure and/or inadequate for enterprise networks) I have settled on two templates for `smb.conf`, the Samba configuration file. Below are the files.

> This guide assumes Samba is installed and ready to go. If necessary, see <a href="setup-a-samba-share-on-linux-via-command-line" target="_blank">this post about setting up Samba</a>.

## SMB config file for public share

To set up a "public" share available to anyone on the network without a login prompt, I first set up a user with `sudo adduser public` (give it any password, it won't be used anyway) and then give that user's home directory read/write permissions with `sudo chmod ugo+rw /home/public`.

Here is the file contents of my `smb.conf`:

```yaml
[global]
   workgroup = WORKGROUP
   server string = Samba %v %h

   strict allocate = Yes
   allocation roundup size = 4096
   read raw = Yes
   server signing = No
   write raw = Yes
   strict locking = No
   socket options = TCP_NODELAY IPTOS_LOWDELAY SO_RCVBUF=131072 SO_SNDBUF=131072
   min receivefile size = 16384
   use sendfile = Yes
   aio read size = 16384
   aio write size = 16384

[public]
   comment = Public Samba Share
   path = /home/public
   browseable = yes
   writeable = yes
   read only = no
   public = yes
   guest only = yes
   force user = public
   force group = public
   force create mode = 0666
   force directory mode = 0777
```

Always double-check that your config file's syntax is correct with `testparm`. For any changes to the config file to take effect, restart Samba services with `sudo systemctl restart smbd nmbd`.

From Windows, opening **Run** and going to `//hostname/public` (or via IP address if you prefer) should open the folder without prompting for a login. However, any machine on the network can access this share and read/write/delete without limitation.

## SMB config file for private share with login

When requiring a user login, I usually share out a folder in my home directory and give it the right owner and permissions.

```bash
mkdir /home/ariel/share
chown -R ariel /home/ariel/share
chgrp -R ariel /home/ariel/share
chmod -R 660 /home/ariel/share
```

Then add the user to Samba (be sure to use `sudo` or do it as `root`):

```bash
sudo smbpasswd -a ariel
```

Here is the file contents of my `smb.conf`:

```yaml
[global]
   security = user
   workgroup = WORKGROUP
   server string = Samba %v %h
   netbios name = hostname

   log file = /var/log/samba/%m.log
   max log size = 50
   printcap name = /dev/null
   load printers = no

   strict allocate = Yes
   allocation roundup size = 4096
   read raw = Yes
   server signing = No
   write raw = Yes
   strict locking = No
   socket options = TCP_NODELAY IPTOS_LOWDELAY SO_RCVBUF=131072 SO_SNDBUF=131072
   min receivefile size = 16384
   use sendfile = Yes
   aio read size = 16384
   aio write size = 16384

[share]
   comment = Samba Share
   path = /home/ariel/share
   browseable = yes
   writeable = yes
   read only = no
```

As always check the file's syntax `testparm` and restart Samba services with `sudo systemctl smbd nmbd` for the new file parameters to take effect.

From Windows, opening **Run** and going to `//hostname/public` (or via IP) should prompt for a login, with it only accepting the user `ariel` and SMB password you set, after which the folder opens. Only logging in under this user allows writing to the share.

## Reference

- <a href="https://www.samba.org/samba/docs" target="_blank" rel="noopener noreferrer">Samba Documentation</a>
- <a href="https://www.samba.org/samba/docs/current/man-html/smbpasswd.8.html" target="_blank" rel="noopener noreferrer">smbpasswd Manpage</a>

### Related Articles

- <a href="/blog/formatting-on-linux/" data-umami-event="autologin-related-formatting-disks-linux">Formatting disks in Linux command line</a>
- <a href="/blog/mounting-hard-drives-in-linux/" data-umami-event="autologin-related-mounting-hdds-linux">Mounting (either internal or external) hard drives in Linux</a>