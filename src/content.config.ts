import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			tags: z.array(z.string()),
			related1: z.string().optional(),
			related2: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			image: image().optional(),
		}),
});

const links = defineCollection({
	loader: glob({ pattern: '**/[^_]*.yml', base: './src/content/links' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		url: z.string().url(),
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
		}),
});

const lifestream = defineCollection({
	loader: glob({ pattern: '**/[^_]*.yml', base: './src/content/lifestream' }),
	schema: ({ image }) =>
		z.object({
			// required
			type: z.enum([
				'movie',
				'tvshow',
				'book',
				'game',
				'quote',
				'note',
				'youtube',
				'image',
			]),
			title: z.string(),
			pubDate: z.coerce.date(),
			// common fields
			description: z.string().optional(),
			url: z.string().url().optional(),
			note: z.string().optional(),
			startDate: z.date().optional(),
			endDate: z.date().optional(),
			genre: z.array(z.string()).optional(),
			publisher: z.string().optional(),
			platform: z.array(z.string()).optional(),
			image: image().optional(),
			dbid: z.number().optional(),
			// notes
			tag: z.string().optional(),
			// movies
			director: z.string().optional(),
			stars: z.array(z.string()).optional(),
			// books
			author: z.string().optional(),
			isbn: z.number().optional(),
			// games
			developer: z.string().optional(),
			completed: z.boolean().default(true),
			steamdb: z.number().optional(),
			// tvshows
			inProgress: z.boolean().optional().default(false),
			current: z.boolean().optional(),
			seasons: z.number().max(99).optional(),
			// youtube
			videoId: z.string().optional(),
			// quotes
			quote: z.string().optional(),
			attribution: z.string().optional(),
		}),
});

const digest = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: './src/content/digest' }),
	schema: ({ image }) =>
		z.object({
			// required
			type: z.enum(['movie', 'tvshow', 'game', 'book']),
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			image: image(),
			// movies & tvshows
			tmdb: z.number().optional(),
			// tvshows
			season: z.number().max(15).optional(),
			// books
			isbn: z.number().optional(),
			// games
			platform: z.string().optional(),
			completed: z.boolean().optional(),
			steamdb: z.number().optional(),
			moby: z.number().optional(),
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

export const collections = { blog, links, wiki, lifestream, digest, games };
