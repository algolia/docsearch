import React from 'react';

import { AskAICell, MCPCell } from './features-ai-cells';

const surfaces = [
  { label: 'Docusaurus' },
  { label: 'VitePress' },
  { label: 'React' },
  { label: 'Vanilla JS' },
  { label: 'Modal', accent: true },
  { label: 'Sidepanel', accent: true },
];

const algoliaStats = [
  { value: '<20 ms', label: 'Search latency' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '9,000+', label: 'Projects' },
  { value: 'Free', label: 'For OSS & technical docs' },
];

const badgeBase =
  'rounded-full border px-3 py-1.5 font-mono text-xs transition-colors';
const badgeDefault =
  'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]';
const badgeAccent =
  'border-transparent bg-[var(--accent-light)] text-[var(--brand-ink)]';

export const FeaturesBento = () => {
  return (
    <div className="pb-8">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6">
          {/* Row 1 — AI-first hero cells (owned by features-ai-cells.jsx) */}
          <AskAICell />
          <MCPCell />

          {/* Row 2 — Made for docs (full width) */}
          <div className="relative lg:col-span-6">
            <div className="absolute inset-0 rounded-lg bg-[var(--surface)]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:min-h-80 lg:flex-row">
              <img
                alt=""
                src="/img/resources/docs.png"
                className="h-64 w-full object-cover object-left lg:h-auto lg:w-1/2 lg:object-center"
              />

              <div className="p-10 pt-4 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:pt-10">
                <p className="text-xl font-semibold font-display text-[var(--text)] my-4">
                  Made for docs
                </p>
                <p className="mt-2 max-w-lg text-base text-[var(--text-secondary)]">
                  DocSearch’s crawler automatically indexes your docs on a
                  schedule — no manual reindexing, no stale results. A visual
                  config editor lets you tune exactly what gets picked up, and
                  it understands code snippets, tables, markdown structure, and
                  API references so your users get pinpoint answers every time.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg outline outline-[var(--border)]" />
          </div>

          {/* Row 3 — Works everywhere / Customizable / A11y */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-[var(--surface)]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <div className="flex h-56 flex-wrap content-center items-center justify-center gap-2 border-b border-[var(--border)] bg-[var(--surface-raised)] p-8">
                {surfaces.map((surface) => (
                  <span
                    key={surface.label}
                    className={`${badgeBase} ${surface.accent ? badgeAccent : badgeDefault}`}
                  >
                    {surface.label}
                  </span>
                ))}
              </div>

              <div className="p-10 pt-4">
                <p className="text-xl font-semibold font-display text-[var(--text)] my-4">
                  Works everywhere
                </p>
                <p className="mt-2 max-w-lg text-base text-[var(--text-secondary)]">
                  Drop DocSearch into any stack. First-class adapters for
                  Docusaurus and VitePress, headless React components, and a
                  vanilla-JS build for everything else — shipping both a
                  command-palette modal and the Sidepanel.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg outline outline-[var(--border)]" />
          </div>

          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-[var(--surface)]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <img
                alt=""
                src="img/resources/customizable-light.png"
                className="h-56 object-cover object-left hidden dark:block"
              />
              <img
                alt=""
                src="img/resources/customizable-dark.png"
                className="h-56 object-cover object-left dark:hidden"
              />

              <div className="p-10 pt-4">
                <p className="text-xl font-semibold font-display text-[var(--text)] my-4">
                  Customizable
                </p>
                <p className="mt-2 max-w-lg text-base text-[var(--text-secondary)]">
                  Tailor DocSearch to match your brand and UX needs—colors,
                  fonts, layouts, and even search behaviors are under your
                  control. Drop-in CSS variables and simple JS hooks make it
                  effortless to blend search seamlessly into any docs site.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg outline outline-[var(--border)]" />
          </div>

          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 rounded-lg bg-[var(--surface)]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <img
                alt=""
                src="/img/resources/accessible.png"
                className="h-56 object-cover object-top"
              />

              <div className="p-10 pt-4">
                <p className="text-xl font-semibold font-display text-[var(--text)] my-4">
                  A11y
                </p>
                <p className="mt-2 max-w-lg text-base text-[var(--text-secondary)]">
                  DocSearch follows WAI-ARIA best practices to ensure full
                  keyboard, screen-reader, and voice-control support. Delight
                  every user with an inclusive search experience that’s tested
                  against WCAG 2.1 standards.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg outline outline-[var(--border)]" />
          </div>

          {/* Row 4 — Powered by Algolia (slim supporting stat strip) */}
          <div className="relative lg:col-span-6">
            <div className="absolute inset-0 rounded-lg bg-[var(--surface)] rounded-b-4xl" />
            <div className="relative flex h-full flex-col gap-6 overflow-hidden rounded-[calc(var(--radius-lg)+1px)] rounded-b-[calc(2rem+1px)] p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="lg:max-w-xs">
                <p className="text-xl font-semibold font-display text-[var(--text)]">
                  Powered by Algolia
                </p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Running on Algolia’s global search infrastructure — fast,
                  reliable, and free for the docs that need it.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:gap-x-10">
                {algoliaStats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-display text-2xl font-semibold tabular text-[var(--text)] sm:text-3xl">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-xs text-[var(--text-tertiary)]">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg outline outline-[var(--border)] rounded-b-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
