---
title: "Setup X-plore File Manager on Android to transfer files to an SMB share"
description: "I've written about file managers for Android before, recently I found X-plore which makes it very easy to transfer files back and forth between Android and SMB network shares, once you understand how the UI works. Here's how I set that up."
pubDate: 2024-03-26
updatedDate: 2025-02-12
tags:
  - android
---

## Sections

1. [Adding SMB share in X-plorer](#add)
2. [Transferring files from Android to SMB share](#transfer)
3. [References](#ref)

> <img src="/assets/info.svg" class="info" loading="lazy" decoding="async" alt="Information">
>
> Although I'm doing this on a OnePlus phone running **OxygenOS 13**, it is just a customized version of **Android 13** -- Everything below should work on any version of Android 13, and probably older versions as well.

<div id='add' />

## Adding SMB share in X-plorer

First, make sure you're on the same Wi-Fi network as the SMB share you want to add in X-plore. (Setting this up to be available from outside the home network is possible, but beyond the scope of this article. But <a href="/blog/tailscale" target="_blank" data-umami-event="x-plore-tailscale">this might interest you.</a>)

X-plore File Manager's UI looks weird at first, but once it clicks for you it's very easy to use. When you first open it will show your internal storage.

![UI of X-plore File Manager.](../../img/blog/xplore1.jpg 'UI of X-plore File Manager')

If you swipe left from here, or click the icon to the left of the three-dot menu, the screen will change to a second, identical screen. On this second screen, tap on **Internal shared storage** to close it, you'll see other options.

![UI of X-plore File Manager.](../../img/blog/xplore2.jpg 'UI of X-plore File Manager')

The option we want is **LAN**. Tap on it, then on **Add server**, and from the dropdown **Scan**. This will show any discoverable network shares.

![Discovered network shares in X-plore File Manager.](../../img/blog/xplore3.jpg 'Discovered network shares in X-plore File Manager')

Click on the share you want to access, if login is required you'll get a pop-up asking for login info. Add your username and password and click **Save**.

![Adding SMB share login info to X-plore File Manager.](../../img/blog/xplore4.jpg 'Adding SMB share login info to X-plore File Manager')

Now you'll be back in the list of discovered SMB share, notice the one you just added moved to the top of the list under LAN has a **checkmark on the icon**.

![SMB share with checkmark in X-plore File Manager.](../../img/blog/xplore5.jpg 'SMB share with checkmark in X-plore File Manager')

Tap the server and it will show all available shares.

![Server network shares in X-plore File Manager.](../../img/blog/xplore6.jpg 'Server network shares in X-plore File Manager')

## Transferring files from Android to SMB share

We will now transfer multiple files from the Android device to a network share on my server. Swipe back to the phone's internal storage, tap to a folder with files you want to transfer -- say, **DCIM** -> **Camera** for example.

![Accessing an internal storage folder in X-plore File Manager.](../../img/blog/xplore7.jpg 'Accessing an internal storage folder in X-plore File Manager')

To select specific files, tap the **checkmarks** next to the files. Alternately, you can tap the checkmark next to a folder to select the folder with all contents, or tap the checkmark twice to select all files inside the folder.

![Selecting files in X-plore File Manager.](../../img/blog/xplore8.jpg 'Selecting files in X-plore File Manager')

Once you've selected what you want to transfer, swipe back to **LAN** storage, tap the server and find the folder you want to transfer files into from Android -- tap the **checkmark** next to that folder.

![Selecting share folder to transfer files into in X-plore File Manager.](../../img/blog/xplore9.jpg 'Selecting share folder to transfer files into in X-plore File Manager')

Now swipe back to internal storage, tap and hold one of the selected files to bring up a menu. Tap on **Copy**.

![File options menu in X-plore File Manager.](../../img/blog/xplore10.jpg 'File options menu in X-plore File Manager')

You'll get a final confirmation dialog, and the option to move instead of copy the files, which will delete the source files. Tap **OK**.

![File copy confirmation in X-plore File Manager.](../../img/blog/xplore11.jpg 'File copy confirmation in X-plore File Manager')

You'll see the files being transferred...

![Transferring files in X-plore File Manager.](../../img/blog/xplore12.jpg 'Transferring files in X-plore File Manager')

And then they'll be in your destination folder in the network share.

![Finished transferred files in X-plore File Manager.](../../img/blog/xplore13.jpg 'Finished transferred files in X-plore File Manager')

All done! Once you get a hang of the UI, transferring files back and forth from Android to remote sources is very easy. You can also use other means besides SMB, including (but not limited to) FTP and SSH, cloud storage like Google Drive or Dropbox, etc. Overall, I think **X-plore** is a great file manager for Android.

<div id='ref' />

## References

- <a href="https://www.lonelycatgames.com/apps/xplore" target="_blank" data-umami-event="x-plore-site">X-plore website</a>
- <a href="https://play.google.com/store/apps/details?id=com.lonelycatgames.Xplore" target="_blank" data-umami-event="x-plore-google-play">Download X-plore on Google Play</a>
- <a href="https://www.amazon.com/Lonely-Cat-Games-X-plore-Manager/dp/B00LLG7AR8" target="_blank" data-umami-event="x-plore-amazon">Download X-plore on Amazon Appstore</a>

## Related Articles

> <a href="/blog/solid-explorer-samba-share/" umami-data-event="xplorer-related-solid-explorer">How to use Solid Explorer app to access SMB network shares from an Android device</a>

> <a href="/blog/setup-a-samba-share-on-linux-via-command-line/" umami-data-event="solid-explorer-related-smb-share-linux-cli">Setup a Samba share on Linux via command line</a>