import React, { type JSX } from 'react';

import { CloseIcon } from '../../icons';

interface ChipProps {
  children: React.ReactNode;
}

export function Chip({ children }: ChipProps): JSX.Element {
  return <div className="DocSearch-Chip">{children}</div>;
}

function ChipDismiss({ className, type = 'button', ...props }: React.ComponentProps<'button'>): JSX.Element {
  const cn = `DocSearch-Chip-Dismiss${className ? ` ${className}` : ''}`;

  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} className={cn} tabIndex={0} {...props}>
      <CloseIcon aria-hidden="true" />
    </button>
  );
}

Chip.Dismiss = ChipDismiss;
