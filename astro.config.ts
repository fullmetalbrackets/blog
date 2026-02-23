import {
	defineConfig,
	fontProviders,
	passthroughImageService,
} from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/utils/remark-reading-time.ts';
import rehypeExternalLinks from 'rehype-external-links';
import remarkDirective from 'remark-directive';
import remarkDirectiveSugar from 'remark-directive-sugar';
import yeskunallumami from '@yeskunall/astro-umami';
import rehypeCodeblockCopy from './src/utils/rehype-codeblock-copy.ts';

export default defineConfig({
	site: 'https://fullmetalbrackets.com',
	trailingSlash: 'always',
	integrations: [
		mdx(),
		sitemap(),
		(await import('@playform/compress')).default(),
		yeskunallumami({
			id: 'd9921361-56b2-4c33-8377-4c73cb1add2d',
			hostUrl: 'https://u.adiaz.fyi',
		}),
	],
	prefetch: true,
	markdown: {
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					target: '_blank',
					rel: ['noopener', 'noreferrer'],
				},
			],
			rehypeCodeblockCopy,
		],
		syntaxHighlight: 'prism',
		remarkPlugins: [remarkReadingTime, remarkDirective, remarkDirectiveSugar],
	},
	compressHTML: true,
	image: {
		service: passthroughImageService(),
		domains: ['img.buymeacoffee.com'],
	},
	redirects: {
		'/feed/': {
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
			destination:
				'https://u.adiaz.fyi/share/TtTytHU8rJy0oEzN',
		},
		'/blog/tailscale/': {
			status: 302,
			destination:
				'/blog/comprehensive-guide-tailscale-securely-access-home-network/',
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
			destination:
				'/blog/comprehensive-guide-tailscale-securely-access-home-network/',
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
		'/shelf/': {
			status: 301,
			destination: '/digest/',
		},
		'/shelf/movies': {
			status: 301,
			destination: '/digest/movies/',
		},
		'/shelf/tvshows/': {
			status: 301,
			destination: '/digest/tvshows/',
		},
	},
	experimental: {
		fonts: [
			{
				name: 'Atkinson Hyperlegible Next',
				cssVariable: '--main-font',
				provider: fontProviders.fontsource(),
				weights: [200, 300, 400, 500, 600, 700, 800],
				styles: ['normal', 'italic'],
				subsets: ['latin'],
			},
			{
				name: 'Atkinson Hyperlegible Mono',
				cssVariable: '--code-font',
				provider: fontProviders.fontsource(),
				weights: [200, 300, 400, 500, 600, 700, 800],
				styles: ['normal', 'italic'],
				subsets: ['latin'],
			},
			{
				name: 'M PLUS Rounded 1c',
				cssVariable: '--sub-font',
				provider: fontProviders.fontsource(),
				weights: [100, 300, 400, 500, 700, 800, 900],
				styles: ['normal'],
				subsets: ['latin'],
			},
		],
		svgo: true,
	},
});
