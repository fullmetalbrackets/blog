import type { CollectionEntry } from 'astro:content';
import type { MarkdownHeading, Page } from 'astro';
import type { ImageMetadata } from 'astro';

// components/BaseHead.astro
export interface BaseHeadProps {
	title: string;
	description: string;
	image?: ImageMetadata;
	ogType?: string;
}

// components/BlogPosting.astro & components/BlogPost.astro
export type BlogData = CollectionEntry<'blog'>['data'];

// layouts/BlogPost.astro
export interface BlogPostProps extends BlogData {
	headings: MarkdownHeading[];
	readingTime: string;
}

// blog/[...page].astro
export type BlogPageProps = {
	page: Page<CollectionEntry<'blog'> & { readingTime: string }>;
};

// blog/[...slug].astro
export type BlogSlugProps = {
	post: CollectionEntry<'blog'>;
};

// blog/years/[year].astro
export type BlogYearProps = {
	posts: CollectionEntry<'blog'>[];
	postsByYear: Record<string, CollectionEntry<'blog'>[]>;
};

// categories/[tag].astro
export type BlogTagProps = {
	tag: string;
	posts: (CollectionEntry<'blog'> & { readingTime: string })[];
};
