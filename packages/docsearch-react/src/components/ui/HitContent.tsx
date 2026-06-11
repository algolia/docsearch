import type { JSX, ReactNode } from 'react';
import React from 'react';

interface HitContentProps {
  title: ReactNode;
  subText: ReactNode;
}

export function HitContent({ title, subText }: HitContentProps): JSX.Element {
  return (
    <div className="DocSearch-Hit-content-wrapper">
      <span className="DocSearch-Hit-title">{title}</span>
      <span className="DocSearch-Hit-path">{subText}</span>
    </div>
  );
}
