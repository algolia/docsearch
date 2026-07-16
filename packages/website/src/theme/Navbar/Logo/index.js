import Link from '@docusaurus/Link';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import React from 'react';

import { DocSearchMark } from '@site/src/components/DocSearchMark';

/**
 * Navbar brand lockup (MCP vibe): swirl mark + DOCSEARCH wordmark + a small
 * "by <Algolia>" byline. Overrides the stock image logo.
 */
export default function NavbarLogo() {
  const { withBaseUrl } = useBaseUrlUtils();
  return (
    <Link
      to="/"
      className="navbar__brand ds-brand"
      aria-label="DocSearch home"
    >
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
  );
}
