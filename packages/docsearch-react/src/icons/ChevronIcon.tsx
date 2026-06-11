import React, { type JSX } from 'react';

interface ChevronIconProps {
  size?: number;
  color?: string;
}

export function ChevronIcon({ size = 20, color = 'currentColor' }: ChevronIconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      className="DocSearch-Chevron-Icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
