import React from 'react';
import type { JSX } from 'react';

type ModalHeadingProps = {
  heading: string;
  shimmer?: boolean;
};

export function ModalHeading({ heading, shimmer = false }: ModalHeadingProps): JSX.Element {
  return <span className={`DocSearch-Modal-heading${shimmer ? ' shimmer' : ''}`}>{heading}</span>;
}
