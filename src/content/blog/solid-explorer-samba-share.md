---
title: "How to use Solid Explorer app to access SMB network shares from an Android device"
description: "There are many File Managers/File Explorers on the Google Play Store, but I wanted to easily access the Samba share on my server while on my home network. Solid Explorer is the solution I went with and it works well, so here is a quick guide to setting it up."
pubDate: 2022-11-07
updateDate: 2024-03-21
tags:
  - Android
  - Samba
  - Solid Explorer
---

<div>
  <div class="note">
    <span>
      <img src="/assets/note.svg" class="note-icon" alt="Note" loading="eager" decoding="async" />
      <b>Note</b>
    </span>
    <p>
      I used <em>Android 12 Snow Cone</em> when making the guide, the steps to make this work may be different if you're using an older or newer version of Android. (But most likely will be the same or similar.)
    </p>
    <p>
      Also, this guide assumes you already have an existing SMB share accessible in your home network. If you're not sure how to set that up, <a href="/blog/setup-a-samba-share-on-linux-via-command-line" target="_blank">see this blog post for instructions</a>.
    </p>
  </div>
</div>

## Connect Solid Explorer to SMB share

Make sure your Android Device is connected to the same network as the machine with the SMB share. Open the Solid Explorer app and
tap the _hamburger menu_ at the top-left to bring up the menu, then tap the _3-dots_ and choose _Storage manager_.

[![Screenshot of Solid Explorer menu.](../../img/solidexplorer1.jpg)](../../img/solidexplorer1.jpg)

[![Screenshot of Solid Explorer, Storage manager sub-menu.](../../img/solidexplorer1.jpg)](../../img/solidexplorer1.jpg)

In Storage manager, tap the _Plus (+) button_ to add a new connection. In the _Network Connection Wizard_, choose _LAN / SMB_ and tap _Next_.

[![Screenshot of Solid Explorer's Storage manager.](../../img/solidexplorer3.jpg)](../../img/solidexplorer3.jpg)

[![Screenshot of Network Connection Wizard, Connection type menu.](../../img/solidexplorer4.jpg)](../../img/solidexplorer4.jpg)

You should see any SMB shares in your network under _server details_, choose one and tap _Next_. Choose your _authentication_ method and tap _Next_. (I suggest using _Username and password_ unless you have properly configured the SMB share for guest access, otherwise you may experience permissions issues.)

[![Screenshot of Network Connection Wizard, server details.](../../img/solidexplorer5.jpg)](../../img/solidexplorer5.jpg)

[![Screenshot of Network Connection Wizard, Authentication menu.](../../img/solidexplorer6.jpg)](../../img/solidexplorer6.jpg)

If you chose _Username and password_ authentication, you'll be prompted for the login info. Enter it and tap _Next_. On the next screen, I always choose _Yes_ to proceed to _Advanced Settings_. Tap _Next_.

[![Screenshot of Network Connection Wizard, login page.](../../img/solidexplorer7.jpg)](../../img/solidexplorer7.jpg)

[![Screenshot of Network Connection Wizard, advanced settings.](../../img/solidexplorer8.jpg)](../../img/solidexplorer8.jpg)

For _Protocol version_ choose the recommended _SMB 2_, then tap _Next_. You'll get to review your settings, if everything is correct tap _Next_.

[![Screenshot of Network Connection Wizard, SMB Protocol version.](../../img/solidexplorer9.jpg)](../../img/solidexplorer9.jpg)

[![Screenshot of Network Connection Wizard, review page.](../../img/solidexplorer10.jpg)](../../img/solidexplorer10.jpg)

On the following screen, tap the big _Connect_ button. If everything is properly configured, the button will _turn green with a checkmark_. Tap _Finish_.

[![Screenshot of Network Connection Wizard, Connect button.](../../img/solidexplorer11.jpg)](../../img/solidexplorer11.jpg)

[![Screenshot of Network Connection Wizard, connection successful.](../../img/solidexplorer12.jpg)](../../img/solidexplorer12.jpg)

You'll see your server under _Storage manager_. Tap the _back arrow (<-)_ to go back to the menu. You should see the SMB share among the options under _Storages_.

[![Screenshot of Storage manager showing the SMB share.](../../img/solidexplorer13.jpg)](../../img/solidexplorer13.jpg)

[![Screenshot of Solid Explorer menu, showing the SMB share under Storages.](../../img/solidexplorer14.jpg)](../../img/solidexplorer14.jpg)

## References

- <a href="/setup-a-samba-share-on-linux-via-command-line" target="_blank">Blog post about setting up Samba share on Linux</a>
- <a href="https://play.google.com/store/apps/details?id=pl.solidexplorer2&hl=en_US&gl=US" target="_blank">Solid Explorer on the Google Play Store</a>
