import React, { type JSX } from 'react';

interface BackIconProps {
  size?: number;
  color?: string;
}

export function BackIcon({ size = 20, color = 'currentColor' }: BackIconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      className="DocSearch-Back-Icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
