---
title: 'How to use Solid Explorer app to access SMB network shares from an Android device'
description: 'There are many File Managers/File Explorers on the Google Play Store, but I wanted to easily access the Samba share on my server while on my home network. Solid Explorer is the solution I went with and it works well, so here is a quick guide to setting it up.'
pubDate: 2022-11-07
updatedDate: 2026-02-27
tags: ['android', 'smb']
related1: xplore-android-smb-share
related2: setup-a-samba-share-on-linux-via-command-line
---

> If you're here in 2026 because accessing SMB shares through Solid Explorer broke at some point, I've added [a fix for this issue here](#smb-fix).

## About Solid Explorer

<a href="https://neatbytes.com/solidexplorer" target="_blank" umami-event-data="solid-explorer-site">Solid Explorer by Neatbytes</a> is a powerful, easy to use file manager for Android devices lets you connect to cloud storage and network folders including (among others) Google Drive, Dropbox, S/FTP, and for our purposes, SMB shares. By connecting an SMB share to Solid Explorer, you can easily interact with server files using a slick GUI and transfer files between server and device. Solid Explorer can be <a href="https://play.google.com/store/apps/details?id=pl.solidexplorer2" target="_blank" umami-event-data="solid-explorer-gplay">downloaded from the Google Play Store for free</a>.

## Prerequisites

This will assume that you already have a Linux server with SMB shares set up, I will only be explaining how to configure Solid Explorer to connect to existing shares.

## Connect Solid Explorer to SMB share

First, make sure you're on the same Wi-Fi network as the SMB share you want to access in Solid Explorer. (Setting this up to be available from outside the home network is possible, but beyond the scope of this article. But <a href="/blog/comprehensive-guide-tailscale-securely-access-home-network/" target="_blank" data-umami-event="solid-explorer-tailscale">this might interest you</a>.)

Open the Solid Explorer app and tap the _hamburger menu_ at the top-left to bring up the menu, then tap the _3-dots_ and choose **Storage manager**.

![Solid Explorer.](../../img/blog/solidexplorer1.jpg 'Solid Explorer')
![Storage manager in Solid Explorer.](../../img/blog/solidexplorer2.jpg 'Network Connection Wizard in Solid Explorer')

In Storage manager, tap the **Plus (+) button** to add a new connection.

![Storage manager in Solid Explorer.](../../img/blog/solidexplorer3.jpg 'Storage manager in Solid Explorer')

In the _Network Connection Wizard_, choose **LAN / SMB** and tap _Next_.

![Network Connection Wizard in Solid Explorer.](../../img/blog/solidexplorer4.jpg 'Network Connection Wizard in Solid Explorer')

You should see any SMB shares in your network under _server details_, choose one and tap **Next**.

![Details in Network Connection Wizard.](../../img/blog/solidexplorer5.jpg 'Details in Network Connection Wizard')

Choose your _authentication_ method and tap **Next**. (I suggest using _Username and password_ unless you have properly configured the SMB share for guest access, otherwise you may experience permissions issues.)

![Authentication in Network Connection Wizard.](../../img/blog/solidexplorer6.jpg 'Authentication in Network Connection Wizard')

If you chose _Username and password_ authentication, you'll be prompted for the login info. Enter it and tap **Next**.

![Login details in Network Connection Wizard.](../../img/blog/solidexplorer7.jpg 'Login details in Network Connection Wizard')

On the next screen, under _Set advanced_, choose **Yes** and tap _Next_.

![Advanced settings in Network Connection Wizard.](../../img/blog/solidexplorer8.jpg 'Advanced settings in Network Connection Wizard')

For _Protocol version_ choose the recommended **SMB 2**, then tap _Next_. On the next screen choose whether to use encryption (if your SMB share is encrypted) and tap _Next_.

![SMB Protocol version in Network Connection Wizard.](../../img/blog/solidexplorer9.jpg 'SMB Protocol version in Network Connection Wizard')

You'll get to review your settings, if everything is correct tap **Next**.

![Review in Network Connection Wizard.](../../img/blog/solidexplorer10.jpg 'Review in Network Connection Wizard')

On the following screen, tap the big **Connect** button.

![Connect button.](../../img/blog/solidexplorer11.jpg 'Connect button')

If everything is properly configured, the button will **turn green with a checkmark**. Tap _Finish_.

![Connection successful.](../../img/blog/solidexplorer12.jpg 'Connection successful')

<div id="smb-fix"/>

> As of 2025 there is an issue where Solid Explorer will not connect to SMB shares (and even shares previously added to Solid Explorer will stop working), but [this comment on the Solid Explorer subeddit](https://www.reddit.com/r/NeatBytes/comments/1pefco3/comment/nsqx5ap/) explains a quick and simple fix.
>
> 1. Edit the Samba configuration file at `/etc/samba/smb.conf`, under the `[global]` section add `netbios disable = yes`, then save the change.
> 2. Stop and disable the Netbios daemon with `sudo systemctl stop nmb && sudo systemctl disable nmb`.
> 3. Restart the Samba daemon with `sudo systemctl restart smb`.
>
> (Note: You may have to use `smbd` and `nmbd` depending on your Linux distro.)
>
> Now when you go through the steps of adding the share in Solid Explorer's storage manager, the scan will not discover your server with SMB shares, but once done you'll see _Didn't find what you're looking for?_ with an **up arrow &uarr; next to it** -- click the arrow and manually add your server details, it should then connect to the SMB share. (If it does not, reboot the SMB server and try again.)

You'll see your server under _Storage manager_. Tap the **back arrow (<-)** to go back to the menu.

![Storage manager showing SMB.](../../img/blog/solidexplorer13.jpg 'Storage manager showing SMB')

You should see the SMB share among the options under _Storages_.

![SMB share available in Storages.](../../img/blog/solidexplorer14.jpg 'SMB share available in Storages')

You're done! Now you can easily access your SMB shares from your Android device with Solid Explorer, and it even has built-in media players, image viewer and text editor.

## Transferring files via Solid Explorer

Transferring files between your Android device and SMB shares is done by using _panes_. If you swipe left and right on your phone or tablet's touchscreen, you'll switch to a different pane, and you can navigate to different directories on each pane. Navigate to an _SMB share_ on one pane, and to one of your device's _internal directories_ on the other pane.

To transfer between device and share, tap a file and hold for a moment to select it. You can tap additional files to select them as well. Then tap on the **three dots (...)** on the bottom menu, then choose _Transfer_ from the options.

![Transferring files in Solid Explorer.](../../img/blog/solidexplorer15.jpg 'Transferring files in Solid Explorer')

A pop-up will show the destination of the file transfer, tap either _Copy to..._ or _Move to..._ (which removes it from the source directory) to begin the transfer.

![Choosing to copy or move files in Solid Explorer.](../../img/blog/solidexplorer16.jpg 'Choosing to copy or move files in Solid Explorer')

You'll see a circlular progress bar on the bottom right, when the transfer is done it turns into a **green checkmark**.

![File transfer in Solid Explorer complete.](../../img/blog/solidexplorer17.jpg 'File transfer in Solid Explorer complete')

## References

- <a href="https://neatbytes.com/solidexplorer" target="_blank" umami-event-data="solid-explorer-site">Solid Explorer website</a>
- <a href="https://play.google.com/store/apps/details?id=pl.solidexplorer2" target="_blank" umami-event-data="solid-explorer-gplay">Download Solid Explorer from Google Play Store</a>
