import { DocSearch } from '@docsearch/core';
import { DocSearchAskAiModal, DocSearchButton } from '@docsearch/modal';
import { DocSearchSidepanel } from '@docsearch/react/sidepanel';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { installAskAiMock } from './askai-fixture';
import { createAutopilot } from './autopilot';

// Public credentials — the same ones baked into the live site and the shipped
// demos (docusaurus.config.mjs / examples/*).
const APP_ID = 'PMZUYBQDAK';
const API_KEY = '24b09689d5b4223813d9b8e48563c8f6';
const INDEX_NAME = 'docsearch';
const ASSISTANT_ID = 'ccdec697-e3fe-465b-a1c3-657e7bf18aef';

const NAV_LINKS = ['Guides', 'API', 'Integrations'];
const POPULAR = ['installation', 'react', 'ask ai', 'crawler'];

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const param = new URLSearchParams(window.location.search).get('theme');
  return param === 'dark' ? 'dark' : 'light';
}

export default function DemoApp() {
  const modalRef = useRef(null);
  const sidepanelRef = useRef(null);
  const [theme, setTheme] = useState(getInitialTheme);

  // Open documentation links in a new tab so clicking a result never navigates
  // the iframe away from the demo.
  const navigator = useMemo(() => {
    const openInNewTab = (url) => {
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };
    return {
      navigate: ({ itemUrl, item }) => openInNewTab(itemUrl ?? item?.url),
      navigateNewTab: ({ itemUrl, item }) => openInNewTab(itemUrl ?? item?.url),
      navigateNewWindow: ({ itemUrl, item }) => openInNewTab(itemUrl ?? item?.url),
    };
  }, []);

  // Keep the site design tokens (colours + fonts from custom.css, which are
  // theme-scoped on <html data-theme>) in sync with the demo theme.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const autopilot = createAutopilot({ modalRef, sidepanelRef, indexName: INDEX_NAME });
    const restoreFetch = installAskAiMock(() => autopilot.isAutopilotActive());
    autopilot.start();

    const onMessage = (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'docsearch-demo-visibility') autopilot.setVisible(Boolean(data.visible));
      if (data.type === 'docsearch-demo-theme' && (data.theme === 'light' || data.theme === 'dark')) {
        setTheme(data.theme);
      }
    };
    window.addEventListener('message', onMessage);

    // Tell the host we're ready so it can push the current visibility/theme.
    try {
      window.parent?.postMessage({ type: 'docsearch-demo-ready' }, '*');
    } catch {
      /* cross-origin host — visibility just falls back to the IntersectionObserver ping */
    }

    return () => {
      window.removeEventListener('message', onMessage);
      autopilot.stop();
      restoreFetch();
    };
  }, []);

  return (
    <div className="ds-demo" data-theme={theme}>
      <header className="ds-demo-topbar">
        <div className="ds-demo-brand">
          <span className="ds-demo-logo" aria-hidden="true" />
          <span className="ds-demo-brand-name">Acme Docs</span>
        </div>
        <nav className="ds-demo-nav" aria-label="Docs">
          {NAV_LINKS.map((link) => (
            <span key={link} className="ds-demo-nav-link">
              {link}
            </span>
          ))}
        </nav>
        <div className="ds-demo-actions">
          <DocSearchSidepanel
            ref={sidepanelRef}
            theme={theme}
            indexName={INDEX_NAME}
            appId={APP_ID}
            apiKey={API_KEY}
            assistantId={ASSISTANT_ID}
            button={{ variant: 'inline' }}
            panel={{ suggestedQuestions: true }}
          />
        </div>
      </header>

      <main className="ds-demo-hero">
        <p className="ds-demo-eyebrow">Acme documentation</p>
        <h1 className="ds-demo-title">What can we help you find?</h1>
        <div className="ds-demo-search">
          <DocSearch ref={modalRef} theme={theme}>
            <DocSearchButton translations={{ buttonText: 'Search or ask a question' }} />
            <DocSearchAskAiModal
              indexName={INDEX_NAME}
              appId={APP_ID}
              apiKey={API_KEY}
              askAi={{ assistantId: ASSISTANT_ID }}
              navigator={navigator}
            />
          </DocSearch>
        </div>
        <div className="ds-demo-popular" aria-hidden="true">
          <span className="ds-demo-popular-label">Popular</span>
          {POPULAR.map((term) => (
            <span key={term} className="ds-demo-chip">
              {term}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
