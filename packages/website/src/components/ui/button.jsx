import React from 'react';

const BASE =
  'relative inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-4 text-sm font-medium no-underline! transition-all duration-150 active:scale-[0.97]';

// Outline / secondary
export const Button = ({ children, href, className = '', ...props }) => {
  const Component = href ? 'a' : 'button';
  return (
    <Component
      {...props}
      {...(href ? { href } : { type: 'button' })}
      className={`${BASE} border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)]! hover:bg-[var(--surface-raised)] ${className}`}
    >
      <span className="relative">{children}</span>
    </Component>
  );
};

// Primary — brand fill with inset highlight (MCP primary button)
export const PrimaryButton = ({ children, href, className = '', ...props }) => {
  const Component = href ? 'a' : 'button';
  return (
    <Component
      {...props}
      {...(href ? { href } : { type: 'button' })}
      className={`${BASE} border-transparent bg-[var(--brand)] text-white! shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_1px_2px_0_rgba(16,24,40,0.12)] hover:bg-[var(--brand-ink)] ${className}`}
    >
      <span className="relative">{children}</span>
    </Component>
  );
};
