import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  site: 'https://arieldiaz.codes',
  integrations: [sitemap(), prefetch({
    throttle: 6
  })],
  markdown: {
    drafts: false,
    syntaxHighlight: 'prism'
  },
  compressHTML: true
});