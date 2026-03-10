interface Webmention {
	'wm-property': string;
	'wm-target'?: string;
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

	// Get the current page path (without hash or query params)
	const currentPath = window.location.pathname;

	try {
		// Fetch all webmentions for the domain
		const response = await fetch(
			`https://webmention.io/api/mentions.jf2?domain=https://fullmetalbrackets.com&per-page=1000`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch webmentions');
		}

		const data: WebmentionResponse = await response.json();

		// Filter to only mentions for this specific page (ignoring hash fragments)
		const mentions: Webmention[] = (data.children || []).filter(
			(mention: Webmention) => {
				if (!mention['wm-target']) return false;
				try {
					const targetPath = new URL(mention['wm-target']).pathname;
					return targetPath === currentPath;
				} catch {
					return false;
				}
			}
		);

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

		// Display likes with author info
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

		// Display reposts with author info
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

		// Display replies and mentions
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
