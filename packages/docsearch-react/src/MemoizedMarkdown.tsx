import React, { memo, useMemo, useEffect, useRef } from 'react';

import { parseMarkdownToSafeHtml } from './utils/markdown';

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
    const html = useMemo(() => parseMarkdownToSafeHtml(content), [content]);

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
