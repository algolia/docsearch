import { describe, it, expect } from 'vitest';

import type { StoredDocSearchHit } from '../../types';
import { getHitItemBreadcrumbs } from '../getHitItemBreadcrumbs';

function createHit(
  overrides: Partial<StoredDocSearchHit> = {}
): StoredDocSearchHit {
  return {
    objectID: '1',
    content: null,
    url: 'https://example.com/docs#anchor',
    url_without_anchor: 'https://example.com/docs',
    type: 'lvl1',
    anchor: 'anchor',
    hierarchy: {
      lvl0: 'Documentation',
      lvl1: 'Getting started',
      lvl2: null,
      lvl3: null,
      lvl4: null,
      lvl5: null,
      lvl6: null,
    },
    ...overrides,
  };
}

describe('getHitItemBreadcrumbs', () => {
  it('returns the levels above the hit own level for lvlX hits', () => {
    const item = createHit({
      type: 'lvl2',
      hierarchy: {
        lvl0: 'Documentation',
        lvl1: 'Getting started',
        lvl2: 'Installation',
        lvl3: null,
        lvl4: null,
        lvl5: null,
        lvl6: null,
      },
    });

    expect(getHitItemBreadcrumbs(item)).toBe('Documentation > Getting started');
  });

  it('returns an empty string for lvl0 hits', () => {
    const item = createHit({ type: 'lvl0' });

    expect(getHitItemBreadcrumbs(item)).toBe('');
  });

  it('returns all non-null levels for content hits', () => {
    const item = createHit({
      type: 'content',
      content: 'Some matching content',
      hierarchy: {
        lvl0: 'Documentation',
        lvl1: 'Getting started',
        lvl2: 'Installation',
        lvl3: null,
        lvl4: null,
        lvl5: null,
        lvl6: null,
      },
    });

    expect(getHitItemBreadcrumbs(item)).toBe(
      'Documentation > Getting started > Installation'
    );
  });

  it('includes the immediate parent heading for content hits under lvl1', () => {
    const item = createHit({
      type: 'content',
      content: 'Some matching content',
    });

    expect(getHitItemBreadcrumbs(item)).toBe('Documentation > Getting started');
  });

  it('skips null levels in the middle of the hierarchy', () => {
    const item = createHit({
      type: 'lvl3',
      hierarchy: {
        lvl0: 'Documentation',
        lvl1: 'Getting started',
        lvl2: null,
        lvl3: 'Requirements',
        lvl4: null,
        lvl5: null,
        lvl6: null,
      },
    });

    expect(getHitItemBreadcrumbs(item)).toBe('Documentation > Getting started');
  });

  it('decodes HTML entities in hierarchy values', () => {
    const item = createHit({
      type: 'lvl2',
      hierarchy: {
        lvl0: 'Search &amp; Discovery',
        lvl1: '&lt;DocSearch /&gt;',
        lvl2: 'Installation',
        lvl3: null,
        lvl4: null,
        lvl5: null,
        lvl6: null,
      },
    });

    expect(getHitItemBreadcrumbs(item)).toBe(
      'Search & Discovery > <DocSearch />'
    );
  });
});
