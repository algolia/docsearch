import React from 'react';

/**
 * DocSearch logomark — concentric-arc swirl (Algolia blue).
 * Ported from the DocSearch MCP app (docsearch-logo.tsx). Sized via className.
 */
export function DocSearchMark({ className }) {
  return (
    <svg
      viewBox="0 0 76 78"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="nonzero"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M36.493 77.289H3.074C1.376 77.289 0 75.919 0 74.228h36.523c12.769.062 24.6-6.663 31.038-17.642 6.438-10.979 6.504-24.543.174-35.584C61.404 9.962 49.639 3.122 36.87 3.061H0C0 1.37 1.376 0 3.074 0h33.796c10.31.01 20.193 4.1 27.473 11.369 7.279 7.268 11.36 17.12 11.341 27.384-.06 21.366-17.741 38.536-39.19 38.536z"
        fill="#5468FF"
      />
      <path
        d="M0 69.045h23.711c2.931.01 5.761-1.071 7.933-3.031H0v3.031zM0 60.8h36.374c.734-.987 1.418-1.975 2.053-3.07H0v3.07zM0 52.546h41.025c.407-.987.774-1.975 1.091-3.06H0v3.06zM0 44.302h43.306c.149-.987.268-2.034.337-3.061H0v3.061zM0 36.058h43.633a29.95 29.95 0 0 1-.337-3.071H0v3.071zM0 27.804h42.116c-.317-1.037-.684-2.064-1.09-3.061H0v3.061zM0 19.559h38.427a32.68 32.68 0 0 1-2.053-3.06H0v3.06zM0 8.244v3.071h31.674A19.04 19.04 0 0 0 23.74 8.284L0 8.244z"
        fill="#5468FF"
      />
    </svg>
  );
}

export default DocSearchMark;
