import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { DocSearchButton } from '../DocSearchButton';

describe('DocSearchButton keyboard feedback', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it.each(['Win32', 'Linux x86_64'] as const)(
    'animates the Control key on %s without changing its width class',
    (platform) => {
      vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform);
      render(<DocSearchButton />);

      const controlKey = screen.getByText('Ctrl');
      const kKey = screen.getByText('K');
      expect(controlKey).toHaveClass('DocSearch-Button-Key--ctrl');

      fireEvent.keyDown(window, { key: 'Control', ctrlKey: true });
      expect(controlKey).toHaveClass('DocSearch-Button-Key--pressed');
      expect(controlKey).toHaveClass('DocSearch-Button-Key--ctrl');
      expect(kKey).not.toHaveClass('DocSearch-Button-Key--pressed');

      fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
      expect(kKey).toHaveClass('DocSearch-Button-Key--pressed');
      fireEvent.keyUp(window, { key: 'k', ctrlKey: true });
      expect(kKey).not.toHaveClass('DocSearch-Button-Key--pressed');
      expect(controlKey).toHaveClass('DocSearch-Button-Key--pressed');

      fireEvent.keyUp(window, { key: 'Control' });
      expect(controlKey).not.toHaveClass('DocSearch-Button-Key--pressed');
      expect(controlKey).toHaveClass('DocSearch-Button-Key--ctrl');
    }
  );

  it('resets both keycaps when Command is released on macOS', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel');
    render(<DocSearchButton />);

    const commandKey = screen.getByText('⌘');
    const kKey = screen.getByText('K');
    expect(commandKey).not.toHaveClass('DocSearch-Button-Key--ctrl');

    fireEvent.keyDown(window, { key: 'Meta', metaKey: true });
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(commandKey).toHaveClass('DocSearch-Button-Key--pressed');
    expect(kKey).toHaveClass('DocSearch-Button-Key--pressed');

    fireEvent.keyUp(window, { key: 'Meta' });
    expect(commandKey).not.toHaveClass('DocSearch-Button-Key--pressed');
    expect(kKey).not.toHaveClass('DocSearch-Button-Key--pressed');
  });

  it('does not show keycaps when the shortcut is disabled', () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
    render(<DocSearchButton keyboardShortcuts={{ 'Ctrl/Cmd+K': false }} />);

    expect(screen.queryByText('Ctrl')).not.toBeInTheDocument();
    expect(screen.queryByText('K')).not.toBeInTheDocument();
  });
});
