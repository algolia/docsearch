import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Homepage showcase: a same-origin iframe running a live, self-driving DocSearch
// widget. The iframe is what contains the modal/side panel (which attach to
// their document's body) and keeps them from taking over the whole page.
//
// This host component:
//  - lazy-loads the iframe when it scrolls near the viewport,
//  - tells the iframe when it is on/off screen (so the tour pauses when hidden),
//  - keeps the iframe's theme in sync with the site's light/dark mode.
export default function DemoShowcase() {
  const { colorMode } = useColorMode();
  // Resolve the embed URL through Docusaurus so it respects `baseUrl`.
  const baseSrc = useBaseUrl('/demo-embed');
  const wrapperRef = useRef(null);
  const iframeRef = useRef(null);
  const colorModeRef = useRef(colorMode);
  const baseSrcRef = useRef(baseSrc);
  baseSrcRef.current = baseSrc;
  const loadedRef = useRef(false);
  const [src, setSrc] = useState(null);

  const post = useCallback((message) => {
    iframeRef.current?.contentWindow?.postMessage(message, '*');
  }, []);

  // Lazy-load + visibility tracking.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loadedRef.current) {
          loadedRef.current = true;
          setSrc(`${baseSrcRef.current}?theme=${colorModeRef.current}`);
        }
        post({ type: 'docsearch-demo-visibility', visible: entry.intersectionRatio >= 0.35 });
      },
      { threshold: [0, 0.35, 0.7, 1], rootMargin: '300px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [post]);

  // Keep the iframe theme in sync with the site.
  useEffect(() => {
    colorModeRef.current = colorMode;
    post({ type: 'docsearch-demo-theme', theme: colorMode });
  }, [colorMode, post]);

  // When the iframe reports it's ready, push the current theme + visibility.
  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.type !== 'docsearch-demo-ready') return;
      post({ type: 'docsearch-demo-theme', theme: colorModeRef.current });
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.65 && rect.bottom > window.innerHeight * 0.35;
      post({ type: 'docsearch-demo-visibility', visible });
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [post]);

  return (
    <div
      ref={wrapperRef}
      className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[var(--border-strong,#d0d3d7)]" />
          <span className="h-3 w-3 rounded-full bg-[var(--border-strong,#d0d3d7)]" />
          <span className="h-3 w-3 rounded-full bg-[var(--border-strong,#d0d3d7)]" />
        </span>
        <div className="mx-auto w-full max-w-sm truncate rounded-md border border-[var(--border)] bg-[var(--bg,transparent)] px-3 py-1 text-center text-[12px] text-[var(--text-tertiary)]">
          docs.your-project.com
        </div>
      </div>
      <div className="relative aspect-video w-full bg-[var(--surface)]">
        {src ? (
          <iframe
            ref={iframeRef}
            src={src}
            title="DocSearch live demo"
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[13px] text-[var(--text-tertiary)]">
            Loading live demo…
          </div>
        )}
      </div>
    </div>
  );
}
