import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://fullmetalbrackets.com',
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),
  output: 'server',
  prefetch: true,
  markdown: {
    drafts: false,
    syntaxHighlight: 'prism'
  },
  compressHTML: true,
  image: {
    service: passthroughImageService()
  }
});