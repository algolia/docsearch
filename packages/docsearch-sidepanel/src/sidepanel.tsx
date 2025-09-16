import { useDocsearch } from '@docsearch/core';
import type { JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

export function DocSearchSidePanelButton(): JSX.Element {
  const { setDocsearchState } = useDocsearch();

  return (
    <button className="DocSearch-Button" type="button" onClick={() => setDocsearchState('sidepanel-open')}>
      Sidepanel
    </button>
  );
}

export function DocSearchSidePanel(): JSX.Element {
  const { docsearchState } = useDocsearch();

  return <>{docsearchState === 'sidepanel-open' && createPortal(<SidePanel />, document.body)}</>;
}

function SidePanel(): JSX.Element {
  const { setDocsearchState } = useDocsearch();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(101, 108, 133, 0.8)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        height: '100vh',
        width: '100vw',
        zIndex: 400,
      }}
      role="button"
      tabIndex={0}
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) {
          setDocsearchState('initial');
        }
      }}
    >
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '250px',
          backgroundColor: '#fff',
          zIndex: 410,
        }}
      >
        <header>DocSearch Sidepanel</header>
      </div>
    </div>
  );
}
