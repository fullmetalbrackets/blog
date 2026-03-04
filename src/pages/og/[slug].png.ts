import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id.replace(/\.mdx?$/, '') },
  }));
}

export const GET: APIRoute = async ({ params }) => {
  const posts = await getCollection('blog');
  const post = posts.find(p => p.id.replace(/\.mdx?$/, '') === params.slug);

  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  const { title, description, tags } = post.data;

  const mainFontRegular = readFileSync(resolve('./public/fonts/AtkinsonHyperlegibleNext-Regular.ttf'));
  const mainFontBold = readFileSync(resolve('./public/fonts/AtkinsonHyperlegibleNext-ExtraBold.ttf'));
  const subFontRegular = readFileSync(resolve('./public/fonts/MPLUSRounded1c-Regular.ttf'));
  const subFontBold = readFileSync(resolve('./public/fonts/MPLUSRounded1c-Bold.ttf'));

  const logoData = readFileSync(resolve('./public/favicon-96x96.png'));
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'rgb(32, 33, 36)',
          padding: '60px',
          fontFamily: 'Atkinson',
        },
        children: [
          // Top bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: logoBase64,
                    width: 48,
                    height: 48,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'M PLUS Rounded 1c',
                      fontSize: '22px',
                      fontWeight: 400,
                      color: 'rgb(90, 194, 175)',
                      letterSpacing: '-0.5px',
                    },
                    children: 'fullmetalbrackets.com',
                  },
                },
              ],
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                fontSize: title.length > 50 ? '52px' : '64px',
                fontWeight: 800,
                color: 'rgb(255, 255, 255)',
                lineHeight: 1.1,
                maxWidth: '1080px',
              },
              children: title,
            },
          },
          // Bottom row — description + tags
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '24px',
                      color: 'rgb(164, 174, 188)',
                      lineHeight: 1.3,
                      maxWidth: '1000px',
                    },
                    children: description,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                    },
                    children: tags.slice(0, 4).map((tag: string) => ({
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'M PLUS Rounded 1c',
                          backgroundColor: 'rgb(255, 221, 0)',
                          color: 'rgb(32, 33, 36)',
                          padding: '4px 12px 3px 12px',
                          borderRadius: '4px',
                          fontSize: '18px',
                          fontWeight: 700,
                        },
                        children: tag,
                      },
                    })),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Atkinson', data: mainFontRegular, weight: 400, style: 'normal' },
        { name: 'Atkinson', data: mainFontBold, weight: 800, style: 'normal' },
        { name: 'M PLUS Rounded 1c', data: subFontRegular, weight: 400, style: 'normal' },
        { name: 'M PLUS Rounded 1c', data: subFontBold, weight: 700, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render().asPng();

  return new Response(pngData as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};