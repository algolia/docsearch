import type { JSX } from 'react';
import React from 'react';

import { useDocSearchKeyboardEvents } from './useDocSearchKeyboardEvents';
import { useIsMobile } from './useIsMobile';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import type { KeyboardShortcuts } from './useKeyboardShortcuts.ts';
import type { DocSearchTheme } from './useTheme';
import { useTheme } from './useTheme';

export type DocSearchState = 'modal-askai' | 'modal-search' | 'ready' | 'sidepanel';

export type View = 'modal' | 'sidepanel' | (Record<string, unknown> & string);

export type InitialAskAiMessage = {
  query: string;
  messageId?: string;
  suggestedQuestionId?: string;
};

export type OnAskAiToggle = (active: boolean, initialMessage?: InitialAskAiMessage) => void;

/**
 * Imperative handle exposed by the DocSearch provider for programmatic control.
 */
export interface DocSearchRef {
  /** Opens the search modal. */
  open: () => void;
  /** Closes the search modal. */
  close: () => void;
  /** Opens Ask AI mode (sidepanel if available, otherwise modal). */
  openAskAi: (initialMessage?: InitialAskAiMessage) => void;
  /** Opens the sidepanel directly (no-op if sidepanel view not registered). */
  openSidepanel: (initialMessage?: InitialAskAiMessage) => void;
  /** Returns true once the component is mounted and ready. */
  readonly isReady: boolean;
  /** Returns true if the modal is currently open. */
  readonly isOpen: boolean;
  /** Returns true if the sidepanel is currently open. */
  readonly isSidepanelOpen: boolean;
  /** Returns true if sidepanel view is registered (hybrid mode). */
  readonly isSidepanelSupported: boolean;
}

export interface DocSearchContext {
  docsearchState: DocSearchState;
  setDocsearchState: (newState: DocSearchState) => void;
  searchButtonRef: React.RefObject<HTMLButtonElement | null>;
  initialQuery: string;
  keyboardShortcuts: Required<KeyboardShortcuts>;
  openModal: () => void;
  closeModal: () => void;
  isAskAiActive: boolean;
  isModalActive: boolean;
  onAskAiToggle: OnAskAiToggle;
  initialAskAiMessage: InitialAskAiMessage | undefined;
  registerView: (view: View) => void;
  isHybridModeSupported: boolean;
}

/**
 * Lifecycle callbacks for DocSearch.
 */
export interface DocSearchCallbacks {
  /** Called once DocSearch is mounted and ready for interaction. */
  onReady?: () => void;
  /** Called when the modal opens. */
  onOpen?: () => void;
  /** Called when the modal closes. */
  onClose?: () => void;
  /** Called when the sidepanel opens. */
  onSidepanelOpen?: () => void;
  /** Called when the sidepanel closes. */
  onSidepanelClose?: () => void;
}

export interface DocSearchProps extends DocSearchCallbacks {
  children: Array<JSX.Element | null> | JSX.Element | React.ReactNode | null;
  theme?: DocSearchTheme;
  initialQuery?: string;
  keyboardShortcuts?: KeyboardShortcuts;
}

const Context = React.createContext<DocSearchContext | undefined>(undefined);
Context.displayName = 'DocSearchContext';

function DocSearchInner(
  { children, theme, onReady, onOpen, onClose, onSidepanelOpen, onSidepanelClose, ...props }: DocSearchProps,
  ref: React.ForwardedRef<DocSearchRef>,
): JSX.Element {
  const [docsearchState, setDocsearchState] = React.useState<DocSearchState>('ready');
  const [initialQuery, setInitialQuery] = React.useState<string>(props.initialQuery || '');
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const keyboardShortcuts = useKeyboardShortcuts(props.keyboardShortcuts);
  const [initialAskAiMessage, setInitialAskAiMessage] = React.useState<InitialAskAiMessage>();
  const [registeredViews, setRegisteredViews] = React.useState(() => new Set<View>());
  const isMobile = useIsMobile();
  const prevStateRef = React.useRef<DocSearchState>('ready');

  const isModalActive = ['modal-search', 'modal-askai'].includes(docsearchState);
  const isAskAiActive = docsearchState === 'modal-askai';
  const isHybridModeSupported = registeredViews.has('sidepanel');
  const isSidepanelOpen = docsearchState === 'sidepanel';

  // Call onReady on mount
  React.useEffect(() => {
    onReady?.();
  }, [onReady]);

  // Track state changes for lifecycle callbacks
  React.useEffect(() => {
    const prevState = prevStateRef.current;
    const currentState = docsearchState;

    // Modal opened
    if (
      (currentState === 'modal-search' || currentState === 'modal-askai') &&
      prevState !== 'modal-search' &&
      prevState !== 'modal-askai'
    ) {
      onOpen?.();
    }

    // Modal closed
    if (currentState === 'ready' && (prevState === 'modal-search' || prevState === 'modal-askai')) {
      onClose?.();
    }

    // Sidepanel opened
    if (currentState === 'sidepanel' && prevState !== 'sidepanel') {
      onSidepanelOpen?.();
    }

    // Sidepanel closed
    if (currentState !== 'sidepanel' && prevState === 'sidepanel') {
      onSidepanelClose?.();
    }

    prevStateRef.current = currentState;
  }, [docsearchState, onOpen, onClose, onSidepanelOpen, onSidepanelClose]);

  const openModal = React.useCallback((): void => {
    setDocsearchState('modal-search');
  }, []);

  const closeModal = React.useCallback((): void => {
    setDocsearchState('ready');
    setInitialQuery(props.initialQuery ?? '');
  }, [setDocsearchState, props.initialQuery]);

  const onAskAiToggle: OnAskAiToggle = React.useCallback(
    (active, initialMessage) => {
      // Don't use hybrid mode on mobile
      if (!isMobile && active && isHybridModeSupported) {
        setInitialAskAiMessage(initialMessage);
        setDocsearchState('sidepanel');
        return;
      }

      setDocsearchState(active ? 'modal-askai' : 'modal-search');
    },
    [setDocsearchState, isMobile, isHybridModeSupported],
  );

  const openSidepanel = React.useCallback(
    (initialMessage?: InitialAskAiMessage): void => {
      // Guard: no-op if sidepanel view hasn't been registered
      if (!registeredViews.has('sidepanel')) return;

      setInitialAskAiMessage(initialMessage);
      setDocsearchState('sidepanel');
    },
    [setDocsearchState, registeredViews],
  );

  const onInput = React.useCallback(
    (event: KeyboardEvent): void => {
      setDocsearchState('modal-search');
      setInitialQuery(event.key);
    },
    [setDocsearchState, setInitialQuery],
  );

  const registerView = React.useCallback(
    (view: View): void => {
      if (registeredViews.has(view)) return;

      setRegisteredViews((prev) => {
        const newViews = new Set(prev);
        newViews.add(view);
        return newViews;
      });
    },
    [registeredViews],
  );

  // Expose imperative handle for programmatic control
  React.useImperativeHandle(
    ref,
    () => ({
      open: openModal,
      close: closeModal,
      openAskAi: (initialMessage?: InitialAskAiMessage): void => onAskAiToggle(true, initialMessage),
      openSidepanel,
      get isReady(): boolean {
        return true;
      },
      get isOpen(): boolean {
        return isModalActive;
      },
      get isSidepanelOpen(): boolean {
        return isSidepanelOpen;
      },
      get isSidepanelSupported(): boolean {
        return isHybridModeSupported;
      },
    }),
    [openModal, closeModal, onAskAiToggle, openSidepanel, isModalActive, isSidepanelOpen, isHybridModeSupported],
  );

  useTheme({ theme });

  useDocSearchKeyboardEvents({
    isOpen: isModalActive,
    onOpen: openModal,
    onClose: closeModal,
    onAskAiToggle,
    onInput,
    isAskAiActive,
    searchButtonRef,
    keyboardShortcuts,
  });

  const value: DocSearchContext = React.useMemo(
    () => ({
      docsearchState,
      setDocsearchState,
      searchButtonRef,
      initialQuery,
      keyboardShortcuts,
      openModal,
      closeModal,
      isAskAiActive,
      isModalActive,
      onAskAiToggle,
      initialAskAiMessage,
      registerView,
      isHybridModeSupported,
    }),
    [
      docsearchState,
      searchButtonRef,
      initialQuery,
      keyboardShortcuts,
      openModal,
      closeModal,
      isAskAiActive,
      isModalActive,
      onAskAiToggle,
      initialAskAiMessage,
      registerView,
      isHybridModeSupported,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const DocSearch = React.forwardRef(DocSearchInner);
DocSearch.displayName = 'DocSearch';

export function useDocSearch(): DocSearchContext {
  const ctx = React.useContext(Context);

  if (ctx === undefined) {
    throw new Error('`useDocSearch` must be used within the `DocSearch` provider');
  }

  return ctx;
}
