import type { CollectionEntry } from 'astro:content';
import type { MarkdownHeading, Page } from 'astro';
import type { ImageMetadata } from 'astro';

// BaseHead.astro
export interface BaseHeadProps {
  title: string;
  description: string;
  image?: ImageMetadata;
  ogType?: string;
}

// BlogPosting.astro, BlogPost.astro
export type BlogData = CollectionEntry<'blog'>['data'];

export interface BlogPostProps extends BlogData {
  headings: MarkdownHeading[];
  readingTime: string;
}

// [...page].astro
export type BlogPageProps = {
  page: Page<CollectionEntry<'blog'> & { readingTime: string }>;
};

// [...slug].astro
export type BlogSlugProps = {
  post: CollectionEntry<'blog'>;
};