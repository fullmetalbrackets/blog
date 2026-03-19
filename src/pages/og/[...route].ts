export const prerender = true;

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
			path: new URL('../../img/assets/long-logo.png', import.meta.url).pathname,
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
			new URL(
				'../../../public/fonts/AtkinsonHyperlegibleNext-Regular.ttf',
				import.meta.url
			).pathname,
			new URL(
				'../../../public/fonts/AtkinsonHyperlegibleNext-ExtraBold.ttf',
				import.meta.url
			).pathname,
		],
	}),
});
