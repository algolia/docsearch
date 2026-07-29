import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { DocSearchByAlgolia } from '../DocSearchByAlgolia';

describe('DocSearchByAlgolia', () => {
  it('uses the default Sidepanel accessible label', () => {
    render(<DocSearchByAlgolia byAlgoliaAriaLabel="DocSearch by Algolia" />);

    expect(
      screen.getByRole('link', { name: 'DocSearch by Algolia' })
    ).toBeInTheDocument();
  });

  it('uses a localized accessible label', () => {
    render(<DocSearchByAlgolia byAlgoliaAriaLabel="DocSearch par Algolia" />);

    expect(
      screen.getByRole('link', { name: 'DocSearch par Algolia' })
    ).toBeInTheDocument();
  });
});
