---
title: "Sideload the DirecTV Stream app on Sony Bravia TV with Android TV"
description: "I have a Sony Bravia 4K TV and it is awesome. It has built-in Android TV so you can use Android apps on your TV, but not every app is available, and one of those is DirecTV Stream -- necessary to view live TV from my cable provider, AT&T, without need for a separate set-top box. So here's how to sideload the DirecTV Stream app on Sony Bravia TVs without using the Google Play Store."
pubDate: 2021-08-31
updatedDate: 2022-09-18
tags:
  - Android
  - Miscellaneous
---

## Sections

1. [Intro](#intro)
2. [Requirements](#req)
3. [Install pre-requisite apps](#install)
4. [Download the AT&T TV APK](#apk)
5. [Transfer the APK file to TV](#tv)
6. [Install the AT&T TV app on Sony Bravia TV](#tv)
7. [References](#ref)

<div>
  <div class="alert">
    <span>
      <img src="/img/assets/alert.svg" class="alert-icon"> <b>Important!</b>
    </span>
    <p>
      As of September 2022, I no longer have AT&T as a provider, so I cannot personally confirm that these instructions will still work anymore. However, a cursory skim of the forum thread on XDA Developers shows active discussion and recent updates of the APK, so I have no reason to believe these instructions are outdated. Feel free to let me know if you try them and they do not work.
    </p>
  </div>
</div>

<div id='intro'/>

After some internet sleuthing and poring over many forum threads, the answer finally came from [this thread in the XDA-Developers forum](https://forum.xda-developers.com/t/the-ultimate-at-t-tv-and-fire-tv-apk-repository.3854154/), where packages for the different devices are gathered. I'll be giving instructions specifically for sideloading (without Google Play Store) the DirecTV Stream app on a Sony Bravia TV. Here's the gist:

<div id='req'/>

## Requirements

1. Sony Bravia TV with built-in Android TV - I can confirm this method works with **Sony Bravia TV model XBR65A8H**
2. An Android phone or tablet to download the APK to. There's probably a way to transfer the file from iPhone too, but I don't use those, so it's beyond the scope here. Either way this method won't require a PC at all.
3. You'll need a few extra apps for both the TV and phone/tablet -- we'll take care of those first

<div id='install'/>

## Install pre-requisite apps

First, you'll need file manager app on your Sony Bravia TV to browse files. I suggest **File Commander**, but feel free to use any app you want, there's plenty to choose from. For some reason Google's own Files app isn't available on the Play Store via Sony Bravia TV (and I'm not about to figure out how to sideload that app too), so go to the Play Store from your TV and install the file manager app of your choice.

Next, you need an app to be able to transfer files to the TV. The easiest way I've found to do this is with the Send Files to TV app from the Play Store. There are other options, but this one is so quick and easy (plus free) that I've never bothered with another app. Install the Send Files to TV app (or your chosen alternative) on *BOTH* the Sony Bravia TV and the phone/tablet.

Download: <a href="https://play.google.com/store/apps/details?id=com.mobisystems.fileman" target="_blank" rel="noopener noreferrer">File Commander</a>\
Download: <a href="https://play.google.com/store/apps/details?id=com.yablio.sendfilestotv" target="_blank" rel="noopener noreferrer">Send Files to TV</a>

<div id='apk'/>

## Download the AT&T TV APK

Picking up the slack from AT&T's neglect of their customers with a top-of-the-line Sony 4KTV, a kind soul uploads multiple variants of the APK (Android application package) that will work on Sony Bravia TVs, amongst other device options.

From your phone, <a href="https://www.mediafire.com/folder/ezc6ki36dp34f/Apps#jahuvrlwbro78" target="_blank" rel="noopener noreferrer">download the APK here</a>. (This specific one will work on Sony Bravia TVs.)

Make sure you download the most recent version, it should be the only file in the directory, with older versions behind a separate folder, but double-check the date to make sure it's the most recent version of the APK. Sooner or later, you'll go to use the DirecTV Stream app and it'll bug you for an update -- you'll need to come back to this file share to get the newest version, since you won't be able to update the app via the Play Store like you normally would with other apps.

<div id='transfer'/>

## Transfer the APK file to TV

Now that we downloaded the APK to our phone or tablet, we have to transfer the file from your phone to the TV, but first make sure your phone is on Wi-Fi connected to the same network as the Sony Bravia TV -- they need to be on the same network to transfer files, everything happens over your home network, no internet connection required.

Open the Send Files to TV app on BOTH the TV and phone. You should see the below screen.

[![Screenshot of Send Files to TV app on mobile](/img/blog/attbravia1.jpg)](https://arieldiaz.codes/img/blog/attbravia1.jpg)

Choose receive on the TV, and send on the phone. On the phone, navigate to the Downloads folder and search for the APK, then click on it. You should see the TV on the list, like below. (Ignore the file name in my screenshot, it's of the old AT&T TV app, but this method works the same with DirecTV Stream.)

[![Screenshots of UI in Send Files to TV app](/img/blog/attbravia2.jpg)](https://arieldiaz.codes/img/blog/attbravia2.jpg)

<div id='tv'/>

## Install the AT&T TV app on Sony Bravia TV

Final step! Open the file manager app on the TV, go to the Download folder and the APK should be there. Unfortunately I don't have att-imgs from the TV, but it should be self-explanatory. If using TV File Commander, move your cursor to the three dots next to the file, click on it and then click on Install. You'll see a file transfer dialog on both the phone and the TV.

[![Screenshots showing file transferring from mobile to TV in Send Files to TV app](/img/blog/attbravia3.jpg)](https://arieldiaz.codes/img/blog/attbravia3.jpg)

You should be all done! The app should appear on your Sony Bravia TV's app list and home, you'll just need to login with your AT&T account credentials. Enjoy beautiful 4K streaming of live cable channels!

<div id='ref'/>

## References

- <a href="https://www.mediafire.com/folder/ezc6ki36dp34f/Apps#jahuvrlwbro78" target="_blank" rel="noopener noreferrer">DirecTV Stream APK</a>
- <a href="https://play.google.com/store/apps/details?id=com.yablio.sendfilestotv" target="_blank" rel="noopener noreferrer">Send Files to TV app for Android</a>
- <a href="https://play.google.com/store/apps/details?id=com.mobisystems.fileman" target="_blank" rel="noopener noreferrer">File Commander app for Android</a>
- <a href="https://forum.xda-developers.com/t/the-ultimate-at-t-tv-and-fire-tv-apk-repository.3854154/" target="_blank" rel="noopener noreferrer">XDA Developers thread</a>
