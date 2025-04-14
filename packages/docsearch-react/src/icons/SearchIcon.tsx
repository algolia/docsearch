import React, { type JSX } from 'react';

interface SearchIconProps {
  size?: number;
  color?: string;
}

export function SearchIcon({ size = 20, color = 'currentColor' }: SearchIconProps): JSX.Element {
  return (
    <svg width={size} height={size} className="DocSearch-Search-Icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke={color} fill="none" strokeWidth="1.4" />
      <path d="m21 21-4.3-4.3" stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
