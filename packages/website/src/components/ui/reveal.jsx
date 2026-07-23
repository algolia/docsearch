import React from 'react';

/**
 * Staggered entrance wrapper (ported from the DocSearch MCP app).
 * `variant="mask"` wipes in via clip-path; default slides up. `delay` in ms.
 * Motion collapses automatically under prefers-reduced-motion (see
 * custom.css).
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  variant = 'up',
  className,
  style,
}) {
  const cls = variant === 'mask' ? 'reveal-mask' : 'reveal-up';
  return (
    <Tag
      className={className ? `${cls} ${className}` : cls}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
