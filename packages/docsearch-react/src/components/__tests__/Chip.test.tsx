import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { Chip } from '../ui/Chip';

describe('Chip', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders its children', () => {
    render(<Chip>en</Chip>);

    expect(screen.getByText('en')).toBeInTheDocument();
  });

  describe('Chip.Dismiss', () => {
    it('calls onClick when the dismiss button is clicked', () => {
      const onDismiss = vi.fn();
      render(
        <Chip>
          en
          <Chip.Dismiss onClick={onDismiss} />
        </Chip>,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
