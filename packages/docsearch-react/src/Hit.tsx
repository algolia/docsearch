import React, { type JSX } from 'react';

import type { InternalDocSearchHit, StoredDocSearchHit } from './types';

interface HitProps {
  hit: InternalDocSearchHit | StoredDocSearchHit;
  children: React.ReactNode;
}

export function Hit({ hit, children }: HitProps): JSX.Element {
  return <a href={hit.url}>{children}</a>;
}
