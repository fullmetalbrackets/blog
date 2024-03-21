import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
// import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://fullmetalbrackets.com',
  integrations: [mdx(), sitemap()],
  // output: 'hybrid',
  // adapter: cloudflare(),
  image: {
    service: {
      entrypoint: "./src/services/passThroughImageService",
    }},
  prefetch: true,
  markdown: {
    syntaxHighlight: 'prism'
  },
  compressHTML: true
});