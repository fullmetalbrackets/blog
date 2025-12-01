---
title: "Turn a static website into a progressive web app"
description: "Frameworks and libraries are great and all, but sometimes you just want to make a simple website with only HTML, CSS and JavaScript — maybe without the latter even. When making a PWA, it’s common to use a framework like Vue or a library like Workbox, which requires a bundler like Webpack. In truth, that’s completely unnecessary!"
pubDate: 2022-01-07
updateDate: 2025-01-30
tags: ["web development"]
related1: styling-the-kbd-element
---

> **TL;DR**
>
> I created <a href="https://github.com/fullmetalbrackets/pwa-template" target="_blank">a simple template repo on GitHub</a> with just the files necessary to make your HTML site a PWA, as described below - it contains `app.js` and `sw.js` to use as is, and a sample `manifest.json` you need to edit with your project's details. (Replace the `index.html` and `main.css` with your own files.)
>
> See a demo of it in action <a href="https://pwa-template.surge.sh" arget="_blank">here</a>.

## What is a Progressive Web App?

Progressive Web Applications, or PWAs for short, are web apps that can give a user experience on par with native apps you’d install on your smartphone or computer. You can read more about it <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" target="_blank">on the MDN web docs</a>, and I strongly suggest you do because I will not be going in-depth here.

## PWA requirements

1. A javascript Service Worker file in your project’s root.
2. A manifest JSON file in your project’s root.
3. HTTPS, because even if you meet every other requirement, PWAs will not install without it!

Let’s get right into what a Service Worker and a Manifest look like. Again, <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" target="_blank">read the MDN docs</a> for more details.

## Service Worker

You can name this whatever you want, but most commonly they are called **sw.js** — here is an example of a `sw.js` file.

```js
// sw.js

const staticSite = "website";
const assets = ["/", "app.js"];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticSite).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
```

What the code above does is specify the assets the service worker will cache, currently the array only caches the root file, which is `index.html`, and `app.js`. That’s all you really need, but you’ll have to cache any additional HTML pages, CSS files, images, favicon, etc. Caching these files is how the PWA will be able to work offline. The next part of the code simply listens for the “install” and “fetch” events essential for PWAs to function.

Next you’ll need to register the service worker, which is done with this simple piece of code.

```js
// app.js

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").then(
      function (registration) {
        // Registration was successful
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
```

The above code can be inline on your HTML file with `<script>` tags, or in a separate JavaScript file if you prefer, which is what I did above.

## Manifest

The `manifest.json` file that tells the browser how the PWA should behave when installed. Here is a typical manifest with only the required bits.

```json
// manifest.json

{
  "name": "PWA Name",
  "short_name": "PWA Name",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-72x72.png",
      "type": "image/png",
      "sizes": "72x72"
    },
    {
      "src": "/icon-96x96.png",
      "type": "image/png",
      "sizes": "96x96"
    },
    {
      "src": "/icon-128x128.png",
      "type": "image/png",
      "sizes": "128x128"
    },
    {
      "src": "/icon-144x144.png",
      "type": "image/png",
      "sizes": "144x144"
    },
    {
      "src": "/icon-152x152.png",
      "type": "image/png",
      "sizes": "152x152"
    },
    {
      "src": "/icon-192x192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/icon-384x384.png",
      "type": "image/png",
      "sizes": "384x384"
    },
    {
      "src": "/icon-512x512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

Let's break it down:

- `"name"` is the text displayed on the splash screen below the icon
- `"short_name"` is the text displayed below the shortcut on the desktop or the home screen of mobile devices
- `"scope"` tells the browser which pages are part of the PWA, generally this should be “/” (project root directory and all subdirectories) or “.” (same directory as the manifest, which should be project root anyway, and all subdirectories)
- `"display"` specifies how the app is displayed on a mobile device — there’s several options, but “standalone” gives the most native-like feel, with the PWA having it’s own app window and launcher icon
- `"background_color"` is the color of the splash screen’s background
- `"theme_color"` is the color of the status bars and navigation if used in the app
- `"orientation"` determines whether the app is meant to be primarily displayed in portrait, landscape or either mode on a mobile device — you should probably set this to “any” or “natural” until you get a feel for whether or not you like one orientation over the other
- `"icons"` is an array of the app icons in their various sizes, each for a different size display of mobile device — you want this to be the same image (your app’s icon or logo) just in the specific different sizes

For the icons, you can just google “PWA icon generator” to find a bunch of tools that let you turn an image into the various sizes needed for a PWA, but I personally prefer <a href="https://www.simicart.com/manifest-generator.html/" target="_blank">this one</a> since generates both the correct size icons and the manifest for them. Note that if **any** size of icon is missing, or the incorrect size, the site will not be installable as a PWA.

## Testing your PWA

It may be tricky to test a PWA locally, since you need HTTPS and you may not have have a way to do that on your machine. If so I suggest using <a href="https://surge.sh" target="_blank">Surge.sh</a> since it lets you quickly and easily upload and teardown websites, and they provide free HTTPS. Alternately, you temporarily host your app on <a href="https://netlify.com" target="_blank">Netlify</a> or <a href="https://pages.github.com/" target="_blank">GitHub Pages</a> for that sweet free HTTPS.

Either way, once you've got HTTPS figured out, go to your site's URL in Google Chrome. First, you should notice a new icon on your address bar that gives you the option to install the site as a PWA. If you see this, you're golden! If not, let's figure out why with the Chrome Developer Tools. Open the developer tools, click on the **Application** tab and it will list any issues with the PWA. Usually fixing exactly what the Chrome dev tools tell you is broken will immediately make it work.

## References

- <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" target="_blank">MDN Web Docs on Progressive Web Apps</a>
- <a href="https://www.freecodecamp.org/news/build-a-pwa-from-scratch-with-html-css-and-javascript/" target="_blank">FreeCodeCamp article that helped me understand PWAs</a>
- <a href="https://www.simicart.com/manifest-generator.html/" target="_blank">My preferred tool for generating PWA manifest & icons</a>
