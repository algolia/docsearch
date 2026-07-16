import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useCallback } from 'react';

const mcpSteps = [
  { id: 'install', text: 'Run one command to wire up your agent' },
  { id: 'connect', text: 'Point Claude, Cursor, Codex & more at the server' },
  { id: 'ask', text: 'Ask questions grounded in real docs' },
  { id: 'ship', text: 'Ship answers your agents can actually trust' },
];

const ArrowIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const cardClass =
  'relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--border-strong)]';
const iconTileClass =
  'flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand)] text-white';
const cardTitleClass = 'font-display text-lg font-semibold text-[var(--text)]';
const cardBodyClass = 'mb-4 text-sm text-[var(--text-secondary)]';
const learnMoreClass =
  'inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-ink)] no-underline! transition-colors hover:text-[var(--brand)]';

export const IntroducingSection = () => {
  const { siteConfig } = useDocusaurusContext();
  // /mcp is served externally at the same origin (not a Docusaurus route).
  const mcpUrl = `${siteConfig.url}/mcp`;
  const handleTryAskAI = useCallback(() => {
    const sidepanelButton = document.querySelector('.DocSearch-SidepanelButton');
    if (sidepanelButton) {
      sidepanelButton.click();
    }
  }, []);

  return (
    <div className="overflow-hidden py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
            Beyond the search box
          </p>
          <h2 className="font-display text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[var(--text)] md:text-[36px]">
            Expand your docs with AI
          </h2>
          <p className="mt-3 text-[15px] text-[var(--text-secondary)] md:text-[17px]">
            Power your documentation with Ask AI and the Model Context Protocol.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Ask AI Card */}
          <div className={cardClass}>
            <div className="mb-4 flex items-center gap-3">
              <div className={iconTileClass}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  />
                </svg>
              </div>
              <span className={cardTitleClass}>Ask AI</span>
            </div>
            <p className={cardBodyClass}>
              Get instant, AI-powered answers from your documentation. Ask
              natural-language questions and receive accurate, context-aware
              responses.
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-ink)]"
                onClick={handleTryAskAI}
              >
                Try now
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                  />
                </svg>
              </button>
              <a
                href="/docs/v4/askai?utm_source=docsearch.algolia.com&utm_medium=referral&utm_campaign=askai"
                className={learnMoreClass}
              >
                Learn more
                <ArrowIcon />
              </a>
            </div>
          </div>

          {/* MCP Card */}
          <div className={cardClass}>
            <div className="mb-4 flex items-center gap-3">
              <div className={iconTileClass}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                  />
                </svg>
              </div>
              <span className={cardTitleClass}>MCP Server</span>
            </div>
            <p className={cardBodyClass}>
              Connect your documentation to AI assistants like Claude and Cursor
              with the Model Context Protocol.
            </p>
            <div className="mb-4 space-y-2">
              {mcpSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-2">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)] text-xs font-bold text-[var(--brand-ink)]">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-tight text-[var(--text-secondary)]">
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href={mcpUrl} className={learnMoreClass}>
                Explore MCP
                <ArrowIcon />
              </a>
              <a href="/docs/mcp/installation" className={learnMoreClass}>
                Install guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
