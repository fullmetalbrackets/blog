import { SITE_TITLE, SITE_DESCRIPTION } from '@consts';
import { getSortedPosts } from '@utils/collections';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();
  const siteUrl = context.site?.toString() ?? 'https://fullmetalbrackets.com';

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}feed.json`,
    items: posts.map((post) => ({
      id: `${siteUrl}blog/${post.id}/`,
      url: `${siteUrl}blog/${post.id}/`,
      title: post.data.title,
      summary: post.data.description ?? '',
      date_published: new Date(post.data.pubDate).toISOString(),
      image: `${siteUrl}og/${post.id}.png`,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  });
}
