// src/pages/llms.txt.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
	const posts = await getCollection('blog');

	const postLines = posts
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.map((post) => {
			const slug = post.id.replace(/\.mdx?$/, '');
			return `https://fullmetalbrackets.com/api/posts/${slug}`;
		})
		.join('\n');

	const body = `# fullmetalbrackets.com

> A blog about self-hosting, Linux, Docker, and other tech things.

## Content API

Blog posts are available as structured JSON via a paid API.
Requires x402 payment of $0.01 USDC on Base per request.

GET https://fullmetalbrackets.com/api/posts/{slug}

## Available posts

${postLines}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain' },
	});
};
