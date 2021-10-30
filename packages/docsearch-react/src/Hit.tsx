import React from 'react';

import type { DocSearchHit } from './types';

interface HitProps {
  hit: DocSearchHit;
  children: React.ReactNode;
}

export function Hit({ hit, children }: HitProps) {
  return <a href={hit.url}>{children}</a>;
}
