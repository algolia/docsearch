import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import React, { useEffect, useState } from 'react';

import { AsciiBackdrop } from './AsciiBackdrop';
import { Button, PrimaryButton } from './ui/button';
import { IntroducingSection } from './ui/features';
import { FeaturesBento } from './ui/features-bento';
import { FlipWords } from './ui/flip-words';
import Keyboard from './ui/keyboard';
import { Logos } from './ui/logos';
import { Reveal } from './ui/reveal';

const SIGNUP_LINK =
  'https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch&utm_source=docsearch.algolia.com&utm_medium=referral&utm_campaign=docsearch&utm_content=apply';

const INSTALL_PREFIX = 'npx @docsearch/cli setup ';
const AGENTS = ['--cursor', '--claude', '--codex', '--opencode', '--gemini'];
const LONGEST_AGENT = AGENTS.reduce((a, b) => (b.length > a.length ? b : a));
const AGENT_ROTATE_MS = 2000;

const CopyIcon = ({ copied }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {copied ? (
      <path d="M20 6 9 17l-5-5" />
    ) : (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    )}
  </svg>
);

function InstallCommand() {
  const [agentIndex, setAgentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setAgentIndex((i) => (i + 1) % AGENTS.length);
    }, AGENT_ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const agent = AGENTS[agentIndex];
  const command = `${INSTALL_PREFIX}${agent}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[var(--term-border)] bg-[var(--term-bg)] py-2 pl-3.5 pr-2 text-[var(--term-fg)]">
      <code className="font-mono text-[12.5px] text-[var(--term-fg-muted)]">
        {INSTALL_PREFIX}
        <span className="relative inline-block whitespace-pre align-baseline">
          <span aria-hidden className="invisible">
            {LONGEST_AGENT}
          </span>
          <span
            key={agent}
            className="absolute left-0 top-0 text-[var(--term-fg)] animate-[fade-in_var(--dur-sm)_var(--ease-out-quart)]"
          >
            {agent}
          </span>
        </span>
      </code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-[var(--term-btn-border)] bg-[var(--term-btn-bg)] px-2.5 py-1 text-[12px] font-medium text-[var(--term-fg)] transition-colors hover:bg-[var(--term-btn-bg-hover)]"
      >
        <CopyIcon copied={copied} />
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

function useGithubStars(repo, fallback = '9k') {
  const [stars, setStars] = useState(fallback);
  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data || typeof data.stargazers_count !== 'number') return;
        const n = data.stargazers_count;
        setStars(n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [repo]);
  return stars;
}

function Hero() {
  const { withBaseUrl } = useBaseUrlUtils();
  const stars = useGithubStars('algolia/docsearch');

  return (
    <section className="relative isolate">
      <AsciiBackdrop />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-16 text-left sm:px-6 sm:pt-24">
        <Reveal variant="mask" delay={40}>
          <h1 className="max-w-3xl font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--text)] sm:text-[52px]">
            Search made
            <br />
            for <span className="text-[var(--accent)]">documentation</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
            DocSearch by Algolia makes your docs and blogs instantly searchable —
            fast, relevant, and AI-ready. Free for open-source and technical docs.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-7 flex flex-wrap items-stretch gap-2.5">
            <PrimaryButton href={SIGNUP_LINK}>Sign up — it's free</PrimaryButton>
            <Button href={withBaseUrl('docs/what-is-docsearch')}>Documentation</Button>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-[var(--text-tertiary)]">
            <a
              href="https://github.com/algolia/docsearch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--text-tertiary)] no-underline! transition-colors hover:text-[var(--text)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5Z" />
              </svg>
              <span className="tabular text-[var(--text-secondary)]">{stars}</span> stars
              on GitHub
            </a>  
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[var(--text)] md:text-[36px]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-[15px] text-[var(--text-secondary)] md:text-[17px]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function Home() {
  return (
    <>
      <Hero />

      {/* Trusted by */}
      <div className="overflow-hidden py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <SectionHeading
            title="Already trusted by your favorite docs"
            subtitle="Join 7,000+ projects finding answers in milliseconds"
          />
          <Logos />
          <div className="mt-8 flex w-full justify-center">
            <a
              href="https://github.com/algolia/docsearch/network/dependents"
              rel="noreferrer"
              target="_blank"
              className="link-underline text-[14px] text-[var(--text-tertiary)] no-underline!"
            >
              …And <span className="font-semibold text-[var(--text-secondary)]">much more!</span>
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="overflow-hidden py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Built for developers"
            title="Solve docs challenges with a search engine"
            subtitle="Docs are only helpful when your users can find answers easily. Enter DocSearch."
          />
          <FeaturesBento />
        </div>
      </div>

      {/* Ask AI + MCP */}
      <IntroducingSection />

      {/* Cmd+K */}
      <div className="overflow-hidden py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[14px] font-medium text-[var(--text-secondary)]">
            Over 10 years of
            <kbd className="rounded-md border border-[var(--border)] bg-[var(--surface-raised)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--text)]">
              {typeof navigator !== 'undefined' &&
              /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
                ? '⌘'
                : 'Ctrl'}
            </kbd>
            <kbd className="rounded-md border border-[var(--border)] bg-[var(--surface-raised)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--text)]">
              K
            </kbd>
            — the OG search shortcut, still going strong
          </span>
          <Keyboard />
          <h2 className="mt-6 font-display text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[var(--text)] md:text-[36px]">
            Build{' '}
            <FlipWords
              className="text-[var(--accent)]"
              words={['faster', 'smarter', 'freely', 'simpler', 'better', 'everything', 'NOW!']}
            />{' '}
            <br />
            with DocSearch
          </h2>
          <PrimaryButton href={SIGNUP_LINK}>Sign up for free</PrimaryButton>
        </div>
      </div>
    </>
  );
}

export default Home;
