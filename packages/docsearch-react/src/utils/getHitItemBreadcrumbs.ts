import type { StoredDocSearchHit } from '../types';

import { decodeHtmlEntities } from './decodeHtmlEntities';

const LEVELS = [
  'lvl0',
  'lvl1',
  'lvl2',
  'lvl3',
  'lvl4',
  'lvl5',
  'lvl6',
] as const;

export function getHitItemBreadcrumbs<TItem extends StoredDocSearchHit>(
  item: TItem
): string {
  const currentIndex =
    item.type === 'content' || item.type === 'askAI'
      ? LEVELS.length
      : LEVELS.indexOf(item.type);
  return LEVELS.slice(0, currentIndex)
    .map((lvl) =>
      item.hierarchy[lvl] ? decodeHtmlEntities(item.hierarchy[lvl]) : null
    )
    .filter(Boolean)
    .join(' > ');
}
