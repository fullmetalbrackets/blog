---
title: "OpenMediaVault Quick Reference"
description: "I've been using OpenMediaVault 6 for over a year now, and it's user interface can be a bit obtuse, so I wrote myself a series of quick step-by-step guides for enabling certain features within the OMV workbench UI."
pubDate: 2023-07-30
tags:
  - OpenMediaVault
  - Self-Hosting
  - Linux
---

## Sections

1. [Change the port for OMV workbench](#port)
2. [Mount disks in OMV](#mount)
3. [Sharing folders via SMB](#smb)
4. [Sharing folders via NFS](#nfs)
5. [Enable Wake-on-Lan](#wol)
6. [Set a static IP address](#static)
7. [Create a new user account](#user)
8. [Reference](#ref)

<div id='port' />

## Change the port for OMV workbench

To change the port in the workbench UI:

1. Go to _System_ -> _Workbench_
2. Under _Port_ enter the desired port number
3. Click the _Save button_ and confirm the _pending configuration changes_ by clicking the _checkmark_.

Alternately, you can change the port in the _terminal_:

1. Login to the OMV shell as `root`
2. Use the command `omv-firstaid`
3. In the pop-up, choose option `3   Configure workbench`
4. Hit <kbd>Enter</kbd> to continue
5. Type the desired `port to access the workbench via HTTP`
6. Hit <kbd>Enter</kbd> to finish

<div id='mount' />

## Mount disks in OMV

1. Go to _Storage_ -> _File Systems_
2. To create a mount, click the _plus (+)_ and choose a _file system_ from the dropdown (e.g. `ext4`)
3. On the following page choose a _Device_ from the dropdown
4. Click the _Save button_ and confirm the _pending configuration changes_ by clicking the _checkmark_
5. Go to _Storage_ -> _Shared Folders_, and click the _plus (+)_
6. Write a _name_, select a mounted _file system_, and the _relative path_ of the file system to share (e.g. `/`).
7. Leave the _permissions_ as is or change if desired
8. Click the _Save button_ and confirm the _pending configuration changes_ by clicking the _checkmark_

<div id='smb' />

## Share folders via SMB

1. Go to _Services_ -> _SMB/CIFS_ -> _Settings_
2. Make sure _Enabled_ is checkmarked, write in your _Workgroup_ name, then click the _Save button_
3. Go to _Services_ -> _SMB/CIFS_ -> _Shares_, and click the _plus (+)_
4. Add a checkmark to _Enabled_, select a _shared folder_ (created at Storage -> Shared Folders), and choose your options
5. (Optional) Add other SMB options that would appear in a `smb.conf` file at the bottom, under _Extra options_
6. When done, click the _Save button_ and confirm the _pending configuration changes_ by clicking the _checkmark_.

<div id='nfs' />

## Share folders via NFS

1. Go to _Services_ -> _NFS_ -> _Settings_
2. Make sure _Enabled_ is checkmarked. To avoid any potential errors, click on _Versions_ and make sure all the versions are checked, then click the _Save button_.
3. Go to _Services_ -> _NFS_ -> _Shares_, and click the _plus (+)_
4. Select a _shared folder_ (created at Storage -> Shared Folders) and type in at least one _Client_ IP address (who will have access to this share). Choose the _Permission_ and leave the _Extra options_ as is.
5. Click the _Save button_ and confirm the _pending configuration changes_ by clicking the _checkmark_.

<div id='wol' />

## Enable Wake-on-Lan

1. Go to _Network_ -> _Interfaces_.
2. Click on your interface (e.g. `enp2s0`) to highlight it, then click on the _Pencil_ icon to _edit_ the interface
3. Scroll down to _Advanced settings_ and check the box for _Wake-on-Lan_
4. Click the _Save button_ and confirm the _pending configuration changes_ by clicking the _checkmark_.

<div class="info">
  <span>
    <img src="/img/assets/info.svg" class="info-icon">
    <b>Information</b>
  </span>
  <p>
    Make sure to enable <em>Wake-on-Lan</em> within the BIOS too!
  </p>
</div>

<div id='static' />

## Set a static IP address

1. Go to _Network_ -> _Interfaces_
2. Click on your interface (e.g. `enp2s0`) to highlight it, then click on the _Pencil_ icon to _edit_ the interface.
3. Under _IPv4_ choose Method: _Static_
4. Under _Address_ enter the desired static IP address
5. Under _Netmask_ enter 255.255.255.0 (unless you're on a subnet and know what to enter)
6. For _Gateway_ enter your router or DHCP server (e.g. `192.168.1.1`)
7. (Optional) Write in specific _DNS servers_ under _Advanced settings_ if desired
8. Click the _Save button_ and then confirm the _pending configuration changes_ by clicking the _checkmark_

<div id='user' />

## Create a new user account

By default only the `root` user is available, which is fine if you're mostly using the workbench UI. However if you plan to SSH in and don't want to do so as _root_, create a new user account to do so.

1. Go to _Users_ -> _Settings_
2. Checkmark the _Enabled_ box and choose the _Location_ of a shared folder to use for user home directories
3. Next go to _Users_ -> _Users_
4. Click _plus (+)_ then choose to _Create_ a new user account
5. Write in the desired name and password, change the _Shell_ if desired, and add the user to any _Groups_ you'd like. (E.g. `sudo`, `ssh`, etc.)
6. (Optional) Add an _SSH public key_ if desired
7. Click the _Save button_, then confirm the _pending configuration changes_ by clicking the _checkmark_

<div id='ref' />

## Reference

- <a href="https://docs.openmediavault.org/en/stable" target="_blank">OpenMediaVault Documentation</a>
