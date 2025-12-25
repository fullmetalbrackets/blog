import { defineConfig, fontProviders, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/utils/remark-reading-time.ts';
import rehypeExternalLinks from 'rehype-external-links';
import remarkDirective from 'remark-directive'
import remarkDirectiveSugar from 'remark-directive-sugar'

export default defineConfig({
  site: 'https://fullmetalbrackets.com',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap(), (await import("@playform/compress")).default(),
  ],
  prefetch: true,
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer']
        }
      ]
    ],
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkReadingTime, remarkDirective, remarkDirectiveSugar],
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
    '/github/': {
      status: 302,
      destination: 'https://github.com/fullmetalbrackets',
    },
    '/bsky/': {
      status: 302,
      destination: 'https://bsky.app/profile/fullmetalbrackets.bsky.social',
    },
    '/social/': {
      status: 302,
      destination: 'https://social.lol/@adiaz',
    },
    '/donate/': {
      status: 302,
      destination: 'https://buymeacoffee.com/arieldiaz',
    },
    '/umami/': {
      status: 302,
      destination: 'https://cloud.umami.is/share/5MdOgBcRzVP6FU0x/fullmetalbrackets.com',
    },
    '/notes/': {
      status: 302,
      destination: '/blog/',
    },
    '/blog/tailscale/': {
      status: 302,
      destination: '/blog/comprehensive-guide-tailscale-securely-access-home-network/',
    },
    '/blog/factory-restore-zimaboardmd/': {
      status: 302,
      destination: '/blog/factory-restore-zimaboard/',
    },
    '/blog/expose-plex-tailscale-vps)': {
      status: 302,
      destination: '/blog/expose-plex-tailscale-vps/',  
    },
    '/blog/expose-plex-tailscale-vps/)': {
      status: 302,
      destination: '/blog/expose-plex-tailscale-vps/',  
    },
    '/blog/how-to-use-sudo-without-a-password/': {
      status: 302,
      destination: '/blog/sudo-without-password/',
    },
    '/tailscale/': {
      status: 302,
      destination: '/blog/comprehensive-guide-tailscale-securely-access-home-network/',
    },
    '/mergerfs/': {
      status: 302,
      destination: '/blog/two-drives-mergerfs/',
    },
    '/tunnel/': {
      status: 302,
      destination: '/blog/setup-cloudflare-tunnel-to-access-self-hosted-apps/',
    },
    '/plex-tailscale/': {
      status: 302,
      destination: '/blog/expose-plex-tailscale-vps/',
    },
    '/reverse-proxy/': {
      status: 302,
      destination: '/blog/reverse-proxy-using-nginx-pihole-cloudflare/',
    },
  },
    experimental: {
    fonts: [
      {
        name: "Atkinson Hyperlegible Next",
        cssVariable: "--main-font",
        provider: fontProviders.fontsource(),
        weights: [200, 300, 400, 500, 600, 700, 800],
        styles: ["normal", "italic"],
        subsets: ["latin"],
      },
      {
        name: "Atkinson Hyperlegible Mono",
        cssVariable: "--code-font",
        provider: fontProviders.fontsource(),
        weights: [200, 300, 400, 500, 600, 700, 800],
        styles: ["normal", "italic"],
        subsets: ["latin"],
      },
      {
        name: "M PLUS Rounded 1c",
        cssVariable: "--sub-font",
        provider: fontProviders.fontsource(),
        weights: [100, 300, 400, 500, 700, 800, 900],
        styles: ["normal"],
        subsets: ["latin"],
      },
    ],
    svgo: true
  },
});