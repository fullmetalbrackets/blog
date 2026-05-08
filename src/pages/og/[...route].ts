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
      path: resolve(process.cwd(), 'src/img/assets/long-logo.png'),
    },
    font: {
      title: {
        families: ['Nunito'],
        weight: 'Black',
        color: [255, 255, 255],
        size: 48,
        lineHeight: 1.1,
      },
      description: {
        families: ['AtkinsonHyperlegibleNext'],
        weight: 'Normal',
        color: [164, 174, 188],
        size: 24,
        lineHeight: 1.6,
      },
    },
    bgGradient: [[32, 33, 36]],
    border: { color: [110, 198, 186], width: 4, side: 'inline-start' },
    fonts: [
      resolve(
        process.cwd(),
        'public/fonts/AtkinsonHyperlegibleNext-Regular.ttf'
      ),
      resolve(process.cwd(), 'public/fonts/Nunito-Black.ttf'),
    ],
  }),
});
