---
title: "Samba configuration"
description: "Working copy of the current smb.conf file being used on home server."
pubDate: 2024-02-04
tags:
  - Homelab
  - SMB
---

# SMB configuration file

This is the current working Samba configuration file for [Korben](./korben) with shares for each hard drive, except the boot drive. The file is located at: `/etc/samba/smb.conf`

```yaml
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
   path = /home/ariel/media
   browseable = yes
   writeable = yes
   read only = no
   force user = ariel
   force group = ariel
   force create mode = 0666
   force directory mode = 0777

[other]
   comment = Other Share
   path = /home/ariel/other
   browseable = yes
   writeable = yes
   read only = no
   force user = ariel
   force group = ariel
   force create mode = 0666
   force directory mode = 0777

[extra]
   comment = Extra Share
   path = /home/ariel/extra
   browseable = yes
   writeable = yes
   read only = no
   force user = ariel
   force group = ariel
   force create mode = 0666
   force directory mode = 0777
```
