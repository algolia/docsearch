import { marked, type Tokens } from 'marked';

import { escapeHtml, sanitizeUrl } from './sanitize';

const renderer = new marked.Renderer();

renderer.code = ({ text, lang = '', escaped }: Tokens.Code): string => {
  const languageClass = lang ? `language-${lang}` : '';
  const safeCode = escaped ? text : escapeHtml(text);
  const encodedCode = encodeURIComponent(text);

  const copyIconSvg = `<svg class="DocSearch-CodeSnippet-CopyIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>`;

  const checkIconSvg = `<svg class="DocSearch-CodeSnippet-CheckIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>`;

  return `
    <div class="DocSearch-CodeSnippet">
      <button class="DocSearch-CodeSnippet-CopyButton" data-code="${encodedCode}" aria-label="copy code">${copyIconSvg}${checkIconSvg}<span class="DocSearch-CodeSnippet-CopyButton-Label"></span></button>
      <pre><code class="${languageClass}">${safeCode}</code></pre>
    </div>
  `;
};

renderer.link = ({ href, title, text }: Tokens.Link): string => {
  const safeHref = escapeHtml(sanitizeUrl(href));
  const textEscaped = escapeHtml(text);

  if (!safeHref) {
    return textEscaped;
  }

  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  return `<a href="${safeHref}"${titleAttr} target="_blank" rel="noopener noreferrer">${textEscaped}</a>`;
};

renderer.image = ({ href, title, text }: Tokens.Image): string => {
  const safeHref = escapeHtml(sanitizeUrl(href));
  if (!safeHref) {
    return escapeHtml(text);
  }

  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  return `<img src="${safeHref}" alt="${escapeHtml(text)}"${titleAttr} />`;
};

// Escape raw HTML so LLM / markdown HTML is never executed in the DOM
renderer.html = ({ text }: Tokens.HTML | Tokens.Tag): string => escapeHtml(text);

/**
 * Parses markdown into HTML safe for `dangerouslySetInnerHTML`.
 * Escapes raw HTML and blocks unsafe link/image schemes (for example, javascript:).
 */
export function parseMarkdownToSafeHtml(content: string): string {
  return marked.parse(content, {
    gfm: true,
    breaks: true,
    renderer,
  }) as string;
}
