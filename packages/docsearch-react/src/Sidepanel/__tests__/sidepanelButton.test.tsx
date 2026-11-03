import { SidepanelButton } from '@docsearch/react/sidepanelButton';
import type { SidepanelButtonProps } from '@docsearch/react/sidepanelButton';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Importing the public button entry must not evaluate the panel dependencies.
vi.mock('ai', () => {
  throw new Error('The button loaded the AI SDK');
});
vi.mock('@ai-sdk/react', () => {
  throw new Error('The button loaded the chat hooks');
});
vi.mock('marked', () => {
  throw new Error('The button loaded the Markdown renderer');
});

afterEach(cleanup);

describe('sidepanelButton entry point', () => {
  it('renders independently and forwards preload and activation handlers', () => {
    const onMouseEnter = vi.fn();
    const onFocus = vi.fn();
    const onTouchStart = vi.fn();
    const onClick = vi.fn();
    render(
      <SidepanelButton
        variant="inline"
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onTouchStart={onTouchStart}
        onClick={onClick}
      />
    );
    const button = screen.getByRole('button', { name: /^Ask AI/ });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.tabIndex).toBe(0);
    fireEvent.mouseEnter(button);
    fireEvent.focus(button);
    fireEvent.touchStart(button);
    fireEvent.click(button);
    for (const handler of [onMouseEnter, onFocus, onTouchStart, onClick]) {
      expect(handler).toHaveBeenCalledOnce();
    }
  });

  it('preserves translations and allows disabling the shortcut hint', () => {
    const props: SidepanelButtonProps = {
      variant: 'inline',
      translations: { buttonText: 'Ask docs', buttonAriaLabel: 'Ask docs' },
      keyboardShortcuts: { 'Ctrl/Cmd+I': false },
    };
    render(<SidepanelButton {...props} />);
    const button = screen.getByRole('button', { name: 'Ask docs' });
    expect(button).toHaveTextContent('Ask docs');
    expect(button).not.toHaveAttribute('aria-keyshortcuts');
  });
});
