import React, { type JSX } from 'react';

export function SearchIcon(): JSX.Element {
  return (
    <svg width="20" height="20" className="DocSearch-Search-Icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke="#003DFF" fill="none" strokeWidth="1.4" />
      <path d="m21 21-4.3-4.3" stroke="#003DFF" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
