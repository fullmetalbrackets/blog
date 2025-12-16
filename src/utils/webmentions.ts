export async function loadWebmentions() {
  const container = document.getElementById('webmentions-container');
  if (!container) return;
  
  const currentUrl = window.location.href;
  
  try {
    const response = await fetch(
      `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(currentUrl)}&per-page=50`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch webmentions');
    }
    
    const data = await response.json();
    const mentions = data.children || [];
    
    if (mentions.length === 0) {
      container.innerHTML = '<p class="no-mentions">No mentions yet. Be the first to mention this post!</p>';
      return;
    }

    const grouped = {
      likes: mentions.filter(m => m['wm-property'] === 'like-of'),
      reposts: mentions.filter(m => m['wm-property'] === 'repost-of'),
      replies: mentions.filter(m => m['wm-property'] === 'in-reply-to'),
      mentions: mentions.filter(m => m['wm-property'] === 'mention-of')
    };
    
    let html = '';
    
    if (grouped.likes.length || grouped.reposts.length) {
      html += '<div class="webmention-stats">';
      if (grouped.likes.length) {
        html += `<span>👍 ${grouped.likes.length} like${grouped.likes.length !== 1 ? 's' : ''}</span>`;
      }
      if (grouped.reposts.length) {
        html += `<span>🔄 ${grouped.reposts.length} repost${grouped.reposts.length !== 1 ? 's' : ''}</span>`;
      }
      html += '</div>';
    }

    const displayMentions = [...grouped.replies, ...grouped.mentions];
    
    if (displayMentions.length > 0) {
      displayMentions.forEach(mention => {
        const author = mention.author || {};
        const content = mention.content?.text || mention.content?.html || '';
        const published = mention.published ? new Date(mention.published).toLocaleDateString() : '';
        
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
    container.innerHTML = '<p class="no-mentions">Unable to load mentions at this time.</p>';
  }
}