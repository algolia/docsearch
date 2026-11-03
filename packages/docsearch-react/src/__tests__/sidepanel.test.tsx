import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import '@testing-library/jest-dom/vitest';

import { Sidepanel } from '../Sidepanel/Sidepanel';

vi.mock('../useIsMobile', () => ({ useIsMobile: () => false }));

const props = {
  appId: 'test-app',
  apiKey: 'test-key',
  agentId: 'test-agent',
  onOpen: vi.fn(),
  onClose: vi.fn(),
};

describe('Sidepanel closed state', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterAll(() => {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it.each(['floating', 'inline'] as const)(
    'makes the mounted %s panel inert by default',
    (variant) => {
      render(<Sidepanel {...props} variant={variant} />);

      // JSDOM doesn't implement inert focus or accessibility-tree behavior.
      // Browser regressions cover those; here we check the native attribute.
      expect(screen.getByRole('dialog')).toHaveAttribute('inert');
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    }
  );

  it('restores interaction without remounting or clearing panel and draft state', () => {
    const { rerender } = render(<Sidepanel {...props} isOpen={true} />);
    const panel = screen.getByRole('dialog');
    const prompt = screen.getByRole('textbox');

    expect(panel).not.toHaveAttribute('inert');
    fireEvent.change(prompt, { target: { value: 'A follow-up question' } });
    fireEvent.click(screen.getByTitle('Expand or collapse Sidepanel'));
    fireEvent.click(screen.getByTitle('Conversation history'));

    rerender(<Sidepanel {...props} isOpen={false} />);

    expect(panel).toHaveAttribute('inert');
    expect(prompt).toBeInTheDocument();

    rerender(<Sidepanel {...props} isOpen={true} />);

    expect(screen.getByRole('dialog')).toBe(panel);
    expect(panel).not.toHaveAttribute('inert');
    expect(panel).toHaveClass('is-expanded');
    expect(screen.getByRole('textbox')).toBe(prompt);
    expect(prompt).toHaveValue('A follow-up question');
    expect(screen.getByText('My conversation history')).toBeInTheDocument();
  });

  it('preserves conversation messages across close and reopen', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        [
          { type: 'text-start', id: 'answer' },
          { type: 'text-delta', id: 'answer', delta: 'Saved answer' },
          { type: 'text-end', id: 'answer' },
          { type: 'finish' },
        ]
          .map((event) => `data: ${JSON.stringify(event)}\n\n`)
          .join(''),
        { headers: { 'content-type': 'text/event-stream' } }
      )
    );
    const { rerender } = render(<Sidepanel {...props} isOpen={true} />);
    const prompt = screen.getByRole('textbox');
    fireEvent.change(prompt, { target: { value: 'My question' } });
    fireEvent.submit(prompt.closest('form')!);

    await screen.findByText('Saved answer');
    rerender(<Sidepanel {...props} isOpen={false} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('inert');
    rerender(<Sidepanel {...props} isOpen={true} />);

    expect(screen.getByText('My question')).toBeInTheDocument();
    expect(screen.getByText('Saved answer')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveFocus();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
