import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		tags: z.array(z.string()),
		related1: z.string().optional(),
		related2: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
	}),
});

const links = defineCollection({
	loader: glob({ pattern: '**/[^_]*.yml', base: "./src/content/links" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		url: z.string(),
		tag: z.string(),
		pubDate: z.coerce.date(),
	}),
});

const wiki = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/wiki" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tag: z.string(),
	}),
});

export const collections = { blog, links, wiki };
