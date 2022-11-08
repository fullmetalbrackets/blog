---
layout: "../../layouts/BlogPost.astro"
title: "How to use Solid Explorer app to access SMB network shares from an Android device"
description: "There are many File Managers/File Explorers on the Google Play Store, but I wanted to easily access the Samba share on my server while on my home network. Solid Explorer is the solution I went with and it works well, so here is a quick guide to setting it up."
pubDate: "November 7, 2022"
tags:
  - Android
  - Samba
  - Solid Explorer
---

> **ⓘ &nbsp;Note**<br><br> I used Android 12 when making the guide, the steps to make this work may be different if you're using an older or newer version of Android. (But most likely will be the same or similar.)

This guide assumes you already have an existing SMB share accessible in your home network. If you're not sure how to set that up, <a href="/blog/setup-a-samba-share-on-linux-via-command-line" target="_blank">see this blog post for instructions</a>.
<br><br>

<style>
  .two-img {
    display: inline-flex;
    flex-direction: row;
    margin: 2em 0 4em 0;
  }
  .two-img img {
    width: 75%;
    height: auto;
  }
  @media screen and (min-width: 200px) and (max-width: 1024px) {
    .two-img {
      display: inline-flex;
      flex-direction: column;
    }
    .two-img img {
      width: 85%;
      height: auto;
      margin-top: 1em;
    }
  }
</style>

## Connect Solid Explorer to SMB share

Make sure your Android Device is connected to the same network as the machine with the SMB share. Open the Solid Explorer app and
tap the _hamburger menu_ at the top-left to bring up the menu, then tap the _3-dots_ and choose _Storage manager_.

<div class="two-img">
<a href="/img/blog/solidexplorer1.jpg" target="_blank"><img src="/img/blog/solidexplorer1.jpg" alt="Screenshot of Solid Explorer menu." /></a> <a href="/img/blog/solidexplorer2.jpg" target="_blank"><img src="/img/blog/solidexplorer2.jpg" alt="Screenshot of Solid Explorer, Storage manager sub-menu." /></a>
</div>

In Storage manager, tap the _Plus (+) button_ to add a new connection. In the _Network Connection Wizard_, choose _LAN / SMB_ and tap _Next_.

<div class="two-img">
<a href="/img/blog/solidexplorer3.jpg" target="_blank"><img src="/img/blog/solidexplorer3.jpg" alt="Screenshot of Solid Explorer's Storage manager." /></a> <a href="/img/blog/solidexplorer4.jpg" target="_blank"><img src="/img/blog/solidexplorer4.jpg" alt="Screenshot of Network Connection Wizard, Connection type menu." /></a>
</div>

You should see any SMB shares in your network under _server details_, choose one and tap _Next_. Choose your _authentication_ method and tap _Next_. (I suggest using _Username and password_ unless you have properly configured the SMB share for guest access, otherwise you may experience permissions issues.)

<div class="two-img">
<a href="/img/blog/solidexplorer5.jpg" target="_blank"><img src="/img/blog/solidexplorer5.jpg" alt="Screenshot of Network Connection Wizard, server details." /></a> <a href="/img/blog/solidexplorer6.jpg" target="_blank"><img src="/img/blog/solidexplorer6.jpg" alt="Screenshot of Network Connection Wizard, Authentication menu." /></a>
</div>

If you chose _Username and password_ authentication, you'll be prompted for the login info. Enter it and tap _Next_. On the next screen, I always choose _Yes_ to proceed to _Advanced Settings_. Tap _Next_.

<div class="two-img">
<a href="/img/blog/solidexplorer7.jpg" target="_blank"><img src="/img/blog/solidexplorer7.jpg" alt="Screenshot of Network Connection Wizard, login page." /></a><a href="/img/blog/solidexplorer8.jpg" target="_blank"><img src="/img/blog/solidexplorer8.jpg" alt="Screenshot of Network Connection Wizard, advanced settings." /></a>
</div>

For _Protocol version_ choose the recommended _SMB 2_, then tap _Next_. You'll get to review your settings, if everything is correct tap _Next_.

<div class="two-img">
<a href="/img/blog/solidexplorer9.jpg" target="_blank"><img src="/img/blog/solidexplorer9.jpg" alt="Screenshot of Network Connection Wizard, SMB Protocol version." /></a><a href="/img/blog/solidexplorer10.jpg" target="_blank"><img src="/img/blog/solidexplorer10.jpg" alt="Screenshot of Network Connection Wizard, review page." /></a>
</div>

On the following screen, tap the big _Connect_ button. If everything is properly configured, the button will _turn green with a checkmark_. Tap _Finish_.

<div class="two-img">
<a href="/img/blog/solidexplorer11.jpg" target="_blank"><img src="/img/blog/solidexplorer11.jpg" alt="Screenshot of Network Connection Wizard, Connect button." /></a><a href="/img/blog/solidexplorer12.jpg" target="_blank"><img src="/img/blog/solidexplorer12.jpg" alt="Screenshot of Network Connection Wizard, connection successful." /></a>
</div>

You'll see your server under _Storage manager_. Tap the _back arrow (<-)_ to go back to the menu. You should see the SMB share among the options under _Storages_.

<div class="two-img">
<a href="/img/blog/solidexplorer13.jpg" target="_blank"><img src="/img/blog/solidexplorer13.jpg" alt="Screenshot of Storage manager showing the SMB share." /></a><a href="/img/blog/solidexplorer14.jpg" target="_blank"><img src="/img/blog/solidexplorer14.jpg" alt="Screenshot of Solid Explorer menu, showing the SMB share under Storages." /></a>
</div>

## References

- <a href="/setup-a-samba-share-on-linux-via-command-line" target="_blank">Blog post about setting up Samba share on Linux</a>
- <a href="" target="_blank">Solid Explorer on the Google Play Store</a>
