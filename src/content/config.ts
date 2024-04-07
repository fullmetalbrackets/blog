import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		tags: z.array(z.string()),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const links = defineCollection({
	// Type-check frontmatter using a schema
	type: 'data',
	schema: z.object({

		title: z.string(),
		description: z.string(),
		url: z.string(),
		tags: z.array(z.string()),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
	}),
});

export const collections = { blog, links };
