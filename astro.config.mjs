import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  site: 'https://arieldiaz.codes',
  integrations: [preact(), mdx(), sitemap(), prefetch(
    {
      throttle: 6
    }
  )],
  markdown: {
    syntaxHighlight: 'prism'
  }
});