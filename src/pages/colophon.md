---
layout: ../layouts/Page.astro
title: Colophon
description: How fullmetalbrackets.com is made, with what tools, supporting what technologies, etc.
---

How this site is made, with what tools, supporting what technologies, etc.

## Site and Webhost

The site is built with [Astro](https://astro.build) and deployed
on [Cloudflare Pages](https://pages.cloudflare.com) from a [public
GitHub repository](https://github.com/fullmetalbrackets/blog),
totally free. Paying for my domain every year is literally the
only cost I incur for this website; it was around $18/year through
Namecheap, but transferring to Cloudflare dropped the cost to just
under $10/year.

And thanks to a few readers that [Bought Me A Coffee](https://buymeacoffee.com/arieldiaz) the bill for 2025 was covered and I have a few bucks leftover towards 2026's renewal, so thanks!

## Astro, Integrations and Packages

Blog posts and Wiki articles are all written in [Markdown](https://www.markdownguide.org/) with YAML frontmatter and managed via [Astro's Content Collections](https://docs.astro.build/en/guides/content-collections/). [Links](/links/) and [Lifestream](/lifestream/) are also done through Content Collection and exist as YAML files.

I use several packages to help with building the site and writing posts.

- [astrojs/rss](hhttps://docs.astro.build/en/recipes/rss/): Astro integration to add an RSS feed, in my case the feed is blog posts only.
- [astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/): Astro integration that automatically generates a `sitemap.xml`.
- [playform/compress](https://github.com/PlayForm/Compress): Astro integration that compresses and optimizes files (HTML, CSS, images, etc.) at build time.
- [astro-social-share](https://github.com/silent1mezzo/astro-social-sharE): Used for the "share on social" buttons at
  the bottom of blog posts.
- [reading-time](https://github.com/ngryman/reading-time) + [mdast-util-to-string](https://github.com/syntax-tree/mdast-util-to-string): Used to calculate and display how many minutes it takes to read individual blog posts.
- [remark-directive](https://github.com/remarkjs/remark-directive) + [remark-directive-sugar](https://github.com/lin-stephanie/remark-directive-sugar): Used to add new Markdown syntax for images, video embeds, etc.
- [rehype-external-links](https://docs.astro.build/en/recipes/external-links/): Used to automatically add the little arrow next to external links throughout the site.
- [astro-embed](https://astro-embed.netlify.app/) for embedding YouTube videos, Bluesky posts, etc.
- [isotope.js](https://isotope.metafizzy.co/layout) for grid layout in [Lifestream](/lifestream/).

## Third-Party Services

- [Pagefind](https://pagefind.app/): Dead simple fully static search library for static websites, used here to search blog posts. Doesn't even require adding it to your dependencies.
- [Giscus](https://giscus.app): Alternative to Discus for comments in blog posts using GitHub Discussions, rather than Issues, as the backend.
- [Webmention.io](https://webmention.io) + [Webmention.app](https://webmention.app): Webmention is an open protocol used by websites to be notified when they link to each other. Webmention.app is a free service to automate outgoing webmentions with a simple API. (Might switch to [Bridgy](https://brid.gy/about) though.)
- [Umami](http://umami.is): GDPR-compliant and privacy friendly Google Analytics alternative, self-hosted on a VPS. ([See website stats here.](https://u.adiaz.fyi/share/TtTytHU8rJy0oEzN))

## WTF is a Colophon anyway?

> [quote]
> <span class="i b u em">colophon</span> _noun_ (col·​o·​phon ˈkä-lə-fən -ˌfän)<br>
> 1: an inscription at the end of a book or manuscript <span class="em">usually with facts about its production</span>.
>
> [Merriam-Webster Dictionary](https://www.merriam-webster.com/dictionary/colophon)

Or in a modern context...

> [quote]
> A <span class="i b u em">colophon</span> is a page or section (typically in a footer) of a site that <span class="em">describes how the site is made, with what tools, supporting what technologies</span>, and often published on personal sites at a top level `/colophon` page.
>
> [IndieWeb](https://indieweb.org/colophon)
