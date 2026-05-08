import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

  const sorted = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => {
      const slug = post.id.replace(/\.mdx?$/, '');
      return {
        slug,
        title: post.data.title,
        description: post.data.description,
        tags: post.data.tags,
        pubDate: post.data.pubDate,
        url: `https://fullmetalbrackets.com/api/posts/${slug}`,
      };
    });

  return new Response(JSON.stringify({ posts: sorted }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
