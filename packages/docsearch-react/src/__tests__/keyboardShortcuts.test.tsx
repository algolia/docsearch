import { render, act, fireEvent, screen, cleanup } from '@testing-library/react';
import React, { type JSX } from 'react';
import { describe, it, expect, afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

import { DocSearch as DocSearchComponent } from '../DocSearch';
import type { DocSearchProps } from '../DocSearch';

function DocSearch(props: Partial<DocSearchProps>): JSX.Element {
  return <DocSearchComponent appId="woo" apiKey="foo" indexName="bar" {...props} />;
}

describe('keyboard shortcuts', () => {
  afterEach(() => {
    cleanup();
  });

  describe('default behavior', () => {
    it('shows Ctrl/Cmd+K shortcut hint by default', () => {
      render(<DocSearch />);

      const button = document.querySelector('.DocSearch-Button');
      expect(button).toBeInTheDocument();
      expect(button?.getAttribute('aria-label')).toMatch(/\(Control\+k\)/);
      expect(document.querySelector('.DocSearch-Button-Keys')).toBeInTheDocument();
    });

    it('responds to Ctrl+K keyboard shortcut by default', () => {
      render(<DocSearch />);

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      });

      expect(document.querySelector('.DocSearch-Modal')).toBeInTheDocument();
    });

    it('responds to / keyboard shortcut by default', () => {
      render(<DocSearch />);

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { key: '/' });
      });

      expect(document.querySelector('.DocSearch-Modal')).toBeInTheDocument();
    });
  });

  describe('custom keyboard shortcuts configuration', () => {
    it('hides shortcut hint when Ctrl/Cmd+K is disabled', () => {
      render(<DocSearch keyboardShortcuts={{ 'Ctrl/Cmd+K': false }} />);

      const button = document.querySelector('.DocSearch-Button');
      expect(button).toBeInTheDocument();
      expect(button?.getAttribute('aria-label')).toBe('Search');
      expect(document.querySelector('.DocSearch-Button-Keys')).toBeInTheDocument();
      expect(document.querySelector('.DocSearch-Button-Key')).not.toBeInTheDocument();
    });

    it('does not respond to Ctrl+K when disabled', () => {
      render(<DocSearch keyboardShortcuts={{ 'Ctrl/Cmd+K': false }} />);

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      });

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();
    });

    it('does not respond to / when disabled', () => {
      render(<DocSearch keyboardShortcuts={{ '/': false }} />);

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { key: '/' });
      });

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();
    });

    it('still shows shortcut hint when only / is disabled', () => {
      render(<DocSearch keyboardShortcuts={{ '/': false }} />);

      const button = document.querySelector('.DocSearch-Button');
      expect(button).toBeInTheDocument();
      expect(button?.getAttribute('aria-label')).toMatch(/\(Control\+k\)/);
      expect(document.querySelector('.DocSearch-Button-Key')).toBeInTheDocument();
    });

    it('responds to enabled shortcuts when others are disabled', () => {
      render(<DocSearch keyboardShortcuts={{ '/': false }} />);

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      });

      expect(document.querySelector('.DocSearch-Modal')).toBeInTheDocument();
    });

    it('can disable all shortcuts', () => {
      render(<DocSearch keyboardShortcuts={{ 'Ctrl/Cmd+K': false, '/': false }} />);

      const button = document.querySelector('.DocSearch-Button');
      expect(button?.getAttribute('aria-label')).toBe('Search');
      expect(document.querySelector('.DocSearch-Button-Key')).not.toBeInTheDocument();

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      });

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();

      act(() => {
        fireEvent.keyDown(document, { key: '/' });
      });

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();
    });
  });

  describe('Escape key behavior', () => {
    it('always responds to Escape to close modal regardless of configuration', async () => {
      render(<DocSearch keyboardShortcuts={{ 'Ctrl/Cmd+K': false, '/': false }} />);

      // Open modal via button click
      await act(async () => {
        fireEvent.click(await screen.findByText('Search'));
      });

      expect(document.querySelector('.DocSearch-Modal')).toBeInTheDocument();

      // Close with Escape
      act(() => {
        fireEvent.keyDown(document, { code: 'Escape' });
      });

      expect(document.querySelector('.DocSearch-Modal')).not.toBeInTheDocument();
    });
  });
});
