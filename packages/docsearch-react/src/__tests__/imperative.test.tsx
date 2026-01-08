import type { DocSearchCallbacks } from '@docsearch/core';
import { render, act, cleanup } from '@testing-library/react';
import React, { type JSX, useRef, type RefObject } from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

import { type DocSearchProps, DocSearch as DocSearchComponent, type DocSearchRef } from '../DocSearch';

type TestDocSearchProps = DocSearchCallbacks & Partial<DocSearchProps> & { refObj?: RefObject<DocSearchRef | null> };

function DocSearch(props: TestDocSearchProps): JSX.Element {
  const internalRef = useRef<DocSearchRef>(null);
  const ref = props.refObj ?? internalRef;

  return <DocSearchComponent ref={ref} appId="woo" apiKey="foo" indexName="bar" {...props} />;
}

describe('imperative handle', () => {
  afterEach(() => {
    cleanup();
  });

  describe('DocSearchRef', () => {
    it('exposes isReady as true after mount', () => {
      const ref = React.createRef<DocSearchRef>();

      render(<DocSearch refObj={ref} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current?.isReady).toBe(true);
    });

    it('exposes isOpen as false initially', () => {
      const ref = React.createRef<DocSearchRef>();

      render(<DocSearch refObj={ref} />);

      expect(ref.current?.isOpen).toBe(false);
    });

    it('opens modal via open() method', async () => {
      const ref = React.createRef<DocSearchRef>();

      render(<DocSearch refObj={ref} />);

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();

      await act(() => {
        ref.current?.open();
      });

      expect(document.querySelector('.DocSearch-Modal')).toBeInTheDocument();
      expect(ref.current?.isOpen).toBe(true);
    });

    it('closes modal via close() method', async () => {
      const ref = React.createRef<DocSearchRef>();

      render(<DocSearch refObj={ref} />);

      await act(() => {
        ref.current?.open();
      });

      expect(document.querySelector('.DocSearch-Modal')).toBeInTheDocument();

      await act(() => {
        ref.current?.close();
      });

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();
      expect(ref.current?.isOpen).toBe(false);
    });
  });

  describe('lifecycle callbacks', () => {
    it('calls onReady after mount', () => {
      const onReady = vi.fn();

      render(<DocSearch onReady={onReady} />);

      expect(onReady).toHaveBeenCalledTimes(1);
    });

    it('calls onOpen when modal opens', async () => {
      const onOpen = vi.fn();
      const ref = React.createRef<DocSearchRef>();

      render(<DocSearch refObj={ref} onOpen={onOpen} />);

      expect(onOpen).not.toHaveBeenCalled();

      await act(() => {
        ref.current?.open();
      });

      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when modal closes', async () => {
      const onClose = vi.fn();
      const ref = React.createRef<DocSearchRef>();

      render(<DocSearch refObj={ref} onClose={onClose} />);

      await act(() => {
        ref.current?.open();
      });

      expect(onClose).not.toHaveBeenCalled();

      await act(() => {
        ref.current?.close();
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onOpen when already open', async () => {
      const onOpen = vi.fn();
      const ref = React.createRef<DocSearchRef>();

      render(<DocSearch refObj={ref} onOpen={onOpen} />);

      await act(() => {
        ref.current?.open();
      });

      expect(onOpen).toHaveBeenCalledTimes(1);

      // Try opening again while already open
      await act(() => {
        ref.current?.open();
      });

      // Should still be 1 - no duplicate callback
      expect(onOpen).toHaveBeenCalledTimes(1);
    });
  });
});
