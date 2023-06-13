import React from 'react';

import type { InternalDocSearchHit, StoredDocSearchHit } from './types';

interface HitProps {
  hit: InternalDocSearchHit | StoredDocSearchHit;
  children: React.ReactNode;
}

export function Hit({ hit, children }: HitProps) {
  return <a href={hit.url}>{children}</a>;
}
