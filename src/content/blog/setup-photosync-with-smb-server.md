---
title: "Set up PhotoSync app to backup photos from your phone to an SMB share on your home server"
description: "Google Photos began limiting free storage back in 2021, limiting you to 15 GB of storage when uploading photos in their original size uncompressed. Rather than wait and see if I hit the cap, I decided to try replacing Google Photos with a self-hosted solution. Here's how I did it."
pubDate: 2023-07-07
updatedDate: 2025-02-03
tags: ["self-hosting", "android", "smb"]
related1: setup-a-samba-share-on-linux-via-command-line
related2: setting-up-plex-in-docker
---

> Though the **PhotoSync** app is available on iPhone as well as Android, I have an Android phone and so I _have only done this on Android_. It's safe to assume configuring PhotoSync on iPhone to connect to your NAS will be similar, if not exactly the same.

## Caveats and Pre-Requisites

The method I describe below requires that your phone with the _PhotoSync_ app be _connected to the same Wi-Fi network as the server_ that you will be transferring your photos to, or have access to the server via Tailscale or other similar solution. Also, the server must already be configured with a Samba share. (<a href="/blog/setup-a-samba-share-on-linux-via-command-line/" target="_blank" data-umami-event="photosync-smb-to-setup-smb-linux">See here how to set up a Samba share on Linux.</a>)

Finally, using the **SMB** option to transfer photos _requires the NAS Add-On for PhotoSync_, which costs **$2.49** by itself. (You also have the option of spending a bit more on the _Bundle Add-On_, which comes with the _NAS Add-On_ as well as the _Auto-Transfer and Cloud Add-Ons_, but those are not necessary for what we'll be setting up.)

## Configure PhotoSync

In the PhotoSync app, tap the **gear icon** at the bottom-right corner to enter the _Settings_.

![PhotoSync settings.](../../img/blog/photosync1.jpg 'PhotoSync settings')
![PhotoSync settings.](../../img/blog/photosync2.jpg 'PhotoSync settings')

Under _Transfer Targets_ tap on **Configure**. On the following page choose _SMB_ from the list, then tap **Add New Configuration**.

![PhotoSync SMB configuration.](../../img/blog/photosync3.jpg 'PhotoSync SMB configuration')
![PhotoSync SMB configuration.](../../img/blog/photosync4.jpg 'PhotoSync SMB configuration')

Enter the IP address of the server where the Samba share is, enter the login and password (assuming you have it set up that way), then tap the **magnifying glass** button next to _Directory_. The app should automatically show any Samba shares already set up on the server, tap on the one you want to use. Next tap on **Connect** at the top-right corner and if everything works correctly, you should be sent to the SMB target page.

Now under _FOLDER SETTINGS_ tap on **Destination Folder** and pick a directory in the share, if you'd like, or just use the Share's root directory if you prefer, then tap **Select** on the top-right.

![PhotoSync SMB account settings.](../../img/blog/photosync5.jpg 'PhotoSync SMB account settings')
![PhotoSync SMB configuration.](../../img/blog/photosync6.jpg 'PhotoSync SMB configuration')

The rest of the settings you can set to your liking. If you haven't gotten any errors, everything should be working as intended. Tap on **Done** to return to the app's main page.

## Transferring photos to the Samba share

Back on the main page, tap the _red transfer icon at the top_, tap **All** (or you can tap individual photos and choose _Selected_), then tap **SMB**.

![Transfering photos in PhotoSync.](../../img/blog/photosync7.jpg 'Transfering photos in PhotoSync')
![Transfering photos in PhotoSync.](../../img/blog/photosync8.jpg 'Transfering photos in PhotoSync')

Tap on the directory to transfer your photos into (keep in mind _Destination Folder_ and _Create Sub-Directories_ in the SMB Account setting from earlier) and tap **Select**, the photo transfer should begin.

![Transfering photos in PhotoSync.](../../img/blog/photosync9.jpg 'Transfering photos in PhotoSync')

All done! Now you can manually sync new photos from your phone to your NAS at any time by opening the app and repeating the last set of instructions above. 

Next, we'll set up _background auto-transfers_, but you'll need optional the **Auto-Transfer Add-On**.

1. In the PhotoSync app, tap the **gear icon** at the bottom-right corner to enter the _Settings_, and click on **Autotransfer**.

2. Click on _Target_ and choose **SMB**. (No further configuration should be required if you had already set up SMB.)

3. Next click on _Connection_ and choose **Wi-Fi**, and for _Autotransfer from_ choose **All** or your preferred albums.

4. Finally, under _Autotransfer Trigger_ click on the **Change Trigger** button, and pick your desired trigger -- I like to set it so transfers occur when I connect a charger.

## References

- <a href="https://www.photosync-app.com/home" target="_blank" data-umami-event="photosync-smb-photosync-site">PhotoSync Website</a>