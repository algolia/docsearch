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
      navigateNewWindow: ({ itemUrl, item }) =>
        openInNewTab(itemUrl ?? item?.url),
    };
  }, []);

  // Keep the site design tokens (colours + fonts from custom.css, which are
  // theme-scoped on <html data-theme>) in sync with the demo theme.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keep scrolling — and the keyboard — contained inside the iframe. Focusing an
  // element (the search input / prompt on open) or `scrollIntoView` (streaming
  // answers) otherwise scrolls ancestors across the iframe boundary, which yanks
  // the parent page back to the demo. So `focus` defaults to `preventScroll` and
  // is gated on real user intent (see below), and `scrollIntoView` only moves
  // the nearest scrollable ancestor within the frame.
  useEffect(() => {
    const nativeFocus = HTMLElement.prototype.focus;
    const nativeScrollIntoView = Element.prototype.scrollIntoView;

    // The widget focuses its input when the modal opens. Inside an iframe that
    // pulls document focus off the host page, so the site's own ⌘K handler
    // never sees the keystroke and this demo answers it instead — the demo
    // looks like it has trapped the keyboard. So programmatic focus only lands
    // once the visitor has actually reached into the demo; the autopilot drives
    // the widget with synthetic `input` events, which don't require focus.
    let userEngaged = false;
    const engage = (event) => {
      if (event.isTrusted) userEngaged = true;
    };
    // Focus left the frame (the visitor clicked back out onto the page), so the
    // demo has to earn it again rather than grabbing it on the next tour loop.
    const disengage = () => {
      userEngaged = false;
    };
    const engageEvents = ['pointerdown', 'keydown', 'touchstart'];
    engageEvents.forEach((name) =>
      document.addEventListener(name, engage, { capture: true, passive: true })
    );
    window.addEventListener('blur', disengage);

    HTMLElement.prototype.focus = function focusNoScroll(options) {
      if (!userEngaged) return undefined;
      return nativeFocus.call(this, { preventScroll: true, ...(options ?? {}) });
    };

    Element.prototype.scrollIntoView = function containedScrollIntoView(arg) {
      const behavior = typeof arg === 'object' && arg?.behavior ? arg.behavior : 'auto';
      let ancestor = this.parentElement;
      while (ancestor) {
        const overflowY = getComputedStyle(ancestor).overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') && ancestor.scrollHeight > ancestor.clientHeight) {
          const top =
            this.getBoundingClientRect().top - ancestor.getBoundingClientRect().top + ancestor.scrollTop;
          ancestor.scrollTo({ top, behavior });
          return;
        }
        ancestor = ancestor.parentElement;
      }
      // No scrollable ancestor inside the frame → intentionally do nothing so we
      // never scroll the parent document.
    };

    return () => {
      HTMLElement.prototype.focus = nativeFocus;
      Element.prototype.scrollIntoView = nativeScrollIntoView;
      engageEvents.forEach((name) =>
        document.removeEventListener(name, engage, { capture: true })
      );
      window.removeEventListener('blur', disengage);
    };
  }, []);

  useEffect(() => {
    const autopilot = createAutopilot({
      modalRef,
      sidepanelRef,
      indexName: INDEX_NAME,
    });
    const restoreFetch = installAskAiMock(() => autopilot.isAutopilotActive());
    autopilot.start();

    const onMessage = (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'docsearch-demo-visibility')
        autopilot.setVisible(Boolean(data.visible));
      if (
        data.type === 'docsearch-demo-theme' &&
        (data.theme === 'light' || data.theme === 'dark')
      ) {
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
        <div className="ds-demo-brand" aria-hidden="true">
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
            <DocSearchButton
              translations={{ buttonText: 'Search or ask a question' }}
            />
            <DocSearchAskAiModal
              indices={[INDEX_NAME]}
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
