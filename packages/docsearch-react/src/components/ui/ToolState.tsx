import React from 'react';

export interface ToolStateProps {
  variant: 'Call' | 'PartialCall' | 'Result';
  icon: React.ReactNode;
  shimmer?: boolean;
  children: React.ReactNode;
}

export function ToolState({
  icon,
  shimmer = false,
  children,
  variant,
}: ToolStateProps): React.JSX.Element {
  const className = `DocSearch-AskAiScreen-MessageContent-Tool Tool--${variant}${shimmer ? ' DocSearch-shimmer' : ''}`;

  return (
    <div className={className}>
      {icon}
      {children}
    </div>
  );
}
