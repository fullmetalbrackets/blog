---
title: You should be using Nuxt-Vite module with Nuxt 2 (if it works)
description: One of the not-so-great parts of developing with Nuxt is the several seconds of wait time for your dev server to warm up, and several more seconds of waiting for hot-module reloading or HMR. The forthcoming Nuxt 3 (currently in beta) will have Vite built-in for ultra-fast HMR in development. Because the Nuxt/Content module does not work with Nuxt 3 as of this writing, we must continue using Nuxt 2, but we can still get fast HMR with the awesome Nuxt-Vite module!
pubDate: 2021-10-23
tags: ['web development']
---

> [warning] Outdated Content
>
> This was one of my earliest blog posts when I was still using Nuxt 2. Nuxt is at a much later version by now and so the below is definitely no longer relevant. The content remains for legacy purposes only.

One of the not-so-great parts of developing with Nuxt is the several seconds of wait time for your dev server to warm up, and several more seconds of waiting for hot-module reloading or HMR. The forthcoming Nuxt 3 (currently in beta) will have Vite built-in for ultra-fast HMR in development. Because the Nuxt/Content module does not work with Nuxt 3 as of this writing, we must continue using Nuxt 2, but we can still get fast HMR with the awesome Nuxt-Vite module!

### Caveats

First, you should know that in the near future, Nuxt/Content will be getting a "smaller scope" update, according to [this tweet from Atinux](https://twitter.com/Atinux/status/1448221492681093124?s=20), and apparently it may eventually be superseded by a new thing out of NuxtLabs called [Docus](https://docus.com). So this article may become outdated soon enough, but in the meantime if we want to use Nuxt/Content (which means we must use Nuxt 2) then we should use [Nuxt-Vite](<[https://vite.nuxtjs.org/getting-started/installation](https://vite.nuxtjs.org/getting-started/installation)>) with it!

However, the second thing you should know is that Nuxt-Vite is experimental (and will probably remain that way indefinitely if the above information is any indication), but it works fine with Nuxt/Content and other modules by the Nuxt team, like Nuxt/Sitemap and Nuxt/Feed. I've personally used Nuxt-Vite with sass and sass-loader, but style-resources will not work. Check out [common issues](https://vite.nuxtjs.org/misc/common-issues) in the docs. I will show all the packages this site uses and which have no issues with Nuxt-Vite at the bottom of the article.

## What is Nuxt-Vite and why use it?

Nuxt-Vite is a small module made by the Nuxt team that replaces the built-in bundler, webpack, with vite when you run `npm run dev` or `yarn dev`. (Webpack is still used to build for production.) It's super easy to use the module, and to stop using it if it doesn't play nice with your project, so it hurts nothing to [just try it](<[https://github.com/nuxt/vite](https://github.com/nuxt/vite)>). Let's compare the difference with and without the vite module.

[![Dev server spinning up in Nuxt without Nuxt-Vite module](/img/nuxt-no-vite1.png)](https://arieldiaz.codes/img/nuxt-no-vite1.png)

[![Project compile time in Nuxt without Nuxt-Vite module](/img/nuxt-no-vite2.png)](https://arieldiaz.codes/img/nuxt-no-vite2.png)

Above is this site loading in development with Nuxt, no vite module. As usual, Nuxt has the progress bar when first spinning up the dev server. As you can see, it took 3.49 seconds to compile and load the site in dev mode; now exactly slow, but it can be ridiculously faster. Check out the speeds using Nuxt-Vite below.

[![Dev server spinning up in Nuxt using the Nuxt-Vite module](/img/nuxt-vite1.png)](https://arieldiaz.codes/img/nuxt-vite1.png)

[![Wow such fast! 1327ms to compile](/img/nuxt-vite2.png)](https://arieldiaz.codes/img/nuxt-vite2.png)

With Nuxt-Vite, there's no progress bar and the dev server starts almost instantly — 1327ms to spin up the dev server, then in the 80-90ms range for HMR!

### Packages that work with Nuxt-Vite

You can just check out the `package.json` of [my site's GitHub page](https://github.com/fullmetalbrackets/website), but here's the dependencies and dev-dependencies I use for my site, and which have given me no issues with Nuxt-Vite.

```json
  "dependencies": {
    "@nuxt/content": "^1.15.0",
    "@nuxtjs/feed": "^2.0.0",
    "@nuxtjs/markdownit": "^2.0.0",
    "@nuxtjs/pwa": "^3.3.5",
    "@nuxtjs/sitemap": "^2.4.0",
    "core-js": "^3.18.3",
    "glob-parent": "^6.0.2",
    "markdown-it": "^12.2.0",
    "netlify-plugin-csp-generator": "^1.5.0",
    "nuxt": "^2.15.7",
    "prismjs": "^1.25.0"
  },
  "devDependencies": {
    "@babel/eslint-parser": "^7.15.8",
    "@nuxtjs/eslint-config": "^6.0.1",
    "@nuxtjs/eslint-module": "^3.0.2",
    "eslint": "^7.29.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-nuxt": "^2.0.0",
    "eslint-plugin-vue": "^7.20.0",
    "nuxt-vite": "^0.3.5",
    "prettier": "^2.4.1"
  }
```

### References

- [Nuxt 2](https://nuxtjs.org)
- [Nuxt/Content module](https://content.nuxtjs.org)
- [Nuxt-Vite module](https://vite.nuxtjs.org)
- [WTF is Vite?](https://vitejs.dev)
- [WTF is Docus??](https://docus.com)
- [Nuxt 3 Beta](https://v3.nuxtjs.org)
