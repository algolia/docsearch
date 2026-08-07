import React from 'react';

import { MAX_QUERY_SIZE } from '../constants';

export function useInitialModalQuery(initialQueryFromProp: string): {
  initialQuery: string;
  initialQueryFromSelection: string;
} {
  const initialQueryFromSelection = React.useRef(
    typeof window !== 'undefined'
      ? window.getSelection()!.toString().slice(0, MAX_QUERY_SIZE)
      : ''
  ).current;
  const initialQuery = React.useRef(
    initialQueryFromProp || initialQueryFromSelection
  ).current;

  return { initialQuery, initialQueryFromSelection };
}
