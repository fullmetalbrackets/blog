import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { feedLoader } from '@ascorbic/feed-loader';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			tags: z.array(z.string()),
			related: z.array(z.string()).optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			image: image().optional(),
			howto: z.boolean().optional(),
		}),
});

const links = defineCollection({
	loader: glob({ pattern: '**/[^_]*.yml', base: './src/content/links' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		url: z.url(),
		tag: z.string(),
		pubDate: z.coerce.date(),
	}),
});

const wiki = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: './src/content/wiki' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tag: z.string(),
			image: image().optional(),
			related: z.array(z.string()).optional(),
		}),
});

const lifestream = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: './src/content/lifestream' }),
	schema: ({ image }) =>
		z.object({
			// required
			type: z.enum(['movie', 'tvshow', 'book', 'game']),
			rating: z.enum(['hated', 'disliked', 'liked', 'loved', 'masterpiece']),
			image: image(),
			title: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			platform: z.string().optional(),
			season: z.number().optional(),
		}),
});

const games = defineCollection({
	loader: glob({ pattern: '**/games.json', base: './src/content/games' }),
	schema: ({ image }) =>
		z.object({
			games: z.record(
				z.string(),
				z.array(
					z.object({
						title: z.string(),
						image: image().optional(),
						moby: z.number().optional(),
						steamdb: z.number().optional(),
					})
				)
			),
		}),
});

const now = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/now' }),
	schema: ({ image }) =>
		z.object({
			pubDate: z.coerce.date(),
			image: image().optional(),
		}),
});

const notes = defineCollection({
	loader: feedLoader({
		url: 'https://ariel.lol/rss.xml',
	}),
});

export const collections = {
	blog,
	links,
	wiki,
	lifestream,
	games,
	now,
	notes,
};
