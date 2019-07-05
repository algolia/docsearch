import { getHighlightedValue, getSnippetedValue } from '../utils';

import { Hit } from '../types';

interface FormattedHit {
  isLvl0: boolean;
  isLvl1: boolean;
  isLvl2: boolean;
  isLvl1EmptyOrDuplicate: boolean;
  isCategoryHeader: boolean;
  isSubCategoryHeader: boolean;
  isTextOrSubcategoryNonEmpty: boolean;
  category: string;
  subcategory: string;
  title: string;
  text: string;
  url: string;
}

export interface FormattedHits {
  [title: string]: FormattedHit[];
}

function groupBy<TValue = any>(
  values: TValue[],
  criteria: (value: TValue) => any
) {
  return values.reduce(function(obj, item) {
    const key =
      typeof criteria === 'function' ? criteria(item) : item[criteria];

    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }

    obj[key].push(item);

    return obj;
  }, {});
}

export function copyHierarchyValuesToRoot(rawHit: Hit): Hit {
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

function formatUrl(hit: Hit): string {
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

export function formatHit(hit: Hit): FormattedHit {
  const url = formatUrl(hit);
  const category = getHighlightedValue(hit, 'lvl0');
  const subcategory = getHighlightedValue(hit, 'lvl1') || category;
  const displayTitle = [
    getHighlightedValue(hit, 'lvl2') || subcategory,
    getHighlightedValue(hit, 'lvl3'),
    getHighlightedValue(hit, 'lvl4'),
    getHighlightedValue(hit, 'lvl5'),
    getHighlightedValue(hit, 'lvl6'),
  ]
    .filter(Boolean)
    .join('');

  const text = getSnippetedValue(hit, 'content');
  const isTextOrSubcategoryNonEmpty = Boolean(subcategory || displayTitle);
  const isLvl1EmptyOrDuplicate =
    !subcategory || subcategory === '' || subcategory === category;
  const isLvl2 = Boolean(displayTitle && displayTitle !== subcategory);
  const isLvl1 = Boolean(!isLvl2 && (subcategory && subcategory !== category));
  const isLvl0 = !isLvl1 && !isLvl2;

  return {
    isLvl0,
    isLvl1,
    isLvl2,
    isLvl1EmptyOrDuplicate,
    isCategoryHeader: Boolean(hit.isCategoryHeader),
    isSubCategoryHeader: Boolean(hit.isSubCategoryHeader),
    isTextOrSubcategoryNonEmpty,
    category,
    subcategory,
    title: displayTitle,
    text,
    url,
  };
}

function formatHits(rawHits: Hit[]): FormattedHits {
  const hits = rawHits.map(copyHierarchyValuesToRoot).map(formatHit);
  const formattedHits = groupBy(hits, hit => hit.subcategory || hit.category);

  return formattedHits;
}

export default formatHits;
