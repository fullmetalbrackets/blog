import { defineLiveCollection } from 'astro:content';
import { liveFeedLoader } from '@ascorbic/feed-loader';

const notes = defineLiveCollection({
	type: 'live',
	loader: liveFeedLoader({
		url: 'https://ariel.lol/rss.xml',
	}) as any,
});

export const collections = { notes };
