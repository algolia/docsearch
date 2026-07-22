import { NavArrowDown, NavArrowUp } from 'iconoir-react';
import React from 'react';

import { cn } from '../lib/utils';

export function ChevronDown({ className }) {
  return <NavArrowDown className={cn('size-4', className)} />;
}

export function ChevronUp({ className }) {
  return <NavArrowUp className={cn('size-4', className)} />;
}
