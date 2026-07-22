import Link from '@docusaurus/Link';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import React from 'react';

import { DocSearchMark } from '@site/src/components/DocSearchMark';

/**
 * Footer (MCP vibe): hairline top border, raised surface, a column link grid
 * read from themeConfig.footer.links, and a centered brand lockup + copyright.
 * Mirrors the DocSearch MCP app's app-footer.
 */

function FooterLink({ item }) {
  const { to, href, label } = item;
  const { withBaseUrl } = useBaseUrlUtils();
  const isExternal = Boolean(href);
  // Normalize internal `to` against baseUrl so it resolves from the site root
  // (not relative to the current page, which would break on nested doc pages).
  const props = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { to: withBaseUrl(to) };
  return (
    <Link
      {...props}
      className="link-underline text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  const { footer } = useThemeConfig();
  const { withBaseUrl } = useBaseUrlUtils();
  if (!footer) return null;
  const { links = [], copyright } = footer;

  return (
    <footer className="pt-8 border-t border-[var(--border)] bg-[var(--surface-raised)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-0">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {links.map((column, i) => (
            <div key={i}>
              <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text)]">
                {column.title}
              </h3>
              <ul className="mt-4 list-none space-y-2.5 p-0">
                {(column.items ?? []).map((item, j) => (
                  <li key={j} className="m-0">
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-[var(--text)]">
            <DocSearchMark className="ds-brand__mark" />
            <span className="ds-brand__lockup">
              <span className="ds-brand__word font-display">DOCSEARCH</span>
              <span className="ds-brand__by">
                by
                <img
                  src={withBaseUrl('/img/Algolia-logo-blue.svg')}
                  alt="Algolia"
                  className="ds-brand__algolia"
                />
              </span>
            </span>
          </Link>
          {copyright ? (
            <p
              className="m-0 text-[12px] text-[var(--text-tertiary)]"
              // Copyright may contain markup (e.g. a brand-colored heart).
              dangerouslySetInnerHTML={{ __html: copyright }}
            />
          ) : null}
        </div>
      </div>
    </footer>
  );
}
