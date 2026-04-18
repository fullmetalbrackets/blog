// src/pages/api/posts/[slug].ts
import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
	const { slug } = params;

	if (!slug) {
		return new Response(JSON.stringify({ error: 'No slug provided' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const post = await getEntry('blog', slug);

	if (!post) {
		return new Response(JSON.stringify({ error: 'Post not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(
		JSON.stringify({
			slug: post.id,
			title: post.data.title,
			description: post.data.description,
			tags: post.data.tags,
			related: post.data.related ?? [],
			pubDate: post.data.pubDate,
			updatedDate: post.data.updatedDate ?? null,
			body: post.body,
		}),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		}
	);
};
