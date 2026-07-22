import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ArrowRight, Sparks } from 'iconoir-react';
import React, { useCallback } from 'react';

import { InstallCommand } from './install-command';

const mediaClass =
  'flex h-56 shrink-0 items-center justify-center overflow-hidden border-b border-[var(--border)] bg-[var(--surface-raised)]';
const contentClass = 'flex flex-1 flex-col p-10 pt-4';
const eyebrowClass = 'font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] !mb-0';
const titleClass = 'text-xl font-semibold font-display text-[var(--text)] my-4';
const bodyClass = 'mt-2 max-w-lg text-base text-[var(--text-secondary)]';
const primaryButtonClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-ink)]';
const linkClass =
  'inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-ink)] no-underline! transition-colors hover:text-[var(--brand)]';

export function AskAICell() {
  const handleTryAskAI = useCallback(() => {
    const sidepanelButton = document.querySelector('.DocSearch-SidepanelButton');
    if (sidepanelButton) {
      sidepanelButton.click();
    }
  }, []);

  return (
    <div className="relative lg:col-span-3">
      <div className="absolute inset-0 rounded-lg bg-[var(--surface)] max-lg:rounded-t-4xl lg:rounded-tl-4xl" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
        <div className={mediaClass}>
          <video
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            className="h-full w-full object-cover object-left"
            src="/img/resources/askai720p.mp4"
            preload="metadata"
            aria-label="Ask AI answering a question from the docs with cited sources"
          />
        </div>

        <div className={contentClass}>
          <p className={eyebrowClass}>Powered by Algolia Agent Studio</p>
          <p className={titleClass}>Ask AI</p>
          <p className={bodyClass}>
            Instant AI answers straight from your own docs. Users ask natural-language questions and get context-aware
            answers with real sources — with prompts and models you configure.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <button type="button" className={primaryButtonClass} onClick={handleTryAskAI}>
              Try now
              <Sparks width={16} height={16} />
            </button>
            <a
              href="/docs/v4/askai?utm_source=docsearch.algolia.com&utm_medium=referral&utm_campaign=askai"
              className={linkClass}
            >
              Learn more
              <ArrowRight width={16} height={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-lg outline outline-[var(--border)] max-lg:rounded-t-4xl lg:rounded-tl-4xl" />
    </div>
  );
}

export function MCPCell() {
  const { siteConfig } = useDocusaurusContext();
  // /mcp is served externally at the same origin (not a Docusaurus route).
  const mcpUrl = `${siteConfig.url}/mcp`;

  return (
    <div className="relative lg:col-span-3">
      <div className="absolute inset-0 rounded-lg bg-[var(--surface)] lg:rounded-tr-4xl" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
        <div className={`${mediaClass} px-8`}>
          <InstallCommand />
        </div>

        <div className={contentClass}>
          <p className={eyebrowClass}>Model Context Protocol</p>
          <p className={titleClass}>MCP Server</p>
          <p className={bodyClass}>
            Make your docs neural-searchable by any AI agent — Claude, Cursor, Codex, and more — over the Model Context
            Protocol, powered by Algolia neural search.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <a href={mcpUrl} className={linkClass}>
              Explore MCP
              <ArrowRight width={16} height={16} />
            </a>
            <a href="/docs/mcp/installation" className={linkClass}>
              Install guide
            </a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-lg outline outline-[var(--border)] lg:rounded-tr-4xl" />
    </div>
  );
}
