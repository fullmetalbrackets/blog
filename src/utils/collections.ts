import { getCollection, render } from 'astro:content';

// Get all blog posts sorted by date descending
export async function getSortedPosts() {
  return (await getCollection('blog'))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      ...post,
      data: {
        ...post.data,
        tags: [...(post.data.tags ?? [])].sort((a, b) => a.localeCompare(b)),
      },
    }));
}

// Get all blog posts with reading time attached
export async function getPostsWithReadingTime() {
  const posts = await getSortedPosts();
  return Promise.all(
    posts.map(async (post) => {
      const { remarkPluginFrontmatter } = await render(post);
      return {
        ...post,
        readingTime: remarkPluginFrontmatter.readingTime as string,
      };
    })
  );
}

// Get posts filtered by tag
export async function getPostsByTag(tag: string) {
  const posts = await getSortedPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

// Get all posts grouped by year
export async function getPostsByYearMap() {
  const posts = await getPostsWithReadingTime();
  return posts.reduce(
    (acc, post) => {
      const year = post.data.pubDate.getFullYear().toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    },
    {} as Record<string, Awaited<ReturnType<typeof getPostsWithReadingTime>>>
  );
}

// Get all tags with post counts, sorted alphabetically
export async function getSortedTags() {
  const posts = await getSortedPosts();
  const tagCounts: Record<string, number> = {};
  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

// Get related posts by id
export async function getRelatedPosts(ids: (string | undefined)[]) {
  const posts = await getSortedPosts();
  return posts.filter((post) => ids.includes(post.id));
}

// Get a single post by id
export async function getPostById(id: string) {
  const posts = await getSortedPosts();
  return posts.find((post) => post.id === id);
}

// Get all links sorted by date descending
export async function getSortedLinks() {
  return (await getCollection('links')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

// Get all lifestream entries sorted by date descending
export async function getLifestream() {
  return (await getCollection('lifestream')).sort((a, b) => {
    const aDate = a.data.updatedDate ?? a.data.pubDate;
    const bDate = b.data.updatedDate ?? b.data.pubDate;
    return bDate.valueOf() - aDate.valueOf();
  });
}

// Get all entries in postroll by date descending
export async function getSortedPostroll() {
  return (await getCollection('postroll')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

export async function getBlogroll() {
  return (await getCollection('blogroll'))
    .map((entry) => ({ id: entry.id, ...entry.data }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Get all notes by date descending
export async function getSortedNotes() {
  return (await getCollection('notes')).sort(
    (a, b) =>
      new Date(b.data.published ?? 0).valueOf() -
      new Date(a.data.published ?? 0).valueOf()
  );
}

import type { ImageMetadata } from 'astro';

export type FirehoseEntry = {
  type:
    | 'blog'
    | 'link'
    | 'wiki'
    | 'lifestream'
    | 'now'
    | 'note'
    | 'blogroll'
    | 'postroll';
  title: string;
  date: Date;
  slug?: string;
  url?: string;
  tags?: string[];
  mediaType?: string;
  image?: ImageMetadata | string;
  imageAlt?: string;
  content?: string;
};

export async function getFirehose(): Promise<FirehoseEntry[]> {
  const [
    posts,
    links,
    wikiEntries,
    lifestreamEntries,
    nowEntries,
    notesEntries,
    blogrollEntries,
    postrollEntries,
  ] = await Promise.all([
    getCollection('blog'),
    getCollection('links'),
    getCollection('wiki'),
    getCollection('lifestream'),
    getCollection('now'),
    getCollection('notes'),
    getCollection('blogroll'),
    getCollection('postroll'),
  ]);

  const entries: FirehoseEntry[] = [
    ...posts.map((e) => ({
      type: 'blog' as const,
      title: e.data.title,
      date: e.data.pubDate,
      slug: `/blog/${e.id}`,
      tags: e.data.tags,
    })),
    ...links.map((e) => ({
      type: 'link' as const,
      title: e.data.title,
      date: e.data.pubDate,
      url: e.data.url,
      tags: [e.data.tag],
    })),
    ...wikiEntries.map((e) => ({
      type: 'wiki' as const,
      title: e.data.title,
      date: e.data.pubDate,
      slug: `/wiki/${e.id}`,
      tags: [e.data.tag],
    })),
    ...lifestreamEntries.map((e) => ({
      type: 'lifestream' as const,
      title: e.data.title,
      date: e.data.updatedDate ?? e.data.pubDate,
      slug: `/lifestream/${e.id}`,
      mediaType: e.data.type,
      image: e.data.image,
    })),
    ...nowEntries.map((e) => ({
      type: 'now' as const,
      title: `Now — ${e.data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`,
      date: e.data.pubDate,
      slug: `/now/${e.id}`,
    })),
    ...notesEntries.map((e) => {
      const content = e.data.content as string | undefined;
      const imageUrl = (e.data.image as any)?.url as string | undefined;
      const imageAlt =
        content?.match(/<img[^>]*alt="([^"]*)"[^>]*>/)?.[1] ?? '';
      const cleanContent = content
        ?.replace(/<a[^>]*youtube\.com\/watch[^>]*>.*?<\/a>/g, '')
        ?.replace(/<img[^>]*>/g, '')
        .trim();
      return {
        type: 'note' as const,
        title: '',
        date: e.data.published
          ? new Date(e.data.published as string)
          : new Date(0),
        url: e.data.url as string,
        image: imageUrl,
        imageAlt,
        content: cleanContent,
      };
    }),
    ...blogrollEntries.map((e) => ({
      type: 'blogroll' as const,
      title: e.data.name,
      date: e.data.pubDate,
      url: e.data.url,
    })),
    ...postrollEntries.map((e) => ({
      type: 'postroll' as const,
      title: e.data.title,
      date: e.data.pubDate,
      url: e.data.url,
    })),
  ];

  return entries.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
