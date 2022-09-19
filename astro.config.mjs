import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://arieldiaz.codes',
	integrations: [mdx(), sitemap()],
	markdown: {
		syntaxHighlight: 'shiki',
		theme: 'min-dark',
    wrap: true,
  },
});