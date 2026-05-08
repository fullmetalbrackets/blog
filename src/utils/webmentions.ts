const BLOCKED_AUTHORS = new Set([
  'did:plc:3smd6p3dwdqpsqpmchafyydd',
  'beep.town/@echofeedamplify',
]);

interface Webmention {
  'wm-property': string;
  author?: {
    name?: string;
    photo?: string;
    url?: string;
  };
  content?: {
    text?: string;
    html?: string;
  };
  published?: string;
  url?: string;
}

interface WebmentionResponse {
  children: Webmention[];
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function avatarLink(m: Webmention, size: 'sm' | 'md' = 'sm'): string {
  const src = m.author?.photo ?? '';
  const name = esc(m.author?.name ?? 'Anonymous');
  const href = esc(m.url ?? m.author?.url ?? '#');
  if (!src) return '';
  return `
    <a href="${href}" target="_blank" rel="noopener noreferrer"
       title="${name}" class="wm-avatar wm-avatar--${size}">
      <img src="${esc(src)}" alt="${name}" loading="lazy"
           onerror="this.closest('a').style.display='none'">
    </a>`;
}

function buildFacepile(
  mentions: Webmention[],
  icon: string,
  label: string
): string {
  if (!mentions.length) return '';
  const count = mentions.length;
  const noun = count === 1 ? label : `${label}s`;

  return `
    <div class="wm-section">
      <h4 class="wm-section-label">
        <span class="wm-icon" aria-hidden="true">${icon}</span>
        ${count} ${noun}
      </h4>
      <div class="wm-facepile" role="list" aria-label="${esc(noun)}">
        ${mentions.map((m) => avatarLink(m, 'sm')).join('')}
      </div>
    </div>`;
}

function buildReplies(mentions: Webmention[]): string {
  if (!mentions.length) return '';
  const count = mentions.length;
  const noun = count === 1 ? 'reply' : 'replies';

  const items = mentions
    .map((m) => {
      const rawText = m.content?.text ?? '';
      const text =
        rawText.length > 400 ? esc(rawText.slice(0, 400)) + '…' : esc(rawText);
      const date = m.published ? formatDate(m.published) : '';
      const href = esc(m.url ?? '#');

      return `
        <div class="wm-reply" role="listitem">
          ${avatarLink(m, 'md')}
          <div class="wm-reply-body">
            ${text ? `<p class="wm-reply-text">${text}</p>` : ''}
            <a href="${href}" class="wm-reply-meta"
               target="_blank" rel="noopener noreferrer">
              ${date || 'view source'}
            </a>
          </div>
        </div>`;
    })
    .join('');

  return `
    <div class="wm-section">
      <h4 class="wm-section-label">
        <span class="wm-icon" aria-hidden="true">💬</span>
        ${count} ${noun}
      </h4>
      <div class="wm-replies" role="list" aria-label="Replies">
        ${items}
      </div>
    </div>`;
}

export async function loadWebmentions(): Promise<void> {
  const container = document.getElementById('webmentions-container');
  if (!container) return;

  const devUrl = (container as HTMLElement).dataset.targetUrl ?? '';
  let targetUrl = devUrl.trim() || window.location.href.split('#')[0];
  if (!targetUrl.endsWith('/')) targetUrl += '/';

  try {
    const res = await fetch(
      `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(targetUrl)}&per-page=200&sort-dir=up`
    );
    if (!res.ok) throw new Error(res.statusText);

    const data: WebmentionResponse = await res.json();
    const mentions: Webmention[] = (data.children ?? []).filter((m) => {
      const authorUrl = m.author?.url ?? '';
      const postUrl = m.url ?? '';
      return !Array.from(BLOCKED_AUTHORS).some(
        (b) => authorUrl.includes(b) || postUrl.includes(b)
      );
    });

    if (!mentions.length) {
      container.innerHTML = `<p class="wm-empty">No mentions yet — be the first!</p>`;
      return;
    }

    const likes = mentions.filter((m) => m['wm-property'] === 'like-of');
    const reposts = mentions.filter((m) => m['wm-property'] === 'repost-of');
    const replies = mentions.filter((m) =>
      ['in-reply-to', 'mention-of'].includes(m['wm-property'])
    );

    container.innerHTML =
      buildFacepile(likes, '♥', 'like') +
      buildFacepile(reposts, '↻', 'boost') +
      buildReplies(replies);
  } catch (err) {
    console.error('[webmentions]', err);
    container.innerHTML = `<p class="wm-error">Could not load mentions.</p>`;
  }
}
