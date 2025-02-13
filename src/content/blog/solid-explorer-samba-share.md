---
title: "How to use Solid Explorer app to access SMB network shares from an Android device"
description: "There are many File Managers/File Explorers on the Google Play Store, but I wanted to easily access the Samba share on my server while on my home network. Solid Explorer is the solution I went with and it works well, so here is a quick guide to setting it up."
pubDate: 2022-11-07
updatedDate: 2025-02-12
tags:
  - android
---

> <img src="/assets/info.svg" class="info" loading="eager" decoding="async" alt="Information">
>
> I used **Android 12** when making the guide, the steps to make this work may be different if you're using an older version of Android. (But most likely will be the same or similar.) As of 2025, I can confirm this process is still identical on **Android 14**.
> 
> Also, this guide assumes you already have an existing SMB share accessible in your home network, and you're just trying to access it via _Solid Explorer_. If interested, <a href="/blog/setup-a-samba-share-on-linux-via-command-line/" target="_blank">see this blog post on how to create SMB shares on a Linux server</a> might help.

## Connect Solid Explorer to SMB share


First, make sure you're on the same Wi-Fi network as the SMB share you want to access in Solid Explorer. (Setting this up to be available from outside the home network is possible, but beyond the scope of this article. But <a href="/blog/tailscale" target="_blank" data-umami-event="solid-explorer-tailscale">this might interest you.</a>)

Open the Solid Explorer app and
tap the _hamburger menu_ at the top-left to bring up the menu, then tap the _3-dots_ and choose _Storage manager_.

![Solid Explorer.](../../img/blog/solidexplorer1.jpg 'Solid Explorer')
![Storage manager in Solid Explorer.](../../img/blog/solidexplorer2.jpg 'Network Connection Wizard in Solid Explorer')

In Storage manager, tap the _Plus (+) button_ to add a new connection.

![Storage manager in Solid Explorer.](../../img/blog/solidexplorer3.jpg 'Storage manager in Solid Explorer')

In the _Network Connection Wizard_, choose _LAN / SMB_ and tap _Next_.

![Network Connection Wizard in Solid Explorer.](../../img/blog/solidexplorer4.jpg 'Network Connection Wizard in Solid Explorer')

You should see any SMB shares in your network under _server details_, choose one and tap _Next_.

![Details in Network Connection Wizard.](../../img/blog/solidexplorer5.jpg 'Details in Network Connection Wizard')

Choose your _authentication_ method and tap _Next_. (I suggest using _Username and password_ unless you have properly configured the SMB share for guest access, otherwise you may experience permissions issues.)

![Authentication in Network Connection Wizard.](../../img/blog/solidexplorer6.jpg 'Authentication in Network Connection Wizard')

If you chose _Username and password_ authentication, you'll be prompted for the login info. Enter it and tap _Next_.

![Login details in Network Connection Wizard.](../../img/blog/solidexplorer7.jpg 'Login details in Network Connection Wizard')

On the next screen, under _Set advanced_, choose _Yes_ and tap _Next_.

![Advanced settings in Network Connection Wizard.](../../img/blog/solidexplorer8.jpg 'Advanced settings in Network Connection Wizard')

For _Protocol version_ choose the recommended _SMB 2_, then tap _Next_.

![SMB Protocol version in Network Connection Wizard.](../../img/blog/solidexplorer9.jpg 'SMB Protocol version in Network Connection Wizard')

You'll get to review your settings, if everything is correct tap _Next_.

![Review in Network Connection Wizard.](../../img/blog/solidexplorer10.jpg 'Review in Network Connection Wizard')

On the following screen, tap the big _Connect_ button.

![Connect button.](../../img/blog/solidexplorer11.jpg 'Connect button')

If everything is properly configured, the button will _turn green with a checkmark_. Tap _Finish_.

![Connection successful.](../../img/blog/solidexplorer12.jpg 'Connection successful')

You'll see your server under _Storage manager_. Tap the _back arrow (<-)_ to go back to the menu.

![Storage manager showing SMB.](../../img/blog/solidexplorer13.jpg 'Storage manager showing SMB')

You should see the SMB share among the options under _Storages_.

![SMB share available in Storages.](../../img/blog/solidexplorer14.jpg 'SMB share available in Storages')

All done! Now you can easily access your SMB shares from your Android device with _Solid Explorer_, and it even has built-in media players, image viewer and text editor.

## References

- <a href="https://play.google.com/store/apps/details?id=pl.solidexplorer2&hl=en_US&gl=US&pli=1" target="_blank" data-umami-event="solid-explorer-google-play"></a>

## Related Articles

> <a href="/blog/xplore-android-smb-share/" data-umami-event="solid-explorer-related-xplorer">Setup X-plore File Manager on Android to transfer files to an SMB share</a>

> <a href="/blog/setup-a-samba-share-on-linux-via-command-line/" data-umami-event="solid-explorer-related-smb-share-linux-cli">Setup a Samba share on Linux via command line</a>
