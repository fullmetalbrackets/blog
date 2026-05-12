import type { APIRoute } from 'astro';
import { getBlogroll } from '@utils/collections';
import { SITE_URL, SITE_TITLE } from '@consts';

export const GET: APIRoute = async () => {
  const blogs = await getBlogroll();

  const items = blogs
    .filter((blog) => blog.feed !== '#')
    .map(
      (blog) =>
        `    <outline type="rss" text="${blog.name}" title="${blog.name}" xmlUrl="${blog.feed}" htmlUrl="${blog.url}" />`
    )
    .join('\n');

  const opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${SITE_TITLE} Blogroll</title>
    <dateCreated>${new Date().toUTCString()}</dateCreated>
    <ownerName>${SITE_TITLE}</ownerName>
    <ownerId>${SITE_URL}</ownerId>
  </head>
  <body>
    <outline text="Blogroll" title="Blogroll">
${items}
    </outline>
  </body>
</opml>`;

  return new Response(opml, {
    headers: {
      'Content-Type': 'text/x-opml; charset=utf-8',
      'Content-Disposition': 'attachment; filename="blogroll.opml"',
    },
  });
};
