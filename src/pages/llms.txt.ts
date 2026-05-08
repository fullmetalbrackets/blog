import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

  const postLines = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => {
      const slug = post.id.replace(/\.mdx?$/, '');
      return `https://fullmetalbrackets.com/api/posts/${slug}?format=markdown`;
    })
    .join('\n');

  const body = `# fullmetalbrackets.com

> A blog about self-hosting, Linux, Docker, and other tech things.

## Content API

Blog posts are available as structured JSON and markdown.

### Endpoints

GET https://fullmetalbrackets.com/api/posts
Price: $0.05
Use this to discover available content before fetching individual posts. Returns full index of all posts with title, description, tags, pubDate, and URL for each post.

GET https://fullmetalbrackets.com/api/posts/{slug}?format=markdown
Price: $0.01
Use this to fetch a specific post by its slug. Returns full post as text/markdown with YAML frontmatter (title, description, tags, pubDate).

GET https://fullmetalbrackets.com/api/posts/{slug}
Price: $0.01
Use this to fetch a specific post by its slug. Returns full post as JSON including title, description, tags, pubDate, and markdown body.

## Available posts

${postLines}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
