import type { Dispatch, SetStateAction, JSX } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';

type DocSearchState = 'askai-new-conversation' | 'askai' | 'initial' | 'open' | 'sidepanel-open';

interface DocSearchProps {
  children: JSX.Element | JSX.Element[];
}

interface DocSearchContextType {
  docsearchState: DocSearchState;
  setDocsearchState: Dispatch<SetStateAction<DocSearchState>>;
}

export const DocSearchContext = React.createContext<DocSearchContextType | null>(null);

export function DocSearch({ children }: DocSearchProps): JSX.Element {
  const [docsearchState, setDocsearchState] = React.useState<DocSearchState>('initial');

  return (
    <DocSearchContext.Provider value={{ docsearchState, setDocsearchState }}>{children}</DocSearchContext.Provider>
  );
}

export function useDocsearch(): DocSearchContextType {
  const ctx = React.useContext(DocSearchContext);

  if (!ctx) {
    throw new Error('`useDocsearch` must be used within the `DocSearch` provider.');
  }

  return ctx!;
}

export function DocSearchButton(): JSX.Element {
  const { setDocsearchState } = useDocsearch();

  return (
    <button type="button" className="DocSearch-Button" onClick={() => setDocsearchState('open')}>
      Open DocSearch
    </button>
  );
}

export function DocSearchModal(): JSX.Element {
  const { docsearchState } = useDocsearch();

  return <>{docsearchState === 'open' && createPortal(<Modal />, document.body)}</>;
}

function Modal(): JSX.Element {
  const { setDocsearchState } = useDocsearch();
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;
    document.body.style.marginRight = `${scrollBarWidth}px`;

    return (): void => {
      document.body.style.marginRight = '0px';
    };
  }, []);

  React.useEffect(() => {
    function setFullViewportHeight(): void {
      if (modalRef.current) {
        const vh = window.innerHeight * 0.01;
        modalRef.current.style.setProperty('--docsearch-vh', `${vh}px`);
      }
    }

    setFullViewportHeight();

    window.addEventListener('resize', setFullViewportHeight);

    return (): void => {
      window.removeEventListener('resize', setFullViewportHeight);
    };
  }, []);

  const closeModal = (): void => {
    setDocsearchState('initial');
  };

  return (
    <div
      className="DocSearch DocSearch-Container"
      role="button"
      tabIndex={0}
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) {
          closeModal();
        }
      }}
    >
      <div ref={modalRef} className="DocSearch-Modal">
        <header className="DocSearch-SearchBar">
          <form className="DocSearch-Form">
            <input className="DocSearch-Input" placeholder="Search..." />

            <div className="DocSearch-Actions">
              <button
                type="button"
                title="Close DocSearch modal"
                className="DocSearch-Close"
                aria-label="Close DocSearch modal"
                onClick={closeModal}
              >
                X
              </button>
            </div>
          </form>
        </header>
        <div className="DocSearch-Dropdown">
          <h3>DocSearch Modal</h3>
        </div>
      </div>
    </div>
  );
}
