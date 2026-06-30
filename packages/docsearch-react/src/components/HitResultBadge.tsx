import React, { type JSX } from 'react';

import type { InternalDocSearchHit } from '../types';
import { getNestedValue } from '../utils';

export type HitResultBadgeTranslations = Partial<{
  /**
   * Label text used for screen readers to announce the result badge. Should reflect
   * the key of `resultBadgeKey`.
   *
   * @default "Category"
   */
  resultBadgeLabelText: string;
}>;

function isRenderablePrimitive(v: unknown): v is boolean | number | string {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
}

interface HitResultBadgeProps {
  item: InternalDocSearchHit;
  resultBadgeKey?: string;
  translations?: HitResultBadgeTranslations;
}

export function HitResultBadge({ item, resultBadgeKey, translations = {} }: HitResultBadgeProps): JSX.Element | null {
  if (!resultBadgeKey) {
    return null;
  }

  const parsedValue = getNestedValue(item, resultBadgeKey);

  if (parsedValue === null || typeof parsedValue === 'undefined') {
    return null;
  }

  const { resultBadgeLabelText = 'Category' } = translations;

  let badgeValue: string | null = null;

  if (isRenderablePrimitive(parsedValue)) {
    badgeValue = String(parsedValue).trim();
  } else if (Array.isArray(parsedValue)) {
    const parts = parsedValue.filter(isRenderablePrimitive).map((v) => String(v).trim());
    badgeValue = parts.length > 0 ? parts.join(', ') : null;
  }

  if (badgeValue === null || badgeValue.length === 0) {
    return null;
  }

  return (
    <div className="DocSearch-Hit-badge">
      <span className="DocSearch-VisuallyHiddenForAccessibility">{`${resultBadgeLabelText}: ${badgeValue}`}</span>
      <span aria-hidden="true">{badgeValue}</span>
    </div>
  );
}
