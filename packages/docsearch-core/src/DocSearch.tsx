import type { JSX } from 'react';
import React from 'react';

type DocSearchState = 'modal-open' | 'ready';

interface IDocSearchContext {
  apiKey: string;
  appId: string;
  indexName?: string;
  docsearchState: DocSearchState;
  setDocsearchState: (newState: DocSearchState) => void;
}

interface DocSearchProps {
  appId: string;
  apiKey: string;
  indexName?: string;
  children: JSX.Element | JSX.Element[];
}

export const DocSearchContext = React.createContext<IDocSearchContext | undefined>(undefined);

export function DocSearch({ appId, apiKey, indexName, children }: DocSearchProps): JSX.Element {
  const [docsearchState, setDocsearchState] = React.useState<DocSearchState>('ready');

  const value = React.useMemo(
    () => ({
      docsearchState,
      setDocsearchState,
      apiKey,
      appId,
      indexName,
    }),
    [docsearchState, apiKey, appId, indexName],
  );

  return <DocSearchContext.Provider value={value}>{children}</DocSearchContext.Provider>;
}

export function useDocSearch(): IDocSearchContext {
  const ctx = React.useContext(DocSearchContext);

  if (ctx === undefined) {
    throw new Error('`useDocSearch` must be used within the `DocSearch` provider.');
  }

  return ctx;
}
