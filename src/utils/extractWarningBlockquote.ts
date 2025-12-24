export interface ExtractedWarning {
  hasWarning: boolean;
  warningHtml: string;
  remainingHtml: string;
}

export function extractWarningBlockquote(html: string): ExtractedWarning {
  const trimmedHtml = html.trim();

  const blockquoteMatch = trimmedHtml.match(/^<blockquote>([\s\S]*?)<\/blockquote>/);

  if (!blockquoteMatch) {
    return {
      hasWarning: false,
      warningHtml: '',
      remainingHtml: html
    };
  }

  const blockquoteContent = blockquoteMatch[0];
  const innerContent = blockquoteMatch[1];

  const warningMatch = innerContent.match(/^\s*<p>\s*\[warning\]/i);

  if (!warningMatch) {
    return {
      hasWarning: false,
      warningHtml: '',
      remainingHtml: html
    };
  }

  const remainingHtml = trimmedHtml.slice(blockquoteMatch[0].length).trim();

  return {
    hasWarning: true,
    warningHtml: blockquoteContent,
    remainingHtml: remainingHtml
  };
}