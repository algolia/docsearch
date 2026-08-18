import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { createSearchTracker } from '@site/src/lib/searchTracking';
import SearchBar from '@theme-original/SearchBar';
import React, { useState } from 'react';

function getTrackedIndexNames(docsearch) {
  const indices = Array.isArray(docsearch?.indices) ? docsearch.indices : [];
  return indices
    .map((index) => (typeof index === 'string' ? index : index?.name))
    .filter(Boolean);
}

export default function SearchBarWrapper(props) {
  const { siteConfig } = useDocusaurusContext();
  // DocSearch memoizes its search client on this function, so the tracker has
  // to keep the same identity across renders.
  const [transformSearchClient] = useState(() =>
    createSearchTracker(
      getTrackedIndexNames(siteConfig?.themeConfig?.docsearch)
    )
  );

  return <SearchBar {...props} transformSearchClient={transformSearchClient} />;
}
