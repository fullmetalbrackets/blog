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
      status: 301,
      destination: '/rss.xml',
    },
    '/mail': {
      status: 301,
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
      status: 301,
      destination: 'https://social.lol/@adiaz',
    },
    '/donate': {
      status: 301,
      destination: 'https://buymeacoffee.com/arieldiaz',
    },
    '/umami': {
      status: 302,
      destination: 'https://cloud.umami.is/share/5MdOgBcRzVP6FU0x/fullmetalbrackets.com',
    },
    '/categories/plex': {
      status: 302,
      destination: '/search/?q=plex',  
    },
    '/notes/': {
      status: 302,
      destination: '/blog/',
    },
    '/blog/tailscale': {
      status: 301,
      destination: '/blog/comprehensive-guide-tailscale-securely-access-home-network/',
    },
    '/blog/factory-restore-zimaboardmd/': {
      status: 301,
      destination: '/blog/factory-restore-zimaboard/',
    },
    '/blog/expose-plex-tailscale-vps)': {
      status: 301,
      destination: '/blog/expose-plex-tailscale-vps/',  
    },
    '/tailscale': {
      status: 301,
      destination: '/blog/comprehensive-guide-tailscale-securely-access-home-network/',
    },
    '/mergerfs': {
      status: 301,
      destination: '/blog/two-drives-mergerfs/',
    },
    '/tunnel': {
      status: 301,
      destination: '/blog/setup-cloudflare-tunnel-to-access-self-hosted-apps/',
    },
    '/plex-tailscale': {
      status: 301,
      destination: '/blog/expose-plex-tailscale-vps/',
    },
    '/reverse-proxy': {
      status: 301,
      destination: '/blog/reverse-proxy-using-nginx-pihole-cloudflare/',
    },
  },
});
