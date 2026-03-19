export const prerender = true;

import { resolve } from 'node:path';
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const collectionEntries = await getCollection('blog');

const pages = Object.fromEntries(
	collectionEntries.map(({ id, data }) => [id, data])
);

export const { getStaticPaths, GET } = await OGImageRoute({
	param: 'route',

	pages: pages,

	getImageOptions: (path, page) => ({
		title: page.title,
		description: page.description,
		logo: {
			path: resolve(process.cwd(), 'img/long-logo.png'),
		},
		font: {
			title: {
				families: ['AtkinsonHyperlegibleNext'],
				weight: 'ExtraBold',
				color: [255, 255, 255],
				size: 52,
				lineHeight: 1.1,
			},
			description: {
				families: ['AtkinsonHyperlegibleNext'],
				weight: 'Normal',
				color: [164, 174, 188],
				size: 24,
				lineHeight: 1.3,
			},
		},
		bgGradient: [[32, 33, 36]],
		fonts: [
			resolve(process.cwd(), 'fonts/AtkinsonHyperlegibleNext-Regular.ttf'),
			resolve(process.cwd(), 'fonts/AtkinsonHyperlegibleNext-ExtraBold.ttf'),
		],
	}),
});
