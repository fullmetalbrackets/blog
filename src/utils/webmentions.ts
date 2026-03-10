interface Webmention {
	'wm-property': string;
	author?: {
		name?: string;
		photo?: string;
	};
	content?: {
		text?: string;
		html?: string;
	};
	published?: string;
	url?: string;
	id?: string;
}

interface WebmentionGroup {
	likes: Webmention[];
	reposts: Webmention[];
	replies: Webmention[];
	mentions: Webmention[];
}

interface WebmentionResponse {
	children: Webmention[];
}

export async function loadWebmentions(): Promise<void> {
	const container = document.getElementById('webmentions-container');
	if (!container) return;

	// Get the full current URL (including any hash)
	const fullUrl = window.location.href;

	// Also get URL without hash for JF2 query
	let baseUrl = fullUrl.split('#')[0];
	if (!baseUrl.endsWith('/')) {
		baseUrl = baseUrl + '/';
	}

	try {
		const mentions: Webmention[] = [];
		const seenIds = new Set<string>();

		// First: Fetch JF2 for rich data like author photos
		try {
			const jf2Response = await fetch(
				`https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(baseUrl)}&per-page=50`
			);

			if (jf2Response.ok) {
				const jf2Data: WebmentionResponse = await jf2Response.json();
				(jf2Data.children || []).forEach((mention: any) => {
					const id = mention['wm-id'] || mention.url;
					if (id && !seenIds.has(id)) {
						seenIds.add(id);
						mentions.push({
							'wm-property': mention['wm-property'],
							author: mention.author,
							content: mention.content,
							published: mention.published,
							url: mention.url,
							id: id,
						});
					}
				});
			}
		} catch (jf2Error) {
			console.warn('JF2 fetch failed:', jf2Error);
		}

		// Second: Fetch Atom feed via our proxy for base URL
		try {
			const atomResponse = await fetch(
				`/api/webmentions/?target=${encodeURIComponent(baseUrl)}`
			);

			if (atomResponse.ok) {
				const atomText = await atomResponse.text();
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(atomText, 'text/xml');
				const entries = xmlDoc.querySelectorAll('entry');

				entries.forEach((entry) => {
					const entryId = entry.querySelector('id')?.textContent || '';
					const summary = entry.querySelector('summary')?.textContent || '';
					const contentDiv = entry.querySelector('content div');
					const links = contentDiv?.querySelectorAll('a') || [];

					const sourceUrl = links[0]?.getAttribute('href') || '';
					const updated = entry.querySelector('updated')?.textContent || '';

					let wmProperty = 'mention-of';
					if (summary.includes('liked')) wmProperty = 'like-of';
					if (summary.includes('reposted')) wmProperty = 'repost-of';
					if (summary.includes('replied')) wmProperty = 'in-reply-to';

					const title = entry.querySelector('title')?.textContent || '';
					const authorMatch = title.match(
						/^(.+?)\s+(liked|mentioned|reposted|replied)/
					);
					const authorName = authorMatch ? authorMatch[1] : 'Anonymous';

					const atomId = entryId || sourceUrl;
					if (!seenIds.has(atomId) && !seenIds.has(sourceUrl)) {
						seenIds.add(atomId);
						seenIds.add(sourceUrl);
						mentions.push({
							'wm-property': wmProperty,
							url: sourceUrl,
							published: updated,
							author: { name: authorName },
							content: { text: '' },
							id: atomId,
						});
					}
				});
			}
		} catch (atomError) {
			console.warn('Atom fetch failed:', atomError);
		}

		// Third: Extract all heading IDs from the page and check for hash fragment mentions
		const headings = document.querySelectorAll(
			'h2[id], h3[id], h4[id], h5[id], h6[id]'
		);
		const hashesToCheck = Array.from(headings)
			.map((h) => h.id)
			.filter((id) => id); // Remove any empty IDs

		for (const hashId of hashesToCheck) {
			try {
				const urlWithHash = baseUrl.slice(0, -1) + '#' + hashId;
				const atomHashResponse = await fetch(
					`/api/webmentions/?target=${encodeURIComponent(urlWithHash)}`
				);

				if (atomHashResponse.ok) {
					const atomText = await atomHashResponse.text();
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(atomText, 'text/xml');
					const entries = xmlDoc.querySelectorAll('entry');

					entries.forEach((entry) => {
						const entryId = entry.querySelector('id')?.textContent || '';
						const summary = entry.querySelector('summary')?.textContent || '';
						const contentDiv = entry.querySelector('content div');
						const links = contentDiv?.querySelectorAll('a') || [];

						const sourceUrl = links[0]?.getAttribute('href') || '';
						const updated = entry.querySelector('updated')?.textContent || '';

						let wmProperty = 'mention-of';
						if (summary.includes('liked')) wmProperty = 'like-of';
						if (summary.includes('reposted')) wmProperty = 'repost-of';
						if (summary.includes('replied')) wmProperty = 'in-reply-to';

						const title = entry.querySelector('title')?.textContent || '';
						const authorMatch = title.match(
							/^(.+?)\s+(liked|mentioned|reposted|replied)/
						);
						const authorName = authorMatch ? authorMatch[1] : 'Anonymous';

						const atomId = entryId || sourceUrl;
						if (!seenIds.has(atomId) && !seenIds.has(sourceUrl)) {
							seenIds.add(atomId);
							seenIds.add(sourceUrl);
							mentions.push({
								'wm-property': wmProperty,
								url: sourceUrl,
								published: updated,
								author: { name: authorName },
								content: { text: '' },
								id: atomId,
							});
						}
					});
				}
			} catch (hashError) {
				console.warn(`Failed to fetch mentions for #${hashId}:`, hashError);
			}
		}

		if (mentions.length === 0) {
			container.innerHTML =
				'<p class="no-mentions">No mentions yet. Be the first to mention this post!</p>';
			return;
		}

		const grouped: WebmentionGroup = {
			likes: mentions.filter((m: Webmention) => m['wm-property'] === 'like-of'),
			reposts: mentions.filter(
				(m: Webmention) => m['wm-property'] === 'repost-of'
			),
			replies: mentions.filter(
				(m: Webmention) => m['wm-property'] === 'in-reply-to'
			),
			mentions: mentions.filter(
				(m: Webmention) => m['wm-property'] === 'mention-of'
			),
		};

		let html = '';

		if (grouped.likes.length > 0) {
			html += '<div class="webmention-section">';
			html += `<h4>Likes</h4>`;
			html += '<div class="webmention-faces">';
			grouped.likes.forEach((mention) => {
				const author = mention.author || {};
				html += `
					<div class="webmention-face">
						${author.photo ? `<a href="${mention.url}" target="_blank" rel="noopener noreferrer"><img src="${author.photo}" alt="${author.name || 'Anonymous'}" class="webmention-avatar-small"></a>` : ''}
					</div>
				`;
			});
			html += '</div></div>';
		}

		if (grouped.reposts.length > 0) {
			html += '<div class="webmention-section">';
			html += `<h4>Reposts</h4>`;
			html += '<div class="webmention-faces">';
			grouped.reposts.forEach((mention) => {
				const author = mention.author || {};
				html += `
					<div class="webmention-face">
						${author.photo ? `<a href="${mention.url}" target="_blank" rel="noopener noreferrer"><img src="${author.photo}" alt="${author.name || 'Anonymous'}" class="webmention-avatar-small"></a>` : ''}
						<a href="${mention.url}" target="_blank" rel="noopener noreferrer" class="webmention-author-name">${author.name || 'Anonymous'}</a>
					</div>
				`;
			});
			html += '</div></div>';
		}

		const displayMentions = [...grouped.replies, ...grouped.mentions];

		if (displayMentions.length > 0) {
			displayMentions.forEach((mention) => {
				const author = mention.author || {};
				const content = mention.content?.text || mention.content?.html || '';
				const published = mention.published
					? new Date(mention.published).toLocaleDateString()
					: '';

				html += `
          <div class="webmention">
            <div class="webmention-author">
              ${author.photo ? `<img src="${author.photo}" alt="${author.name || 'Anonymous'}" class="webmention-avatar">` : ''}
              <span>${author.name || 'Anonymous'}</span>
            </div>
            ${content ? `<div class="webmention-content">${content}</div>` : ''}
            <div class="webmention-meta">
              ${published ? `<time>${published}</time> · ` : ''}
              <a href="${mention.url}" target="_blank" rel="noopener noreferrer">View original</a>
            </div>
          </div>
        `;
			});
		}

		container.innerHTML = html;
	} catch (error) {
		console.error('Error fetching webmentions:', error);
		container.innerHTML =
			'<p class="no-mentions">Unable to load mentions at this time.</p>';
	}
}
