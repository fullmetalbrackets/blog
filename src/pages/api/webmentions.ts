export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
	const target = url.searchParams.get('target');

	if (!target) {
		return new Response('Missing target parameter', { status: 400 });
	}

	try {
		const response = await fetch(
			`https://webmention.io/api/mentions.atom?target=${encodeURIComponent(target)}&per-page=50`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch from webmention.io');
		}

		const atomText = await response.text();

		return new Response(atomText, {
			status: 200,
			headers: {
				'Content-Type': 'application/atom+xml',
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
			},
		});
	} catch (error) {
		console.error('Webmentions API error:', error);
		return new Response('Failed to fetch webmentions', { status: 500 });
	}
};
