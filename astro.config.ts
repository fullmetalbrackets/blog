import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  site: 'https://arieldiaz.codes',
  integrations: [mdx(), sitemap(), prefetch(
    {
      throttle: 10
    }
  )],
  markdown: {
    drafts: false,
    syntaxHighlight: 'prism'
  },
  compressHTML: true,
});