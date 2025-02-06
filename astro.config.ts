import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://fullmetalbrackets.com',
  integrations: [mdx(), sitemap()],
  prefetch: true,
  markdown: {
    syntaxHighlight: 'prism'
  },
  compressHTML: true,
  image: {
    service: passthroughImageService()
  },
  redirects: {
    '/feed': {
      status: 302,
      destination: '/rss.xml',
    },
    '/mail': {
      status: 302,
      destination: 'mailto:contact@fullmetalbrackets.com',
    },
    '/github': {
      status: 302,
      destination: 'https://github.com/fullmetalbrackets',
    },
    '/bsky': {
      status: 302,
      destination: 'https://bsky.app/profile/fullmetalbrackets.bsky.social',
    },
    '/social': {
      status: 302,
      destination: 'https://social.lol/@adiaz',
    },
    '/donate': {
      status: 302,
      destination: 'https://buymeacoffee.com/arieldiaz',
    },
    '/umami': {
      status: 302,
      destination: 'https://cloud.umami.is/share/5MdOgBcRzVP6FU0x/fullmetalbrackets.com',
    },
  },
});