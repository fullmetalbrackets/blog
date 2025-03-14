---
title: Setting up and configuring Nuxt/Sitemap module in a Nuxt/Content blog
description: The excellent Nuxt/Sitemap module can automatically generate a new sitemap.xml at each build, and you can set either static and/or dynamic routes in it's config. It can also auto-generate routes to your blog posts (or whatever other content) fetched and displayed in a slug file, so a new post shows up with the correct route in the sitemap when created. Here's a quick and simple guide for Nuxt/Sitemap to generate routes to your Nuxt/Content blog posts, whether static or SSR.
pubDate: 2021-10-08
updatedDate: 2022-10-17
tags:
  - web development
---

> The information in this blog post may be outdated, since it was regarding **Nuxt 2**, which has now been **replaced with Nuxt 3**. Please keep in mind that the problem this blog post solves may not be present in Nuxt 3, or may not work even if the problem is present!

## About Nuxt/Sitemap

The excellent Nuxt/Sitemap module can automatically generate a new sitemap.xml at each build, and you can set either static and/or dynamic routes in it's config. It can also auto-generate routes to your blog posts (or whatever other content) fetched and displayed in a slug file, so a new post shows up with the correct route in the sitemap when created. Here's a quick and simple guide for Nuxt/Sitemap to generate routes to your Nuxt/Content blog posts, whether static or SSR.

This guide assumes you are working on a Nuxt site using the Content module as a headless CMS for blog posts, but it's easily modified to work with other use cases of Nuxt/Content.

## Setting it up

First, we have to add Nuxt/Sitemap to our dependencies, of course.

`yarn add @nuxtjs/sitemap` or `npm install -d @nuxtjs/sitemap`

Next we go into the `nuxt.config.js` file to enable it. Under `modules:[]` you want to add the following.

```js
// nuxt.config.js

  modules: [
    '@nuxt/content',
    '@nuxtjs/sitemap',
  ],
```

When using the Nuxt content module, your markdown files are stored in `./content/articles` by default, though you can do `./content/posts` or whatever instead, as long as the sub-directory with the actual markdown files is inside of `./content` -- the module works off that assumption unless you configure it to do otherwise, which is beyond the scope here. To display those markdown files as blog posts on your site, you'd go into one of your views inside the `./pages` directory and use the query builder API to fetch and display the content to our liking, or maybe we'll create a separate page just for that, like `./pages/blog.vue` for example. In either case, to actually serve your individual blog posts you'll need a `_slug.vue` file that fetches and routes a specific post.

Your URLs would then look something like this:

- https://example.com/blog (the blog.vue page listing all the blog posts)
- https://example.com/my-awesome-post-about-stuff (a blog post whose route was generated by `_slug.vue`)
- https://example.com/another-post-about-things (another blog post with route generated by `_slug.vue`)
- https://example.com/post-about-whatever (you get the picture... `_slug.vue` determines the URL we go to)

If this suits you fine, then add this to your `nuxt.config.js` file and the sitemap will be generated with the dynamic routes for your posts pointing at the root directory, as above:

```js
// nuxt.config.js

export default {
  sitemap: {
    hostname: "https://example.com",
    path: "/sitemap.xml",
    routes: async () => {
      const { $content } = require("@nuxt/content");
      const data = await $content("articles").only(["slug"]).fetch();
      return data;
    },
  },
};
```

If however you use another folder structure on your site, like in my case even though the raw markdown files are stored in `./content/articles` they are served via `./blog/name-of-post` because I wanted a dedicated page at [https://fullmetalbrackets.com/blog](https://fullmetalbrackets.com/blog) to list all my posts by date and have a search function. The above code won't work and when I went in search of a solution that would let me point the dynamic route at a specified directory, I couldn't really find a succinct way to do it. Finally I happened upon this Stack Overflow question that made me understand how to make it happen -- though in this case they are using axios, and I'm using Nuxt/Content's MongoDB-like query builder API, I just needed to use a mapping. So to make the sitemap module route correctly in this case, instead of the above, use this code in the `nuxt.config.js` file:

```js
// nuxt.config.js

export default {
  sitemap: {
    routes: async () => {
      const { $content } = require("@nuxt/content");
      const data = await $content("articles").only(["slug"]).fetch();
      return data.map((p) => `/blog/${p.slug}`);
    },
  },
};
```

Voila! Now the sitemap module will generate the dynamic routes correctly with only a few extra lines of code, right inside your `nuxt.config.js` file. If you want to test it locally before deploy, do `yarn generate` then go into your `/dist` folder and open the `sitemap.xml` file -- all your blog post routes should appear.

## References

- <a href="https://content.nuxtjs.org/integrations/#nuxtjssitemap" target="_blank">Nuxt/Sitemap Documentation, which didn't really help me to be honest</a>
- <a href="https://www.google.com/search?q=nuxt+sitemap+nuxt+content&oq=nuxt+sitemap+nuxt+content" target="_blank">The google search results that got me part of the way</a>
- <a href="https://stackoverflow.com/questions/68114979/dynamically-generate-sitemap-using-nuxtjs-sitemap" target="_blank">The question on Stack Overflow that finally made it click for me</a>
