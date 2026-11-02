import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ModalShell } from '../ui/ModalShell';

function createProps(overrides = {}): any {
  return {
    state: { status: 'idle' },
    containerRef: React.createRef<HTMLDivElement>(),
    modalRef: React.createRef<HTMLDivElement>(),
    formElementRef: React.createRef<HTMLDivElement>(),
    dropdownRef: React.createRef<HTMLDivElement>(),
    getRootProps: (rootProps: Record<string, unknown>) => rootProps,
    onClose: vi.fn(),
    showDropdown: true,
    searchBox: <input aria-label="Search" />,
    screenState: (
      <>
        <div className="DocSearch-Hit-source">Guides</div>
        <input aria-label="Feedback" />
      </>
    ),
    footer: (
      <>
        <span>Navigate</span>
        <select aria-label="Version">
          <option>v5</option>
        </select>
      </>
    ),
    ...overrides,
  };
}

function getDropdown(): HTMLElement {
  return document.querySelector<HTMLElement>('.DocSearch-Dropdown')!;
}

function getFooter(): HTMLElement {
  return document.querySelector<HTMLElement>('.DocSearch-Footer')!;
}

describe('ModalShell', () => {
  afterEach(() => {
    cleanup();
  });

  describe('keepInputFocus', () => {
    it('prevents the default mousedown action on the results panel', () => {
      render(<ModalShell {...createProps({ keepInputFocus: true })} />);

      // jsdom doesn't move focus on mousedown, so this checks that the default
      // action, which moves focus to the container, is prevented. Pressing the
      // panel's scrollbar targets the panel itself.
      expect(fireEvent.mouseDown(getDropdown())).toBe(false);
      expect(fireEvent.mouseDown(screen.getByText('Guides'))).toBe(false);
    });

    it('prevents the default mousedown action on the footer', () => {
      render(<ModalShell {...createProps({ keepInputFocus: true })} />);

      expect(fireEvent.mouseDown(getFooter())).toBe(false);
      expect(fireEvent.mouseDown(screen.getByText('Navigate'))).toBe(false);
    });

    it('lets editable controls in the results panel and footer take focus', () => {
      render(<ModalShell {...createProps({ keepInputFocus: true })} />);

      expect(fireEvent.mouseDown(screen.getByLabelText('Feedback'))).toBe(true);
      expect(fireEvent.mouseDown(screen.getByLabelText('Version'))).toBe(true);
    });

    it('ignores mouse buttons other than the main one', () => {
      render(<ModalShell {...createProps({ keepInputFocus: true })} />);

      expect(fireEvent.mouseDown(getDropdown(), { button: 1 })).toBe(true);
      expect(fireEvent.mouseDown(getFooter(), { button: 2 })).toBe(true);
    });

    it('is off by default', () => {
      render(<ModalShell {...createProps()} />);

      expect(fireEvent.mouseDown(getDropdown())).toBe(true);
      expect(fireEvent.mouseDown(getFooter())).toBe(true);
    });
  });

  it('closes only when the backdrop is pressed', () => {
    const onClose = vi.fn();
    render(<ModalShell {...createProps({ keepInputFocus: true, onClose })} />);

    fireEvent.mouseDown(getDropdown());
    fireEvent.mouseDown(getFooter());

    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseDown(document.querySelector('.DocSearch-Container')!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
