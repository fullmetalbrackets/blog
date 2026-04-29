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

Blog posts are available as structured JSON via a paid API using x402 payments (USDC on Base).

### Endpoints

GET https://fullmetalbrackets.com/api/posts
Price: $0.05
Returns: Full index of all posts with title, description, tags, pubDate, and URL for each post.
Use this to discover available content before fetching individual posts.

GET https://fullmetalbrackets.com/api/posts/{slug}
Price: $0.01
Returns: Full post content including title, description, tags, pubDate, and body (markdown).
Use this to fetch a specific post by its slug.

## Available posts

${postLines}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain' },
	});
};
