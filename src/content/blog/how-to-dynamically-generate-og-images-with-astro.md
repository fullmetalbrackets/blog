---
title: 'How I used Astro-OG-Canvas to dynamically generate opengraph images for blog posts on my Astro site'
description: "After putting it off for a long time, I finally decided I should dynamically generate OG images for my blog posts, since I don't use typically use a hero image or cover photos. After looking at satori with resvg, I decided that the Astro-OG-Canvas project is a much nicer fit. Here's how I set it up."
pubDate: 2026-03-20 12:00:00
tags: ['astro', 'web dev', 'meta']
howto: true
---

## WTF is OpenGraph image?

If you've built any websites you probably know about [OpenGraph](https://opengraph.xyz), a protocol that enables any web page to become a rich object in a social graph. By using add OpenGraph-specific `<meta>` tags a website's `<head>` section, you can pass things like title, description and a cover/hero image. Then when you or someone else shares a URL to your site or one of your posts on social media, it will automatically be populated with that information: title, description and an image.

In Astro, using `yarn/npm/pnpm create astro` and picking the blog template when starting a new project scaffolds a basic working blog which includes a `BaseHead` component, which already has all the `<meta>` tags you should be using, including tags for X and OpenGraph tags.

```html
<!-- Canonical URL -->
<link rel="canonical" href="{canonicalURL}" />

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content="{title}" />
<meta name="description" content="{description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="{Astro.url}" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:image" content="{new" URL(image.src, Astro.url)} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="{Astro.url}" />
<meta property="twitter:title" content="{title}" />
<meta property="twitter:description" content="{description}" />
<meta property="twitter:image" content="{new" URL(image.src, Astro.url)} />
```

With the blog template it all comes wired up so that you can provide a "fallback" image that is used by default for opengraph unless you include a cover image for your posts; if you do include a cover image, it is used in place of the fallback instead.

## Why tho?

Truth be told, this is not that important. Google does not use OpenGraph for their search in any way, so it does not affect SEO. However, if you share your posts on social media or want others to share it on your behalf, then it's a good idea to at least use a "static" opengraph image that can be shown with it.

I do have a default/fallback OG image for my site, and I have since the beginning, you can see it's latest iteration in the [Style Guide](/style#Images), or just [click here](/preview.png). I created this image with [a shitty little app I made](https://github.com/fullmetalbrackets/html-to-og) that uses Puppeteer to take a 1200x630 sized screenshot of an HTML file in a headless browser. It's basic and dirty because I'm no good at the JavaScript, but I'm even worse at graphic design.

A static image like that is fine, but I've been entertaining myself testing out and adding a bunch of bells and whistles to this site, so I figured why not do the dynamic OG image thing. Initially I used [satori](https://github.com/vercel/satori) which turns JSX into an SVG, then [resvg-js](https://github.com/thx/resvg-js) to turn that SVG into a PNG. OpenGraph protocol does not support SVGs, only JPEG and PNG. Some social media platforms also accept WebP, [per this blog post by Darek Kay](https://darekkay.com/blog/open-graph-image-formats/).

It was a little jank to get working in Cloudflare Pages (it would probably work fine on a other platforms like Netlify or Vercel which use node), especially after changing the site from static to SRR to take advantage of improved performance at Cloudflare's edge, so I looked around for a better solution. Silly me not realizing earlier on that [Astro-OG-Canvas](https://github.com/delucis/astro-og-canvas) was a thing.

This uses Skia's Canvas API via [canvaskit-wasm](https://www.npmjs.com/package/canvaskit-wasm) under the hood. Rather than converting JSX to SVG with satori, then converting the SVG to PNG with resvg, this package uses the Canvas API to draw pixels. It doesn't let you use JSX, so it's technically a little more limiting than satori because you can't just build out a page, but it uses a nice declarative configuration with plenty of options. Turns out that [Astro's own documentation uses this package](https://github.com/withastro/docs/blob/main/package.json) for their OG image generation, which is to me is a stamp of approval.

## Installing and configuring Astro-OG-Canvas

First, install the package with your package manager of choice. I use `yarn` for this site, so I used `yarn add astro-og-canvas`. [As per the instructions](https://github.com/delucis/astro-og-canvas/tree/latest/packages/astro-og-canvas#readme), I created a file at `src/og/[...route].ts` which means the generated images will live at `/og/some-post-slug.png`.

You have the option of generating the OG images either from a directory of Markdown files or from an [Astro content collection](https://docs.astro.build/en/guides/content-collections/); I went with the latter, since I use both `.md` and `.mdx` files for blog posts as needed. I don't know for sure that generating images from markdown files won't also work with MDX files, but generating from content collections just makes more sense to me. I already have multiple content collections on my site and if I wanted to generate OG images for one of the others in the future, it will be easy.

After looking through the configuration options, I ended up with the below `[...routes].ts`:

```ts
export const prerender = true;

import { resolve } from 'node:path';
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const collectionEntries = await getCollection('blog');

const pages = Object.fromEntries(
	collectionEntries.map(({ id, data }) => [id, data])
);

export const { getStaticPaths, GET } = await OGImageRoute({
	param: 'route',

	pages: pages,

	getImageOptions: (path, page) => ({
		title: page.title,
		description: page.description,
		logo: {
			path: resolve(process.cwd(), 'src/img/assets/long-logo.png'),
		},
		font: {
			title: {
				families: ['AtkinsonHyperlegibleNext'],
				weight: 'ExtraBold',
				color: [255, 255, 255],
				size: 52,
				lineHeight: 1.1,
			},
			description: {
				families: ['AtkinsonHyperlegibleNext'],
				weight: 'Normal',
				color: [164, 174, 188],
				size: 24,
				lineHeight: 1.3,
			},
		},
		bgGradient: [[32, 33, 36]],
		fonts: [
			resolve(
				process.cwd(),
				'public/fonts/AtkinsonHyperlegibleNext-Regular.ttf'
			),
			resolve(
				process.cwd(),
				'public/fonts/AtkinsonHyperlegibleNext-ExtraBold.ttf'
			),
		],
	}),
});
```

I was having pathing issues to the logo and fonts, so I used `resolve(process.cwd())` method. Again, I think this is a Cloudflare-specific hiccup and might not be an issue on Vercel or Netlify.

> [warning] Important!
>
> If you're following along to implement this on your own Astro site, note that I use `export const prerender = true;` but this may not be necessary for you, and may cause you problems!
>
> In most cases Astro sites are static, meaning your Astro config either has `output: static` or `output` is not present at, which defaults it to static. In this situation, where your site outputs to `static` and _not_ `server`, **DO NOT** use `export const prerender = true;` or use `false` instead.
>
> Since my site started as static and only changed to SSR recently, I was using `getStaticPaths()` all over the place, and rather than switch to dynamic routes I just use `export const prerender = true;` to keep using static routes. This is not good practice, but I am lazy and I probably won't change it until I get around to doing a full rebuild of the site.
>
> Don't be me. [Do routing the right way.](https://docs.astro.build/en/guides/routing/)

The end result you can see by going to https://fullmetalbrackets.com/og/how-to-dynamically-generate-og-images-with-astro.png or substituting any other blog post slug for the `.png`.

If you want to check your own site's opengraph metadata, you can use [Meta Tags Toolkit](https://metatags.io/) or [Lens](https://lens.rknight.me/).

## References
- [OpenGraph](https://opengraph.xyz)
- [Astro Docs - Routing](https://docs.astro.build/en/guides/routing/)
- [Blog post by Darek Kay re: OpenGraph supported image formats](https://darekkay.com/blog/open-graph-image-formats/).