import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
	schema: ({ image }) => z.object({
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
	loader: glob({ pattern: '**/[^_]*.yml', base: "./src/content/links" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		url: z.string().url(),
		tag: z.string(),
		pubDate: z.coerce.date(),
	}),
});

const wiki = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/wiki" }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tag: z.string(),
		image: image().optional(),
	}),
});

const lifestream = defineCollection({
	loader: glob({ pattern: '**/[^_]*.yml', base: "./src/content/lifestream" }),
	schema: ({ image }) => z.object({
		// required
		type: z.enum(['movie', 'tvshow', 'book', 'game', 'quote', 'note', 'youtube', 'image']),
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
		// tvshows
		inProgress: z.boolean().optional().default(false),
		current: z.boolean().optional(),
		seasons: z.number().max(99).optional(),
		// youtube
		videoId: z.string().optional(),
		// quotes
		quote: z.string().optional(),
		attribution: z.string().optional(),
	})
});

export const collections = { blog, links, wiki, lifestream };