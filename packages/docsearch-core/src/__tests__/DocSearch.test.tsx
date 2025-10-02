import type { RenderHookResult, RenderResult } from '@testing-library/react';
import { render, screen, cleanup, renderHook, act, fireEvent } from '@testing-library/react';
import type { JSX } from 'react';
import React, { useRef } from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

import { DocSearch, useDocSearch, type DocSearchContext, type DocSearchProps } from '../DocSearch';
import { useDocSearchKeyboardEvents } from '../useDocSearchKeyboardEvents';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';
import { useTheme } from '../useTheme';

type DocSearchPropsNoChildren = Omit<DocSearchProps, 'children'>;

const renderWithProvider = (comp: React.ReactNode, props: DocSearchPropsNoChildren = {}): RenderResult =>
  render(comp, {
    wrapper({ children }) {
      return <DocSearch {...props}>{children}</DocSearch>;
    },
  });

const renderCustomHook = (props: DocSearchPropsNoChildren = {}): RenderHookResult<DocSearchContext, never> =>
  renderHook(() => useDocSearch(), {
    wrapper({ children }) {
      return <DocSearch {...props}>{children}</DocSearch>;
    },
  });

const StateRender = (): JSX.Element => {
  const { docsearchState } = useDocSearch();

  return <p>State: {docsearchState}</p>;
};

describe('@docsearch/core', () => {
  afterEach(() => {
    cleanup();
  });

  describe('DocSearch', () => {
    it('renders without errors', () => {
      renderWithProvider(<p>Hello world!</p>);

      expect(screen.getByText('Hello world!')).toBeInTheDocument();
    });

    it('provides state to children', () => {
      renderWithProvider(<StateRender />);

      expect(screen.getByText('State: ready')).toBeInTheDocument();
    });

    it('updates state from children', async () => {
      const Comp = (): JSX.Element => {
        const { docsearchState, openModal } = useDocSearch();

        return (
          <>
            <p>State: {docsearchState}</p>
            <button type="button" onClick={openModal}>
              Update
            </button>
          </>
        );
      };

      renderWithProvider(<Comp />);

      expect(screen.getByText('State: ready')).toBeInTheDocument();

      const updateBtn = await screen.findByRole('button', { name: /Update/ });

      act(() => {
        fireEvent.click(updateBtn);
      });

      expect(screen.getByText('State: modal-search')).toBeInTheDocument();
    });

    it('manages keyboard shortcuts', () => {
      renderWithProvider(<StateRender />);

      expect(screen.getByText('State: ready')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, {
          key: 'k',
          ctrlKey: true,
        });
      });

      expect(screen.getByText('State: modal-search')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, {
          code: 'Escape',
        });
      });

      expect(screen.getByText('State: ready')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, {
          key: '/',
          code: 'Slash',
        });
      });

      expect(screen.getByText('State: modal-search')).toBeInTheDocument();
    });

    it('respects keyboard shortcuts', () => {
      renderWithProvider(<StateRender />, {
        keyboardShortcuts: {
          'Ctrl/Cmd+K': false,
        },
      });

      act(() => {
        fireEvent.keyDown(document, {
          key: 'k',
          ctrlKey: true,
        });
      });

      expect(screen.getByText('State: ready')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, {
          key: '/',
          code: 'Slash',
        });
      });

      expect(screen.getByText('State: modal-search')).toBeInTheDocument();
    });

    it('sets the theme', () => {
      renderWithProvider(<StateRender />, {
        theme: 'dark',
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('respects initial query', () => {
      const Comp = (): JSX.Element => {
        const { initialQuery } = useDocSearch();

        return <p>Query: {initialQuery}</p>;
      };

      renderWithProvider(<Comp />, {
        initialQuery: 'hitComponent',
      });

      expect(screen.getByText('Query: hitComponent')).toBeInTheDocument();
    });
  });

  describe('useDocSearch', () => {
    it('renders hook with default state', () => {
      const { result } = renderCustomHook();

      expect(result.current).toMatchObject({
        docsearchState: 'ready',
        isModalActive: false,
        isAskAiActive: false,
        initialQuery: '',
        keyboardShortcuts: {
          'Ctrl/Cmd+K': true,
          '/': true,
        },
        searchButtonRef: {
          current: null,
        },
      });
    });

    it('allows setting current state', () => {
      const { result } = renderCustomHook();

      act(() => {
        result.current.setDocsearchState('modal-askai');
      });

      expect(result.current.docsearchState).toBe('modal-askai');

      act(() => {
        result.current.setDocsearchState('modal-search');
      });

      expect(result.current.docsearchState).toBe('modal-search');

      act(() => {
        result.current.setDocsearchState('ready');
      });

      expect(result.current.docsearchState).toBe('ready');
    });

    it('sets modal state', () => {
      const { result } = renderCustomHook();

      act(() => {
        result.current.openModal();
      });

      expect(result.current.docsearchState).toBe('modal-search');

      act(() => {
        result.current.closeModal();
      });

      expect(result.current.docsearchState).toBe('ready');
    });

    it('sets askai state', () => {
      const { result } = renderCustomHook();

      act(() => {
        result.current.onAskAiToggle(true);
      });

      expect(result.current.isAskAiActive).toBe(true);
      expect(result.current.isModalActive).toBe(true);

      act(() => {
        result.current.onAskAiToggle(false);
      });

      expect(result.current.isAskAiActive).toBe(false);
      expect(result.current.isModalActive).toBe(true);
    });

    it('returns custom keyboard shortcuts', () => {
      const { result } = renderCustomHook({
        keyboardShortcuts: {
          '/': false,
          'Ctrl/Cmd+K': false,
        },
      });

      expect(result.current.keyboardShortcuts).toMatchObject({
        'Ctrl/Cmd+K': false,
        '/': false,
      });
    });

    it('handles initial query', () => {
      const { result } = renderCustomHook({
        initialQuery: 'hitComponent',
      });

      expect(result.current.initialQuery).toBe('hitComponent');
    });
  });

  describe('useTheme', () => {
    it('sets dark theme', () => {
      renderHook(() => useTheme({ theme: 'dark' }));

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('sets light theme', () => {
      renderHook(() => useTheme({ theme: 'light' }));

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('useKeyboardShortcuts', () => {
    it('uses defaults', () => {
      const shortcuts = useKeyboardShortcuts();

      expect(shortcuts).toMatchObject({
        'Ctrl/Cmd+K': true,
        '/': true,
      });
    });

    it('uses custom shortcuts', () => {
      const shortcuts = useKeyboardShortcuts({
        '/': false,
        'Ctrl/Cmd+K': false,
      });

      expect(shortcuts).toMatchObject({
        'Ctrl/Cmd+K': false,
        '/': false,
      });
    });
  });

  describe('useDocSearchKeyboardEvents', () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    const onAskAiToggle = vi.fn();

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('calls to open on keybind', () => {
      renderHook(() => {
        const searchRef = useRef<HTMLButtonElement | null>(null);
        return useDocSearchKeyboardEvents({
          isOpen: false,
          onOpen,
          isAskAiActive: false,
          onClose,
          searchButtonRef: searchRef,
          onAskAiToggle: () => {},
        });
      });

      act(() => {
        fireEvent.keyDown(document, {
          key: 'k',
          ctrlKey: true,
        });
      });

      expect(onOpen).toHaveBeenCalled();
    });

    it('calls to open on slash', () => {
      renderHook(() => {
        const searchRef = useRef<HTMLButtonElement | null>(null);
        return useDocSearchKeyboardEvents({
          isOpen: false,
          onOpen,
          isAskAiActive: false,
          onClose,
          searchButtonRef: searchRef,
          onAskAiToggle: () => {},
        });
      });

      act(() => {
        fireEvent.keyDown(document, {
          key: '/',
        });
      });

      expect(onOpen).toHaveBeenCalled();
    });

    it('calls to close on keybind', () => {
      renderHook(() => {
        const searchRef = useRef<HTMLButtonElement | null>(null);
        return useDocSearchKeyboardEvents({
          isOpen: true,
          onOpen,
          isAskAiActive: false,
          onClose,
          searchButtonRef: searchRef,
          onAskAiToggle: () => {},
        });
      });

      act(() => {
        fireEvent.keyDown(document, {
          key: 'k',
          ctrlKey: true,
        });
      });

      expect(onClose).toHaveBeenCalled();
    });

    it('closes on escape key', () => {
      renderHook(() => {
        const searchRef = useRef<HTMLButtonElement | null>(null);
        return useDocSearchKeyboardEvents({
          isOpen: true,
          onOpen,
          isAskAiActive: false,
          onClose,
          searchButtonRef: searchRef,
          onAskAiToggle: () => {},
        });
      });

      act(() => {
        fireEvent.keyDown(document, {
          code: 'Escape',
        });
      });

      expect(onClose).toHaveBeenCalled();
    });

    it('respects keyboard shortcuts', () => {
      renderHook(() => {
        const searchRef = useRef<HTMLButtonElement | null>(null);
        return useDocSearchKeyboardEvents({
          isOpen: false,
          onOpen,
          isAskAiActive: false,
          onClose,
          searchButtonRef: searchRef,
          onAskAiToggle: () => {},
          keyboardShortcuts: {
            '/': false,
          },
        });
      });

      act(() => {
        fireEvent.keyDown(document, {
          key: '/',
        });
      });

      expect(onOpen).not.toHaveBeenCalled();
    });

    it('calls to toggle AskAI', () => {
      renderHook(() => {
        const searchRef = useRef<HTMLButtonElement | null>(null);
        return useDocSearchKeyboardEvents({
          isOpen: true,
          onOpen,
          isAskAiActive: true,
          onClose,
          searchButtonRef: searchRef,
          onAskAiToggle,
        });
      });

      act(() => {
        fireEvent.keyDown(document, {
          code: 'Escape',
        });
      });

      expect(onAskAiToggle).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
