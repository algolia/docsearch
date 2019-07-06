import { DocSearchHit, DocSearchHits, AlgoliaHit } from 'docsearch.js-types';

import { getHighlightedValue, getSnippetedValue } from '../utils';

export type AlgoliaHitWithRootLevels = Omit<AlgoliaHit, 'hierarchy'> & {
  lvl0?: AlgoliaHit['_highlightResult']['content'];
  lvl1?: AlgoliaHit['_highlightResult']['content'];
  lvl2?: AlgoliaHit['_highlightResult']['content'];
  lvl3?: AlgoliaHit['_highlightResult']['content'];
  lvl4?: AlgoliaHit['_highlightResult']['content'];
  lvl5?: AlgoliaHit['_highlightResult']['content'];
  lvl6?: AlgoliaHit['_highlightResult']['content'];
};

function groupBy<TValue = any>(
  values: TValue[],
  predicate: (value: TValue) => any
) {
  return values.reduce(function(obj, item) {
    const key = predicate(item);

    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }

    obj[key].push(item);

    return obj;
  }, {});
}

export function copyHierarchyValuesToRoot(
  rawHit: AlgoliaHit
): AlgoliaHitWithRootLevels {
  const levels = Object.entries(rawHit._highlightResult.hierarchy).reduce(
    (acc, [key, level]) => ({ ...acc, [key]: level.value }),
    {}
  );
  const { hierarchy, ...hit } = rawHit;

  return {
    ...hit,
    ...levels,
  };
}

function getUrl(hit: AlgoliaHitWithRootLevels): string {
  const { url, anchor } = hit;

  if (url) {
    const containsAnchor = url.indexOf('#') !== -1;

    if (containsAnchor) {
      return url;
    } else if (anchor) {
      return `${hit.url}#${hit.anchor}`;
    }

    return url;
  } else if (anchor) {
    return `#${hit.anchor}`;
  }

  return '';
}

export function formatHit(hit: AlgoliaHitWithRootLevels): DocSearchHit {
  const levels = [
    getHighlightedValue(hit, 'lvl0'),
    getHighlightedValue(hit, 'lvl1'),
    getHighlightedValue(hit, 'lvl2'),
    getHighlightedValue(hit, 'lvl3'),
    getHighlightedValue(hit, 'lvl4'),
    getHighlightedValue(hit, 'lvl5'),
    getHighlightedValue(hit, 'lvl6'),
  ].filter(Boolean);

  return {
    objectID: hit.objectID,
    levels,
    levelIndex: levels.length - 1,
    content: getSnippetedValue(hit, 'content'),
    url: getUrl(hit),
  };
}

function formatHits(rawHits: AlgoliaHit[]): DocSearchHits {
  const hits = rawHits.map(copyHierarchyValuesToRoot).map(formatHit);
  const formattedHits = groupBy(hits, hit => hit.levels[hit.levelIndex]);

  return formattedHits;
}

export default formatHits;
