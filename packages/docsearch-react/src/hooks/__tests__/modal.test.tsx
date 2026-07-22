import { render, cleanup } from '@testing-library/react';
import React, { type JSX } from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { MAX_QUERY_SIZE } from '../../constants';
import { useInitialModalQuery } from '../useInitialModalQuery';
import { useModalRefs } from '../useModalRefs';
import { useRefreshOnInitialQuery } from '../useRefreshOnInitialQuery';

describe('modal hooks', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('useInitialModalQuery', () => {
    function TestComponent({
      initialQueryFromProp,
      onResult,
    }: {
      initialQueryFromProp: string;
      onResult: (result: ReturnType<typeof useInitialModalQuery>) => void;
    }): null {
      onResult(useInitialModalQuery(initialQueryFromProp));

      return null;
    }

    it('preserves explicit initial query precedence over selected text', () => {
      const onResult = vi.fn();
      vi.spyOn(window, 'getSelection').mockReturnValue({
        toString: () => 'selected text',
      } as Selection);

      render(
        <TestComponent
          initialQueryFromProp="explicit query"
          onResult={onResult}
        />
      );

      expect(onResult).toHaveBeenCalledWith({
        initialQuery: 'explicit query',
        initialQueryFromSelection: 'selected text',
      });
    });

    it('slices selected text with MAX_QUERY_SIZE', () => {
      const onResult = vi.fn();
      const selection = 'a'.repeat(MAX_QUERY_SIZE + 10);
      vi.spyOn(window, 'getSelection').mockReturnValue({
        toString: () => selection,
      } as Selection);

      render(<TestComponent initialQueryFromProp="" onResult={onResult} />);

      expect(onResult).toHaveBeenCalledWith({
        initialQuery: selection.slice(0, MAX_QUERY_SIZE),
        initialQueryFromSelection: selection.slice(0, MAX_QUERY_SIZE),
      });
    });
  });

  describe('useRefreshOnInitialQuery', () => {
    function TestComponent({
      initialQuery,
      refresh,
    }: {
      initialQuery: string;
      refresh: () => void;
    }): JSX.Element {
      const inputRef = React.useRef<HTMLInputElement | null>(null);
      useRefreshOnInitialQuery({ initialQuery, inputRef, refresh });

      return <input ref={inputRef} />;
    }

    it('calls refresh and focuses input only when an initial query exists', () => {
      const refresh = vi.fn();

      const { rerender } = render(
        <TestComponent initialQuery="" refresh={refresh} />
      );

      expect(refresh).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(document.body);

      rerender(<TestComponent initialQuery="query" refresh={refresh} />);

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(document.querySelector('input'));
    });
  });

  describe('useModalRefs', () => {
    function TestComponent({
      onResult,
    }: {
      onResult: (result: ReturnType<typeof useModalRefs>) => void;
    }): null {
      onResult(useModalRefs());

      return null;
    }

    it('returns stable refs with the expected initial values', () => {
      const onResult = vi.fn();

      const { rerender } = render(<TestComponent onResult={onResult} />);
      const firstResult = onResult.mock.calls[0][0] as ReturnType<
        typeof useModalRefs
      >;

      expect(firstResult.containerRef.current).toBeNull();
      expect(firstResult.modalRef.current).toBeNull();
      expect(firstResult.formElementRef.current).toBeNull();
      expect(firstResult.dropdownRef.current).toBeNull();
      expect(firstResult.inputRef.current).toBeNull();
      expect(firstResult.snippetLength.current).toBe(15);

      rerender(<TestComponent onResult={onResult} />);

      expect(onResult.mock.calls[1][0]).toEqual(firstResult);
    });
  });
});
