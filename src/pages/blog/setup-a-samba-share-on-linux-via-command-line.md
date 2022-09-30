---
layout: "../../layouts/BlogPost.astro"
title: "Setup a Samba share on Linux via command line"
description: "A quick and dirty guide on how to easily set up a Samba share on Linux that can be accessed from Windows PCs on the same network."
pubDate: "September 1, 2021"
updatedDate: "September 20, 2022"
tags:
  - Samba
  - Linux
  - Command Line
---

## Table of Contents

1. [Installing Samba](#install)
2. [Configuring Samba](#config)
3. [Accessing the Samba share from Windows](#access)
4. [Improve transfer speeds for Samba](#speed)
5. [References](#ref)

<div id='install'/>

## Installing Samba

Samba usually comes installed with most Linux distributions. If you do need to install it, use the following commands (which will also auto-install dependencies). On Ubuntu and other Debian-based distributions:

```bash
sudo apt install -y samba
```

On Arch Linux and Manjaro distributions, you need to use the following command instead:

```bash
yes | sudo pacman -S samba
```

<div id='config'/>

## Configuring Samba

After installation, you should have a default Samba configuration file in `/etc/samba/` directory called **smb.conf**. First, make a backup copy of `smb.conf` (just in case), then open it in a text editor:

```bash
sudo cp /etc/samba/smb.conf /etc/samba/smd.conf.backup
sudo nano /etc/samba/smb.conf
```

There's a whole lot of text in here, but it's mostly informative/explanatory comments (that you should read). Feel free to delete all the comments and only keep the configuration options. Use the below global and share options:

```yaml
[global]
  workgroup = WORKGROUP
  server string = Samba Server %v
  netbios name = HOSTNAME
  security = user

[public]
  path = /path/to/directory
  force user = user
  browsable = yes
  writable = yes
  read only = no
  create mask = 0777
  force create mode = 0777
  directory mask = 0777
  force directory mode = 0777
```

Please note that <em>these options are not secure</em>, but since this is only accessible by me (and once in a while my wife) I'm not worried about it. **Do not use these settings for a publicly-accessible Samba share!** In fact, don't ever make a Samba share accessible from the internet at all, it's a very bad idea!

Let's explain these options briefly:

- Under `[global]`, the `workgroup =` parameter is important; you'll need to specify a Workgroup to access the share from Windows. The default is most likely <em>WORKGROUP</em> unless you changed it on your Windows PC. Just make sure it's the same for all the machines you want accessing the share.
- `netbios name =` is important, you want this to match your server's <em>hostname</em>.
- `security = user` is the default security mode for Samba and the one most compatible with Windows. You don't really have to specify this since it's the default, but I like to anyway.
- `[public]` will be the name of the share, obviously use whatever name you'd like.
- `path =` will contain the direct path to the directory you want to share.
- `browsable = yes` allows the share to be seen in the list of available network locations from Windows, you can set this to no if you prefer.
- `writable = yes` and `read only = no` allows the directories and files in the share to be created, modified, or deleted from the Windows PC.
- `force user =` should both be set to a specific user that has been added to Samba and given a password. (More on that below.)
- `force create mode = 0777` and `force directory mode = 0777` will give full read/write permissions in the share and all sub-directories. You may have issues creating, deleting and editing files on Linux share from a Windows PC without these. I'm not sure if `create mask = 0777` and `directory mask = 0777` are necessary, but I use them just in case.

When you are done with the `smb.conf` file, save it and quit the editor. Now let's check that the configuration is valid with the following command:

```bash
testparm
```

You'll get some output here that's self-explanatory, one of the lines should say "Loaded services file is OK" meaning your config is good. Next we'll need to add a user to Samba, as you'll need to login from Windows with a username and password. Let's assume we're adding the user <em>bob</em> to Samba so his login is required to access the share from a Windows PC. Use the following command (as root or a superuser) to add the user to Samba, and when prompted choose a password.

```bash
smbpasswd bob
New SMB password:
Retype new SMB password:
```

Next we need to set the ownership and permissions for the directory that is to be shared. Personally, again keeping in mind security isn't at the top of my mind here, I just set the user to <em>nobody</em> and group to <em>nogroup</em>, you can also set them to the same user and group that you're logging in as, but sometimes Windows gives me issues with that. So I just go with simplicity.

```bash
sudo chown -R nobody /path/to/share
sudo chgrp -R nogroup /path/to/share
sudo chmod -R 0777 /path/to/share
```

Finally, start the services needed and enable them to auto-run at boot -- `smbd` (the Samba daemon) and `nmbd` (NetBIOs daemon, it should have been installed along with Samba).

On Ubuntu/Debian, use these commands:

```bash
sudo systemctl start smbd nmbd
sudo systemctl enable smbd nmbd
```

On Arch/Manjaro, use these commands instead (notice neither service has the trailing <em>d</em>):

```bash
sudo systemctl start smb nmb
sudo systemctl enable smb nmb
```

Now you should be able to connect to the shared directory from other computers on your network!

<div id='access'/>

## Accessing the Samba share from Windows

On Windows, go to Start Menu > Run and type the following (replacing with your Linux machine's actual IP) and hit Enter:

[![Screenshot of Windows Run](/img/samba1.png)](https://arieldiaz.codes/img/samba1.png)

Or you can connect by hostname rather than IP.

[![Screenshot of Windows Run](/img/samba1.png)](https://arieldiaz.codes/img/samba2.png)

You should now have the shared folder open in your Windows PC! For ease of access, pin it to Quick Access or map it as a Network Drive.

However, there MAY be an additional issue, as Windows 10 Home (but not Professional) apparently does not have the Local Security Policy settings (secpol.msc) that is required to interface with Samba. I can't confirm this myself since I use Windows 10 Professional, but if you have issues and Windows complains about secpol.msc, [go here for detailed instructions](https://www.majorgeeks.com/content/page/how_to_enable_local_security_policy_in_windows_10_home.html) on how to fix this issue.

<div id='speed'/>

## Improve transfer speeds for Samba

After transferring files back and forth between Windows and Linux via the Samba share, you may notice it's extremely slow! After some googling I found some additional configuration options <a href="https://eggplant.pro/blog/faster-samba-smb-cifs-share-performance" target="_blank" rel="noopener">on someone's blog</a> that claimed to improve network performance, and in my experience it works.

Add the following code (feel free to remove all the comments) to your <em>smb.conf</em> file under `[global]`.

```bash
[global]
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
```

For an explanation of what these options do, check the original blog post linked above, the original code includes detailed comments for each option.

<div id='ref'/>

## References

- <a href="https://www.samba.org/samba/docs" target="_blank" rel="noopener">Samba Documentation</a>
- <a href="https://eggplant.pro/blog/faster-samba-smb-cifs-share-performance" target="_blank" rel="noopener">Eggplant Systems & Design blog post about improving Samba share performance</a>
