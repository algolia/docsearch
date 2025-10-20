import type { DocSearchProps } from '@docsearch/core';
import { DocSearch } from '@docsearch/core';
import type { RenderResult } from '@testing-library/react';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

import { DocSearchButton, type DocSearchButtonProps } from '../DocSearchButton';

const renderComponent = (
  props: DocSearchButtonProps = {},
  docsearchProps: Omit<DocSearchProps, 'children'> = {},
): RenderResult =>
  render(<DocSearchButton {...props} />, {
    wrapper({ children }) {
      return <DocSearch {...docsearchProps}>{children}</DocSearch>;
    },
  });

describe('@docsearch/modal', () => {
  afterEach(() => {
    cleanup();
  });

  describe('DocSearchButton', () => {
    it('renders the button', () => {
      renderComponent();

      expect(screen.getByRole('button', { name: /Search/ })).toBeInTheDocument();
    });

    it('renders with translations', () => {
      renderComponent({
        translations: {
          buttonText: 'Test Button Text',
          buttonAriaLabel: 'Test Aria',
        },
      });

      expect(screen.getByRole('button', { name: /Test Aria/ })).toBeInTheDocument();
      // Look for text because `name` on button points to the aria-label
      expect(screen.getByText('Test Button Text')).toBeInTheDocument();
    });

    it('calls onClick callback', () => {
      const clickHandler = vi.fn();

      renderComponent({
        onClick: clickHandler,
      });

      const buttonEl = screen.getByRole<HTMLButtonElement>('button', {
        name: /Search/,
      });

      act(() => {
        fireEvent.click(buttonEl);
      });

      expect(clickHandler).toHaveBeenCalled();
    });

    it('respects keyboard shortcuts', () => {
      renderComponent(undefined, {
        keyboardShortcuts: {
          'Ctrl/Cmd+K': false,
        },
      });

      const buttonEl = screen.getByRole<HTMLButtonElement>('button', {
        name: /Search/,
      });

      expect(buttonEl.getAttribute('aria-keyshortcuts')).toBeNull();
    });
  });
});
