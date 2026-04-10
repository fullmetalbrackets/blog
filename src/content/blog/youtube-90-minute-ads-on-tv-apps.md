---
title: YouTube is shoving 90+ ads minute onto smart TVs, so here's a bunch of free open-source YouTube alternative apps to use instead
pubDate: 2026-04-09 20:40:00
description: YouTube has been on a mission to force it's users to watch more frequent and longer ads, while also making the experience worse for users that try to use adblockers, to push them onto YouTube Premium. So how about we just say no and start using one of the many free, open-source and privacy-friendly alternatives instead.
tags: ['smart tv', 'android', 'roku']
related1: 
related2: 
---

Enough is enough. If you use YouTube at all, even a little bit, you've no doubt been bombarded with multiple ads just while trying to watch one 10 minute video. Some ads are not even skippable, and can run for several minutes. It has gotten completely out of hand.

So I'm here to educate anyone that is over YouTube's unending ad diarrhea and has no desire to reward their terrible tactics with payment. Instead, I want to tell you about all the different ways you can watch YouTube videos on various smart TVs and set-top boxes with no ads, more private than actual YouTube, and in many cases even better performance.

> Before I begin, a note about *SponsorBlock*. This is a crowdsourced [browser extension](https://github.com/ajayyy/SponsorBlock) and [API](https://github.com/ajayyy/SponsorBlockServer) that lets anyone submit the start and end time's of sponsored segments of YouTube videos.
>
> There is also [iSponsorBlockTV](https://github.com/dmunozv04/iSponsorBlockTV), a self-hosted app made by a different person that connects to the official YouTube apps on your various TVs and other devices, so that sponsor segments and such are auto-skipped even when watching on the official YouTube app. (The app will also automatically mute normal ads and press the skip ad button for you as soon as it appears.)
>
> I bring up SponsorBlock because it is built-in to most if not all of the YouTube alternatives I'll talk about in this post. With this built-in most videos (after having been up for a day or two so submissions come in) will auto-skip sponsor segments and in-video "hit that bell, smash that like button" sections too.

## Important notice about using these apps

**Just to be clear, every YouTube alternative app below will block/skip ads on any YouTube videos watched through that app.**

This means you will not be contributing to ad revenue of whatever YouTube channels you watch, since you won't be served ads *at all*. (I strongly suggest supporting your favorite creators with alternative monetization methods whenever possible, like Patreon, etc.)

Also, it should go without saying that YouTube does not like these apps and is constantly fighting to break their functionality. They have and probably will again succeed in breaking one of more of the apps below, at least temporarily, so be sure to check for updates within the apps often.

## SmartTube for Android and Google TVs

I have to start out with the YouTube alternative I've been using for several years, and which is literally the only way I can watch YouTube now. [SmartTube](https://github.com/yuliskov/smarttube) has a clean YouTube-like interface (though the UI is noticeably different even compared to other alternatives below), full compatibility for 4K and 8K playback, 60fps and HDR, and it also comes with Sponsorblock built-in.

SmartTube specifically works on Android TV (Onn, Xiaomi, other "generic" brand Android TV devices), Amazon FireTV (maybe not newer models, do your research), Google TV set-top boxes and smart TV brands with it built-in like Sony Bravia, and the Nvidia Shield. It may also work on other no-name Android TV devices, but it *does not* work on "standard" Android on phones, tablets, chromebooks, etc.

[Installing SmartTube](https://github.com/yuliskov/smarttube?tab=readme-ov-file#installation) is a bit involved since it is not available on the Google Play Store, so it must be side-loaded. The easiest method, and the one I've always used, is to install [the Downloader by AFTVnews app](https://www.aftvnews.com/downloader/) on your TV or device, use it to open one of the URLs and install Smarttube that way. You can just delete Downloader afterwards.

Otherwise, you can download the Smarttube APK to your phone or tablet, use an app like [X-plore](https://play.google.com/store/apps/details?id=com.lonelycatgames.Xplore) or [Send Files to TV](https://sendfilestotv.app/) (or many others) to transfer the file to the TV, or just put the APK on a USB stick and plug that into your TV's USB port. [You can also use ADB](https://fossbytes.com/side-load-apps-android-tv/#h-how-to-sideload-apps-on-your-android-tv-using-adb), but this seems way more complicated than the other ways.

> For Smarttube specifically, just based on my own experience, I strongly suggest you *run the Beta branch*, it gets updates more often and since YouTube is constantly trying to kill all these free alternatives, there are times when things break and Smarttube rolls out urgent updates to fix these ASAP. Beta branch gets these first and constantly as needed.

## TizenTube for Tizen Samsung TVs

[TizenTube](https://github.com/reisxd/TizenTube) is a YouTube alternative specifically for Tizen, the Linux-based operating system running on Samsung TVs. I don't own a Samsung smart TV, so I can't give hands-on experience, but it has many of the same features including built-in SponsorBlock.

The only way to install TizenTube seems to be via [TizenBrew](https://github.com/reisxd/TizenBrew), made by the same developer, a sort of alternative front-end that lets you install modded websites and apps on your Samsung TV. (Just going based off what I have read about it.)

## TizenTube Cobalt for non-Tizen devices

[TizenTube Cobalt](https://github.com/reisxd/TizenTubeCobalt), made by the same developer as TizenTube and TizenBrew, is basically TizenTube for non-Tizen devices. That means you get TizenTube's interface and features on devices like Android/Google TVs, Amazon Firesticks/Fire TVs, and Nvidia Shield. (The GitHub readme specifically advises using [Google TV-certified devices](https://www.androidtv-guide.com/) for best results.)

The main way to install TizenTube Cobalt is to side-load it (download the APK and transfer to the device), although you can also use Downloader by AFTVnews browser extension to download it via a code from the TizenTube Cobalt readme.

I plan to try out TizenTube Cobalt soon, so I may update this in the future with more details.

## Playlet for Roku

So here's a recent one I didn't know about until I was researching for this post, there's actually a custom privacy-friendly YouTube alternative for Roku as well! [Playlet](https://github.com/iBicha/playlet) has no ads or tracking, has built-in SponsorBlock and is even faster than the official Roku YouTube app.

The UI is very similar to YouTube, although I did notice the "front" page only (if you sign in with your YouTube account) has your subscriptions, recommended, playlists and watch history. So there's a little less "discoverability" compared to other alternatives, but it's still a huge improvement over the vanilla YouTube experience on Roku.

You should be able to just search for Playlet in the Roku channel store (at least I was on my Insignia Roku TV), but it can also [be side-loaded](https://github.com/iBicha/playlet/discussions/371). (Sidenote: I thought Roku was a closed ecosystem but now I find out you can side-load?! Gotta look into this more...)

## Yattee for iOS devices

One of only two ad-free YouTube alternatives I found for the Apple ecosystem. (The other is below.) [Yattee](https://github.com/yattee/yattee) is a privacy-focused YouTube alternative front-end for all iOS platforms with a native UI built in Swift, with features including 4K video playback, custom controls and gestures, background play support, and of course built-in SponsorBlock.

I don't have any Apple devices, so I can't comment on the user experience. If you check this one out, feel free to [email me with your thoughts](mailto:blog@fullmetalbrackets.com?subject=My+thoughts+on+Yattee) and I will incorporate them into a future update.

## ReactTube for Apple TV

[ReactTube](https://github.com/Duell10111/ReactTube) is a more recent YouTube alternative, still in heavy development so it's not as feature-packed as others on this list. It seems to work by leveraging [YouTube.js](https://github.com/LuanRT/YouTube.js) to interact with YouTube's API and display videos in a custom player via [HLS](https://developers.google.com/youtube/v3/live/guides/hls-ingestion).

Just like with Yattee, I cannot test out this app myself since I don't have an Apple TV. If you try it out, you can [email me with your thoughts](mailto:blog@fullmetalbrackets.com?subject=My+thoughts+on+ReactTube) and I will incorporate them into a future update.

## ReVanced YouTube for Android

[ReVanced](https://revanced.app/) is a "patching system" for Android apps. I'll be honest, I have tried ReVanced a couple of times over the years and I don't really get it. My understanding is that developers provide patches for official Android apps including YouTube (but others also), which you then download and apply through ReVanced. It seems that to outright replace official apps with patched one requires the device be rooted, but apparently there's a way to install and use the patched apps as separate packages on non-rooted devices. (Pretty sure this difference is what has tripped me up before.)

I don't really watch YouTube on my phone or tablet so I've never bothered with an Android alternative, but ReVanced (and an older app it replaced called Vanced) have been *the* go-to ways to watch ad-free YouTube (via a patched app) on Android devices for years, so I had to include it.

## LibreTube for Android

I only discovered this one while doing research for this post, since again, I don't really I've never needed a YouTube alternative on Android since I just watch on my TV, with Smarttube. [LibreTube](https://github.com/libre-tube/LibreTube) is a YouTube alternative client for Android that uses [Piped](https://github.com/TeamPiped/Piped) (a self-hosted alternate YouTube front-end) under the hood. It blocks ads and tracking, supports background play, has built-in SponsorBlock, and even lets you download videos.

This looks way less complicated than ReVanced (although ReVanced obviously has uses beyond just watching YouTube ad-free) so I'll be checking this one out soon and will update at a later date.

## uBlock Origin for Chrome and Firefox

I hate watching YouTube on browsers, it seems to be where they do the grossest things to prevent ad blocking and push viewers towards premium. On the occassions when I do watch on a browser, though, the only way to not watch more ads than actual content is with the [uBlock Origin](https://github.com/gorhill/uBlock) browser extension.

Note that [because of changes to Manifest v3](https://github.com/uBlockOrigin/uBlock-issues/wiki/About-Google-Chrome's-%22This-extension-may-soon-no-longer-be-supported%22), it's only possible to use [uBlock Origin Lite](https://chromewebstore.google.com/detail/ublock-origin-lite/ddkjiahejlhfcafbddmgiahcphecmpfh?hl=en) on Google Chrome now, but I still never see ads on YouTube with it. (But again, I don't watch many videos on browser, just one every now and then.)

If you're still getting ads with uBlock Origin, check out [this GitHub Gist with custom filters](https://gist.github.com/leober-ramos33/5d41c69f6163c293a573ae4a3e109018) to add into uBlock Origin. (Note that it may or may not work, the comments are all over the place.) It's also possible that you'll get a warning from YouTube about using ad blockers with these filters in use. I don't use this personally.

## Invidious, self-hosted alternative YouTube front-end

Invidious is unique to other alternatives in that it takes privacy extremely seriously, so instead ofusing YouTube's official API it scrapes the YouTube website for video data like views, likes and comments, then presents that in Invidious' browser-like front-end without actually sending YouTube any of your data. There's even an option to proxy videos which will hide your IP from Google. You can also create a local account in Invidious to subscribe to channels and create playlists, without a YouTube account. (And if you do have a YouTube account, you can import subscriptions and playlists, then use them locally without actually signing in to YouTube.)

Invidious has to be self-hosted, but there's actually a [list of trustworthy (per the developers) public instances](https://docs.invidious.io/instances/) that anyone can use. Since anyone can self-host Invidious, technically anyone can run a public instance just by publically exposing it, but there's very specific rules to be considered trusted enough to appear on the "official" list. So don't use any public instance besides the ones on that list, if you want to be safe.

I haven't looked much into Invidious, but it's very mature in development and many of the YouTube alternatives on the list actually include support for an Invidious backend, for a fully private experience on any device.

> That's all for now. I will continue updating this in the future as I find other YouTube alternatives. If you know of others you'd like to recommend to me, [please let me know](mailto:blog@fullmetalbrackets.com?subject=YouTube+alternative+app) and I will update this post.