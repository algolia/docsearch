import { Github } from 'iconoir-react';
import React, { useCallback, useEffect, useState } from 'react';

import { AsciiBackdrop } from './AsciiBackdrop';
import DemoShowcase from './DemoShowcase';
import { Button, PrimaryButton } from './ui/button';
import { FeaturesBento } from './ui/features-bento';
import { FlipWords } from './ui/flip-words';
import Keyboard from './ui/keyboard';
import { Logos } from './ui/logos';
import { Reveal } from './ui/reveal';

const SIGNUP_LINK =
  'https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch&utm_source=docsearch.algolia.com&utm_medium=referral&utm_campaign=docsearch&utm_content=apply';

function useGithubStars(repo) {
  const [stars, setStars] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data || typeof data.stargazers_count !== 'number')
          return;
        const n = data.stargazers_count;
        setStars(n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [repo]);

  return { isLoading, stars };
}

function Hero() {
  const { isLoading, stars } = useGithubStars('algolia/docsearch');

  return (
    <section className="relative isolate">
      <AsciiBackdrop />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-16 text-left md:px-0 md:pt-24">
        <Reveal variant="mask" delay={40}>
          <p className="max-w-3xl font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--text)] sm:text-[40px]">
            Search made
            <br />
            for <span className="text-[var(--accent)]">documentation</span>
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[var(--text-secondary)]">
            DocSearch by Algolia makes your docs and blogs instantly searchable
            — fast, relevant, and AI-ready. Free for open-source and technical
            docs.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-7 flex flex-wrap items-stretch gap-2.5">
            <PrimaryButton href={SIGNUP_LINK}>
              Sign up — it's free
            </PrimaryButton>
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
              <Github width={14} height={14} aria-hidden={true} />
              {isLoading ? (
                <output className="inline-flex items-center">
                  <span
                    aria-hidden={true}
                    className="size-3 animate-spin rounded-full border-2 border-[var(--text-tertiary)] border-t-transparent"
                  />
                  <span className="sr-only">Loading GitHub star count</span>
                </output>
              ) : (
                <span className="tabular text-[var(--text-secondary)]">
                  {stars ?? '—'} stars on GitHub
                </span>
              )}
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
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)] !mb-0">
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

function MobileSearchDemo() {
  const openSearch = useCallback(() => {
    document
      .querySelector("[class*='navbarSearchContainer'] .DocSearch-Button")
      ?.click();
  }, []);
  const openAskAi = useCallback(() => {
    document.querySelector('.DocSearch-SidepanelButton')?.click();
  }, []);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:hidden">
      <p className="mb-5 text-center text-[14px] text-[var(--text-secondary)]">
        Search the docs or ask AI a question.
      </p>
      <div className="flex flex-col gap-3">
        <Button className="h-12 w-full text-[15px]" onClick={openSearch}>
          Search documentation
        </Button>
        <PrimaryButton className="h-12 w-full text-[15px]" onClick={openAskAi}>
          Ask AI
        </PrimaryButton>
      </div>
    </div>
  );
}

function Home() {
  useEffect(() => {
    document.body.classList.add('homepage');
    return () => document.body.classList.remove('homepage');
  }, []);

  return (
    <>
      <Hero />

      <section className="px-4 pt-16 pb-10 md:px-0">
        <SectionHeading
            eyebrow="Interactive demo"
            title="See DocSearch in action"
          />
        <MobileSearchDemo />
        <div className="hidden md:block">
          <DemoShowcase />
        </div>
      </section>

      {/* Trusted by */}
      <div className="overflow-hidden py-16">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-0">
          <SectionHeading
            title="Already trusted by your favorite docs"
            subtitle="Join 9,000+ projects finding answers in milliseconds"
          />
          <Logos />
          <div className="mt-8 flex w-full justify-center">
            <a
              href="https://github.com/algolia/docsearch/network/dependents"
              rel="noreferrer"
              target="_blank"
              className="link-underline text-[14px] text-[var(--text-tertiary)] no-underline!"
            >
              …And much more!
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="overflow-hidden py-16">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-0">
          <SectionHeading
            eyebrow="Built for developers"
            title="Solve docs challenges with a search engine"
            subtitle="Docs are only helpful when your users can find answers easily. Enter DocSearch."
          />
          <FeaturesBento />
        </div>
      </div>

      {/* Cmd+K */}
      <div className="overflow-hidden py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center md:px-0">
          <Keyboard />
          <h2 className="mt-6 font-display text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[var(--text)] md:text-[36px]">
            Build{' '}
            <FlipWords
              className="text-[var(--accent)]"
              words={[
                'faster',
                'smarter',
                'freely',
                'simpler',
                'better',
                'everything',
                'NOW!',
              ]}
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
