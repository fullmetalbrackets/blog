---
title: "Samba configuration"
description: "Working copy of the current smb.conf file being used on home server."
pubDate: 2024-02-04
updatedDate: 2025-02-10
tags:
  - config
---

# SMB configuration file

This is the current working Samba configuration file for <a href="/wiki/athena/" target="_blank" data-umami-event="wiki-smb-config-to-athena">this blog post</a> with shares for each hard drive, except the boot drive. The file is located at: `/etc/samba/smb.conf`

```bash
[global]
   workgroup = WORKGROUP
   server string = Samba %v %h
   netbios name = korben
   security = user

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

[media]
   comment = Media Share
   path = /home/ad/media
   browseable = yes
   writeable = yes
   read only = no
   force user = ad
   force group = ad
   force create mode = 0666
   force directory mode = 0777

[other]
   comment = Other Share
   path = /home/ad/other
   browseable = yes
   writeable = yes
   read only = no
   force user = ad
   force group = ad
   force create mode = 0666
   force directory mode = 0777
```

Below is for sharing home directory on other machines.

```bash
[home]
   comment = Home Directory
   path = /home/ad
   read only = no
   writeable = yes
   browseable = yes
   force user = ad
   force create mode = 666
   force directory mode = 755
```