export const prerender = true;

import { resolve } from 'node:path';
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { pages as sitePages, type Page } from '@data/pages';

type Template =
  | 'blog'
  | 'wiki'
  | 'site'
  | 'now'
  | 'lifestream'
  | 'links'
  | 'category';

type OGPageData = {
  title: string;
  description: string;
  _template: Template;
};

type TemplateConfig = {
  bgGradient:
    | [[number, number, number]]
    | [[number, number, number], [number, number, number]];
  border: {
    color: [number, number, number];
    width: number;
    side: 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
  };
};

const [blogEntries, wikiEntries, nowEntries, lifestreamEntries, linksEntries] =
  await Promise.all([
    getCollection('blog'),
    getCollection('wiki'),
    getCollection('now'),
    getCollection('lifestream'),
    getCollection('links'),
  ]);

const nowDescription =
  sitePages.find((p: Page) => p.href === '/now')?.description ?? '';

const typeLabels: Record<
  (typeof lifestreamEntries)[number]['data']['type'],
  string
> = {
  movie: 'Movie',
  tvshow: 'TV Show',
  book: 'Book',
  game: 'Game',
};

const SITE_TITLE = 'fullmetalbrackets.com';

const tags = [
  ...new Set(
    blogEntries.flatMap((post) =>
      post.data.tags.map((tag) => tag.toLowerCase())
    )
  ),
];

const years = [
  ...new Set(
    blogEntries.map((post) => post.data.pubDate.getFullYear().toString())
  ),
];

const EXCLUDE = new Set(['blog/random', 'blank', 'search']);

const staticPages: Record<string, OGPageData> = Object.fromEntries(
  sitePages
    .filter((p: Page) => !EXCLUDE.has(p.href.replace(/^\//, '')))
    .map((p: Page) => [
      p.href.replace(/^\//, ''),
      {
        title: p.title,
        description: p.description,
        _template: 'site' as const,
      },
    ])
);

const pages: Record<string, OGPageData> = {
  ...Object.fromEntries(
    blogEntries.map(({ id, data }) => [
      id,
      {
        title: data.title,
        description: data.description,
        _template: 'blog' as const,
      },
    ])
  ),
  ...Object.fromEntries(
    years.map((year) => [
      `blog/years/${year}`,
      {
        title: `Blog - ${year}`,
        description: `Blog posts published in ${year}.`,
        _template: 'site' as const,
      },
    ])
  ),
  ...Object.fromEntries(
    wikiEntries.map(({ id, data }) => [
      id,
      {
        title: data.title,
        description: data.description,
        _template: 'wiki' as const,
      },
    ])
  ),
  ...Object.fromEntries(
    nowEntries.map(({ id, data }) => [
      id,
      {
        title: `Now — ${data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`,
        description: nowDescription,
        _template: 'now' as const,
      },
    ])
  ),
  ...Object.fromEntries(
    lifestreamEntries.map(({ id, data }) => [
      id,
      {
        title: data.title,
        description: `Lifestream · ${typeLabels[data.type]}`,
        _template: 'lifestream' as const,
      },
    ])
  ),
  ...Object.fromEntries(
    linksEntries.map(({ id, data }) => [
      id,
      {
        title: data.title,
        description: data.title,
        _template: 'links' as const,
      },
    ])
  ),
  ...Object.fromEntries(
    tags.map((tag) => {
      const tagTitle = tag
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return [
        `categories/${tag}`,
        {
          title: `Posts tagged ${tagTitle}`,
          description: `A collection of posts about ${tagTitle} on ${SITE_TITLE}`,
          _template: 'category' as const,
        },
      ];
    })
  ),
  ...staticPages,
};

const FONTS = [
  resolve(process.cwd(), 'public/fonts/AtkinsonHyperlegibleNext-Regular.ttf'),
  resolve(process.cwd(), 'public/fonts/Nunito-Black.ttf'),
];

const LOGO = { path: resolve(process.cwd(), 'src/img/assets/long-logo.png') };

const FONT_STYLES = {
  title: {
    families: ['Nunito'],
    weight: 'Black' as const,
    color: [255, 255, 255] as [number, number, number],
    size: 60,
    lineHeight: 1.1,
  },
  description: {
    families: ['AtkinsonHyperlegibleNext'],
    weight: 'Normal' as const,
    color: [164, 174, 188] as [number, number, number],
    size: 32,
    lineHeight: 1.3,
  },
};

const DEFAULT_STYLE: TemplateConfig = {
  bgGradient: [[32, 33, 36]],
  border: { color: [110, 198, 186], width: 4, side: 'inline-start' },
};

const templates: Record<Template, TemplateConfig> = {
  blog: DEFAULT_STYLE,
  wiki: DEFAULT_STYLE,
  now: DEFAULT_STYLE,
  lifestream: DEFAULT_STYLE,
  links: DEFAULT_STYLE,
  site: DEFAULT_STYLE,
  category: DEFAULT_STYLE,
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page: OGPageData) => ({
    title: page.title,
    description: page.description,
    logo: LOGO,
    font: FONT_STYLES,
    fonts: FONTS,
    ...templates[page._template],
  }),
});
