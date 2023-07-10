import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../config';

export async function get(context) {
  return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
    items: await pagesGlobToRssItems(
      import.meta.glob('./blog/*.{md,mdx}'),
    ),
  });
}