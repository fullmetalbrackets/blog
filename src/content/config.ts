import { defineCollection, z } from 'astro:content';

const links = defineCollection({
	// Type-check frontmatter using a schema
	type: 'data',
	schema: z.object({

		title: z.string(),
		description: z.string(),
		url: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
	}),
});

export const collections = { links };