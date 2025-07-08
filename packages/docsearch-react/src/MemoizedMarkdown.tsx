import { marked, type Tokens } from 'marked';
import React, { memo, useMemo, useEffect, useRef } from 'react';

// escape html special chars for safe insertion into pre/code blocks
function escapeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const renderer = new marked.Renderer();

renderer.code = ({ text, lang = '', escaped }: Tokens.Code): string => {
  const languageClass = lang ? `language-${lang}` : '';
  const safeCode = escaped ? text : escapeHtml(text);
  const encodedCode = encodeURIComponent(text);

  // svg icons (copy & check)
  const copyIconSvg = `<svg class="DocSearch-CodeSnippet-CopyIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>`;

  const checkIconSvg = `<svg class="DocSearch-CodeSnippet-CheckIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>`;

  return `
    <div class="DocSearch-CodeSnippet">
      <button class="DocSearch-CodeSnippet-CopyButton" data-code="${encodedCode}" aria-label="copy code">${copyIconSvg}${checkIconSvg}<span class="DocSearch-CodeSnippet-CopyButton-Label"></span></button>
      <pre><code class="${languageClass}">${safeCode}</code></pre>
    </div>
  `;
};

// ensure all markdown links open in a new tab with rel noopener for security
renderer.link = ({ href, title, text }: Tokens.Link): string => {
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  const hrefAttr = href ? escapeHtml(href) : '';
  const textEscaped = escapeHtml(text);
  return `<a href="${hrefAttr}"${titleAttr} target="_blank" rel="noopener noreferrer">${textEscaped}</a>`;
};

export const MemoizedMarkdown = memo(
  ({
    content,
    copyButtonText,
    copyButtonCopiedText,
    isStreaming,
  }: {
    content: string;
    copyButtonText: string;
    copyButtonCopiedText: string;
    isStreaming: boolean;
  }) => {
    const html = useMemo(
      () =>
        marked.parse(content, {
          gfm: true,
          breaks: true,
          renderer,
        }),
      [content],
    );

    // container ref to scope dom queries and events
    const containerRef = useRef<HTMLDivElement>(null);

    // setup copy buttons whenever content or translations change
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('.DocSearch-CodeSnippet-CopyButton'));

      buttons.forEach((btn) => {
        const label = btn.querySelector<HTMLElement>('.DocSearch-CodeSnippet-CopyButton-Label');
        if (label) label.textContent = copyButtonText;

        // ensure icons initial visibility
        btn.classList.remove('DocSearch-CodeSnippet-CopyButton--copied');
      });

      function handleClick(event: MouseEvent): void {
        const targetEl = event.target as HTMLElement;
        const btn = targetEl.closest<HTMLButtonElement>('.DocSearch-CodeSnippet-CopyButton');
        if (!btn) return;

        const encoded = btn.getAttribute('data-code') ?? '';
        navigator.clipboard.writeText(decodeURIComponent(encoded)).catch(() => {
          /* noop */
        });

        const label = btn.querySelector<HTMLElement>('.DocSearch-CodeSnippet-CopyButton-Label');
        if (!label) return;

        btn.classList.add('DocSearch-CodeSnippet-CopyButton--copied');
        const original = copyButtonText;
        label.textContent = copyButtonCopiedText;

        setTimeout(() => {
          btn.classList.remove('DocSearch-CodeSnippet-CopyButton--copied');
          label.textContent = original;
        }, 1500);
      }

      container.addEventListener('click', handleClick);

      // eslint-disable-next-line consistent-return
      return (): void => {
        container.removeEventListener('click', handleClick);
      };
    }, [html, copyButtonText, copyButtonCopiedText]);

    return (
      <div
        ref={containerRef}
        className={`DocSearch-Markdown-Content ${isStreaming ? 'DocSearch-Markdown-Content--streaming' : ''}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  },
);
MemoizedMarkdown.displayName = 'MemoizedMarkdown';
