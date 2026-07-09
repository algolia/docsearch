import { render, act, fireEvent, screen, cleanup } from '@testing-library/react';
import React, { type JSX } from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

import { DocSearch as DocSearchComponent } from '../DocSearch';
import type { DocSearchProps } from '../DocSearch';
import { PromptForm } from '../Sidepanel/PromptForm';

function DocSearch(props: Partial<DocSearchProps>): JSX.Element {
  return <DocSearchComponent appId="woo" apiKey="foo" indexName="bar" {...props} />;
}

async function openModal(): Promise<void> {
  await act(async () => {
    fireEvent.click(await screen.findByText('Search'));
  });
}

function createSearchMock(hits: Array<Record<string, unknown>> = []): ReturnType<typeof vi.fn> {
  return vi.fn().mockResolvedValue({
    results: [
      {
        hits,
        hitsPerPage: 20,
        nbHits: hits.length,
        nbPages: 1,
        page: 0,
        processingTimeMS: 0,
        exhaustiveNbHits: true,
        params: '',
        query: '',
      },
    ],
  });
}

const HIT = {
  objectID: '1',
  type: 'lvl1',
  url: 'https://example.org/docs/hello',
  url_without_anchor: 'https://example.org/docs/hello',
  anchor: null,
  content: null,
  hierarchy: { lvl0: 'Documentation', lvl1: 'Hello world', lvl2: null, lvl3: null, lvl4: null, lvl5: null, lvl6: null },
  _highlightResult: {
    hierarchy: {
      lvl0: { value: 'Documentation', matchLevel: 'none', matchedWords: [] },
      lvl1: { value: 'Hello world', matchLevel: 'full', matchedWords: ['hello'] },
    },
  },
  _snippetResult: {
    hierarchy: {
      lvl1: { value: 'Hello world', matchLevel: 'full' },
    },
  },
};

describe('IME composition', () => {
  afterEach(() => {
    cleanup();
  });

  describe('modal shortcuts', () => {
    it('does not close the modal on Escape pressed during composition', async () => {
      render(<DocSearch />);
      await openModal();

      expect(document.querySelector('.DocSearch-Modal')).toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { code: 'Escape', isComposing: true });
      });

      expect(document.querySelector('.DocSearch-Modal')).toBeInTheDocument();

      // still closes once the composition is over
      act(() => {
        fireEvent.keyDown(document, { code: 'Escape' });
      });

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();
    });
  });

  describe('search input', () => {
    it('searches once the composition ends instead of on every composition update', async () => {
      const search = createSearchMock();
      render(<DocSearch transformSearchClient={(searchClient) => ({ ...searchClient, search })} />);
      await openModal();

      const input = document.querySelector('.DocSearch-Input') as HTMLInputElement;

      act(() => {
        fireEvent.compositionStart(input);
        fireEvent.input(input, { target: { value: 'ni' }, isComposing: true });
        fireEvent.input(input, { target: { value: 'nihao' }, isComposing: true });
      });

      expect(search).not.toHaveBeenCalled();

      await act(async () => {
        fireEvent.input(input, { target: { value: '你好' }, isComposing: true });
        fireEvent.compositionEnd(input);
        // flush the mocked search response
        await Promise.resolve();
      });

      expect(search).toHaveBeenCalledTimes(1);
      expect(search.mock.calls[0][0].requests[0].query).toBe('你好');
    });

    // https://github.com/algolia/docsearch/issues/1304
    it('does not open the active result on Enter pressed during composition', async () => {
      const navigate = vi.fn();
      const search = createSearchMock([HIT]);
      render(
        <DocSearch
          navigator={{ navigate, navigateNewTab: vi.fn(), navigateNewWindow: vi.fn() }}
          transformSearchClient={(searchClient) => ({ ...searchClient, search })}
        />,
      );
      await openModal();

      const input = document.querySelector('.DocSearch-Input') as HTMLInputElement;

      await act(async () => {
        fireEvent.input(input, { target: { value: 'hello' } });
        // flush the mocked search response
        await Promise.resolve();
      });

      await screen.findByText('Hello world');

      act(() => {
        fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
      });

      expect(navigate).not.toHaveBeenCalled();

      act(() => {
        fireEvent.keyDown(input, { key: 'Enter' });
      });

      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('searches on every keystroke outside of a composition session', async () => {
      const search = createSearchMock();
      render(<DocSearch transformSearchClient={(searchClient) => ({ ...searchClient, search })} />);
      await openModal();

      const input = document.querySelector('.DocSearch-Input') as HTMLInputElement;

      await act(async () => {
        fireEvent.input(input, { target: { value: 'hello' } });
        // flush the mocked search response
        await Promise.resolve();
      });

      expect(search).toHaveBeenCalledTimes(1);
      expect(search.mock.calls[0][0].requests[0].query).toBe('hello');
    });
  });

  describe('sidepanel prompt', () => {
    it('does not send the prompt on Enter pressed during composition', () => {
      const onSend = vi.fn();
      render(
        <PromptForm
          exchanges={[]}
          isStreaming={false}
          showThreadDepthBanner={false}
          onSend={onSend}
          onStartNewConversation={() => {}}
          onStopStreaming={() => {}}
        />,
      );

      const textarea = document.querySelector('.DocSearch-Sidepanel-Prompt--textarea') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'nihao' } });

      fireEvent.keyDown(textarea, { key: 'Enter', isComposing: true });
      expect(onSend).not.toHaveBeenCalled();

      fireEvent.keyDown(textarea, { key: 'Enter' });
      expect(onSend).toHaveBeenCalledWith('nihao');
    });
  });
});
