---
layout: "../../layouts/BlogPost.astro"
title: How to use a custom PrismJS theme with Nuxt/Content
description: PrismJS is great for making code blocks look pretty, it comes with a set of several themes out of the box, and there's also many more additional themes available as a separate package on NPM and Yarn. But what if none of those matches the color scheme of your website? With Nuxt you can easily use a custom CSS file to make your code blocks perfectly match the overall look of your site or blog. Here's how.
pubDate: "October 18, 2021"
updatedDate: "October 17, 2022"
tags:
  - Nuxt
  - Prism JS
---

<div class="note">
  <b>ⓘ &nbsp;Note</b>
  The information in this blog post may be outdated, since it was regarding Nuxt 2 and Content v1, which have now been replaced with Nuxt 3 and Content v2 respectively. Please keep in mind that the problem this blog post solves may not be present in Nuxt 3/Content v2, or may not work even if the problem is present!
</div>

PrismJS is great for making code blocks look pretty, it comes with a set of several themes out of the box, and there's also many more additional themes available as a separate package on NPM and Yarn. But what if none of those matches the color scheme of your website? With Nuxt you can easily use a custom CSS file to make your code blocks perfectly match the overall look of your site or blog. Here's how.

## Requirements

Before we begin, please note that while I can confirm it works when using `target: 'static'` in **_nuxt.config.js_**, I have not used PrismJS under `target: 'server'` and cannot say for certain whether it will work, or even be necessary.

If you haven't already, install PrismJS in your project via `npm install prismjs` or `yarn add prismjs`, then add the following to your Nuxt config:

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

This will use let Prism and Content play nice together. The reason we are setting `theme: false` is because we don't need to use this in static mode, instead we import a theme through a custom plugin that we'll make ourselves. First, let's create the theme.

## Creating custom theme and importing to Prism

PrismJS "themes" are just CSS files that target specific classes used by Prism to style code blocks. Check out the CSS files [in Prism's themes directory](https://github.com/PrismJS/prism/tree/master/themes) or the [many additional Prism themes](https://github.com/PrismJS/prism-themes/tree/master/themes) available. Using these as a base, change the colors, sizes, and what have you to create your own theme.

Once you have a CSS file with your custom theme, place it in the same directory where you keep your global/main CSS file or Sass/SCSS files, probably `/assets`. I'll assume you named it _*prism-theme.css*_ but you can name it whatever, just make sure it has a `.css` extension.

Create a file named _*Prism.js*_ within the `/plugins` directory of your project, and add the following lines:

```js
import Prism from "prismjs";

import "assets/prism-theme.css";

Prism.languages.vue = Prism.languages.markup;

export default Prism;
```

That's all you need to make Prism use your custom theme. You can import other PrismJS plugins and components through this file too, but that's beyond the scope of this post. If you'd like, [check out the custom theme I created for this site](https://gist.github.com/fullmetalbrackets/c4cf2b4ee2cf78c99997e6cc31ea6aa0) and use it as your own baseline. Happy theming!

## References

- [PrismJS](https://github.com/PrismJS/prism)
- [Additional Themes for PrismJS](https://github.com/PrismJS/prism-themes)
- [Nuxt/Content module](https://github.com/nuxt/content)
- [My Vaporwave PrismJS Theme](https://gist.github.com/fullmetalbrackets/c4cf2b4ee2cf78c99997e6cc31ea6aa0)
