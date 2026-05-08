import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '@consts';
import { getSortedPosts } from '@utils/collections';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();
  const siteUrl = context.site?.toString() || 'https://fullmetalbrackets.com';

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: siteUrl,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
      customData: `<media:content url="${siteUrl}og/${post.id}.png" medium="image" type="image/png" width="1200" height="630" />`,
    })),
    stylesheet: '/rss.xsl',
  });
}
