---
layout: "../../layouts/BlogPost.astro"
title: "Setup a Samba share on Linux via command line"
description: "Rather than mess with a dedicated NAS operating system like OpenMediaVault or TrueNAS, I prefer the simplicity creating Samba shares on Linux to use as network storage accessible from Windows PCs on my home network. Here is the minimal Samba config to do that."
pubDate: "September 1, 2021"
tags:
  - linux
  - terminal
---

Rather than mess with a dedicated NAS operating system like OpenMediaVault or TrueNAS, I prefer the simplicity creating Samba shares on Linux to use as network storage accessible from Windows PCs on my home network. Here is the minimal Samba config to do that.

Samba usually comes installed with most Linux distributions. If you do need to install it, use the following commands (which will also auto-install dependencies). On Ubuntu and other Debian-based distributions:

```bash
sudo apt install -y samba
```

On Arch Linux and Manjaro distributions, you need to use the following command instead:

```bash
yes | sudo pacman -S samba
```

After installation, you should have a default Samba configuration file in `/etc/samba/` directory called **smb.conf**. First, make a backup copy of `smb.conf` (just in case), then open it in a text editor:

```bash
sudo cp /etc/samba/smb.conf /etc/samba/smd.conf.backup
sudo nano /etc/samba/smb.conf
```

There's a whole lot of text in here and it may be intimidating to first time users. Feel free to delete everything (it's mostly informative/explanatory comments that you should read, but probably won't) and only keep the below, which is all you really need in `smb.conf` to make it work:

```yaml
[global]
  workgroup = WORKGROUP
  server string = Samba Server %v
  netbios name = HOSTNAME
  security = user

[public]
  path = /path/to/directory
  browsable = yes
  writable = yes
  read only = no
  guest ok = yes
  create mask = 0777
  directory mask = 0777
  force user = nobody
  force group = nogroup
```

Let's explain these parameters briefly:

- Under `[global]`, the `workgroup =` parameter is important; you'll need to specify a Workgroup to access the share from Windows. The default is most likely **WORKGROUP** unless you changed it on your Windows PC. Just make sure it's the same for all the machines you want accessing the share.
- `netbios name =` is important, you want this to match your server's **hostname**.
- `security = user` is the default security mode for Samba and the one most compatible with Windows. You don't really have to specify this since it's the default, but I like to anyway.
- `[public]` within brackets sets the share's name to "**public**."
- `path =` will contain the direct path to the directory you want to share.
- `browsable = yes` allows the share to be accessible from Windows PCs.
- `writable = yes` and `read only = no` allows the directories and files in the share to be created, modified, or deleted from other computers that access it.
- `create mask = 0777` and `directory mask = 0777` gives the share and all it's directories/sub-directories full read/write/execute permissions.
- `force user = nobody` and `force group = nogroup` ensures any Windows PC accessing the share can do so with without having to login or enter a password.

Please note that the above is a minimal and **very unsecure** config that should only be used if the Linux machine doing the sharing is secure behind a firewall and only accessible within your network. **Do not use these settings for a publicly-accessible Samba share!**

When you are done with the `smb.conf` file, save it and quit the editor. Now let's check that the configuration is valid with the following command:

```bash
testparm
```

You'll get some output here that's self-explanatory, one of the lines should say "Loaded services file is OK" meaning your config is good. Next we need to create the share, give it the right owner and group, the correct permissions, and do so recursively (so it also affects sub-directories). Assuming we're doing it within the present working directory:

```bash
mkdir share
sudo chown -R nobody share
sudo chgrp -R nogroup share
sudo chmod -R 0777 share
```

Now to start up the services needed and enable them to auto-run at boot -- `smbd` (the Samba daemon) and `nmbd` (NetBIOs daemon, it should have been installed along with Samba). The commands for Ubuntu/Debian are:

```bash
sudo systemctl start smbd nmbd
sudo systemctl enable smbd nmbd
```

For Arch/Manjaro, use these commands instead (notice that neither service has the trailing **d**):

```bash
sudo systemctl start smb nmb
sudo systemctl enable smb nmb
```

Now you should be able to connect to the shared directory from other computers on your network! On Windows, go to Start Menu > Run and type the following (replacing with your Linux machine's actual IP) and hit Enter:

[![Screenshot of Windows Run](/img/samba1.png)](https://arieldiaz.codes/img/samba1.png)

Or you can connect by hostname rather than IP.

[![Screenshot of Windows Run](/img/samba1.png)](https://arieldiaz.codes/img/samba2.png)

You should now have the shared folder open in your Windows PC! For permanence, pin it to Quick Access or map it as a Network Drive.

However, there MAY be an additional issue, as Windows 10 Home (but not Professional) apparently does not have the Local Security Policy settings (secpol.msc) that is required to interface with Samba. I can't confirm this myself since I use Windows 10 Professional, but if you have issues and Windows complains about secpol.msc, [go here for detailed instructions](https://www.majorgeeks.com/content/page/how_to_enable_local_security_policy_in_windows_10_home.html) on how to fix this issue.

## References

- <a href="https://www.samba.org/samba/docs" target="_blank" rel="noopener">Samba Documentation</a>
