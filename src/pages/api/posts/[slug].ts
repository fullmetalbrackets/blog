import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
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

  const url = new URL(request.url);
  const formatParam = url.searchParams.get('format');
  const acceptHeader = request.headers.get('Accept') ?? '';
  const wantsMarkdown =
    formatParam === 'markdown' || acceptHeader.includes('text/markdown');

  if (wantsMarkdown) {
    const frontmatter = [
      '---',
      `title: "${post.data.title}"`,
      `description: "${post.data.description}"`,
      `pubDate: "${post.data.pubDate.toISOString()}"`,
      post.data.updatedDate
        ? `updatedDate: "${post.data.updatedDate.toISOString()}"`
        : null,
      `tags: [${post.data.tags.map((t: string) => `"${t}"`).join(', ')}]`,
      `slug: "${post.id}"`,
      '---',
    ]
      .filter(Boolean)
      .join('\n');

    return new Response(`${frontmatter}\n\n${post.body}`, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
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
