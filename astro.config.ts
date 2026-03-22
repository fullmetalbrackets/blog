import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/utils/remark-reading-time.ts';
import rehypeExternalLinks from 'rehype-external-links';
import remarkDirective from 'remark-directive';
import remarkDirectiveSugar from 'remark-directive-sugar';
import yeskunallumami from '@yeskunall/astro-umami';
import rehypeCodeblockCopy from './src/utils/rehype-codeblock-copy.ts';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import cloudflare from '@astrojs/cloudflare';
import astroCompress from 'gab-astro-compress';

export default defineConfig({
	site: 'https://fullmetalbrackets.com',

	build: {
		inlineStylesheets: 'always',
	},

	integrations: [
		mdx(),
		sitemap(),
		astroCompress(),
		yeskunallumami({
			id: 'd9921361-56b2-4c33-8377-4c73cb1add2d',
			hostUrl: 'https://u.adiaz.fyi',
		}),
	],

	prefetch: true,

	markdown: {
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: 'prepend',
					test: 'h2',
					properties: {
						class: 'h2 heading-link',
						ariaLabel: 'Link to this section',
					},
					content: {
						type: 'element',
						tagName: 'span',
						properties: { className: ['link-icon'] },
					},
				},
			],
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

	redirects: {
		'/blog/tailscale/': {
			status: 302,
			destination:
				'/blog/comprehensive-guide-tailscale-securely-access-home-network/',
		},
		'/shelf/': {
			status: 301,
			destination: '/lifestream/',
		},
		'/shelf/movies': {
			status: 301,
			destination: '/lifestream/older/movies/',
		},
		'/shelf/tvshows/': {
			status: 301,
			destination: '/lifestream/older/tvshows/',
		},
		'/digest/': {
			status: 301,
			destination: '/lifestream/',
		},
		'/digest/movies': {
			status: 301,
			destination: '/lifestream/older/movies/',
		},
		'/digest/tvshows/': {
			status: 301,
			destination: '/lifestream/older/tvshows/',
		},
	},
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

	experimental: {
		svgo: true,
	},
	output: 'server',
	adapter: cloudflare({
		imageService: 'compile',
	}),
	vite: {
		ssr: {
			external: ['sharp'],
		},
	},
});
