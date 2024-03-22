---
title: Using Prism.js in a Nuxt static site
description: I was having some issue getting this to work on a static (not SSR) site made with Nuxt, and although I read through a bunch of blog articles, most of them seemed to be missing some piece of information or other that made it not work for me. After mixing and matching some of the instructions, and combining the useful info with the official Nuxt documentation, I finally did all the necessary steps and got it to work. So here's a clear, succinct guide to using Prism.js in a Nuxt static site.
pubDate: 2021-09-17
updatedDate: 2022-10-17
tags:
  - Nuxt
  - Prism JS
---

<div>
  <div class="note">
    <span>
      <img src="/assets/note.svg" class="note-icon" alt="Note" loading="eager" decoding="async" />
      <b>Note</b>
    </span>
    <p>
      The information in this blog post may be outdated, since it was regarding <em>Nuxt 2</em> and <em>Content v1</em>, which have now been <em>replaced with Nuxt 3 and Content v2</em> respectively. Please keep in mind that the problem this blog post solves may not be present in Nuxt 3/Content v2, or may not work even if the problem is present!
    </p>
  </div>
</div>

I was having some issue getting this to work on a static (not SSR) site made with Nuxt, and although I read through a bunch of blog articles, most of them seemed to be missing some piece of information or other that made it not work for me. After mixing and matching some of the instructions, and combining the useful info with the official Nuxt documentation, I finally did all the necessary steps and got it to work. So here's a clear, succinct guide to using Prism.js in a Nuxt static site.

These instructions assume you are using the [Nuxt/Content](https://github.com/nuxt/content) module. First things first, let's add Prism.js as a dependency.

Install via Yarn:

```shell
yarn add prism
```

Install via NPM:

```shell
npm install prism
```

## Edit nuxt config file

You need to add this line to your `nuxt.config.js` file:

```js
// nuxt.config.js

content: {
  markdown: {
    prism: {
      theme: false;
    }
  }
}
```

I know setting `theme: false` seems counter-intuitive, but it's necessary for Prism to work on static sites for some reason. Also, for this to work on static, you DO NOT need to add Prism to your plugins in the nuxt config, it doesn't hurt anything to add it, but seems to only be necessary for SSR. Instead for static we need to make our own plugin for Nuxt to use.

## Create plugin for Prism

If it doesn't already exist, create a directory in your project root named **/plugins**, and within it create a file named **prism.js**. We want to import all the things we need in **/plugins/prism.js**:

```js
import Prism from "prismjs";

// Include a theme:
import "prismjs/themes/prism-okaidia.css";

// Include some plugins:
import "prismjs/plugins/normalize-whitespace/prism-normalize-whitespace";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import "prismjs/plugins/highlight-keywords/prism-highlight-keywords";
import "prismjs/plugins/show-language/prism-show-language";
import "prismjs/plugins/autoloader/prism-autoloader";

// Include additional languages:
import "prismjs/components/prism-bash";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-toml";

// Set vue SFC to markdown
Prism.languages.vue = Prism.languages.markup;

export default Prism;
```

This particular file will import Prism, import the Okaidia theme (which comes included in Prism), and also import what I consider some essential plugins for it. Add or remove any to your liking.

## Import Prism to \_slug.vue

Now we need to edit the **\_slug.vue** file in the **/pages** directory that is used to generate your individual blog posts/articles/whatever. It may be located in another sub-directory like **/pages/blog/\_slug.vue**. Edit the file and add this to the script section:

```js
// _slug.vue

import Prism from "~/plugins/prism";

export default {
  mounted() {
    Prism.highlightAll();
  },
};
```

That's it!

## But wait, what about inline code?!

Prism.js only works on code _blocks_ and not inline code snippets `like this one`. So if you use a theme, get the base colors for it (either look at the theme's CSS file or just inspect a Prism code block element in Chrome Dev Tools to get them) and include in your style, so that it all matches! You want to target inline code within paragraph elements.

```css
p code {
  background: #272822;
  color: #fe10bf;
}
```

## References

- [Relevant section in the Nuxt docs](https://content.nuxtjs.org/writing#codeblocks)
- [Google search with articles & blog posts that got me part of the way](https://www.google.com/search?q=prism+js+static+mode&oq=prism+js+static+mode)
