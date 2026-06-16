import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React, { type JSX } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { FacetBar } from '../FacetBar';

const FACETS = [
  { key: 'language', values: ['en', 'fr'] },
  { key: 'docs_version', label: 'Version', values: ['v1.0', 'v2.0'] },
];

function renderFacetBar(overrides: Partial<React.ComponentProps<typeof FacetBar>> = {}): {
  onSelectionChange: ReturnType<typeof vi.fn>;
  clearSelections: ReturnType<typeof vi.fn>;
} {
  const onSelectionChange = vi.fn();
  const clearSelections = vi.fn();
  render(
    <FacetBar
      facets={FACETS}
      selections={{}}
      clearSelections={clearSelections}
      onSelectionChange={onSelectionChange}
      {...overrides}
    />,
  );
  return { onSelectionChange, clearSelections };
}

/**
 * Focus-management tests need real unmounts: a stateful wrapper that
 * applies selection changes the way the modals do via useDocSearchFacets.
 */
function StatefulFacetBar({ initialSelections }: { initialSelections: Record<string, string> }): JSX.Element {
  const [selections, setSelections] = React.useState(initialSelections);

  const handleSelectionChange = React.useCallback((facet: string, value: string) => {
    setSelections((prev) => {
      const next = { ...prev };
      if (value === '') delete next[facet];
      else next[facet] = value;
      return next;
    });
  }, []);

  const clearSelections = React.useCallback(() => setSelections({}), []);

  return (
    <FacetBar
      facets={FACETS}
      selections={selections}
      clearSelections={clearSelections}
      onSelectionChange={handleSelectionChange}
    />
  );
}

describe('FacetBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders nothing when there are no facets', () => {
    const { container } = render(
      <FacetBar facets={[]} selections={{}} clearSelections={vi.fn()} onSelectionChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a trigger per facet with humanized or custom labels', () => {
    renderFacetBar();

    const toolbar = screen.getByRole('group', { name: 'Search filters' });
    expect(toolbar).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Language' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Version' })).toBeInTheDocument();
  });

  it('marks triggers with a selection via data-has-selection', () => {
    renderFacetBar({ selections: { language: 'en' } });

    expect(screen.getByRole('button', { name: 'Language, en selected' })).toHaveAttribute('data-has-selection', 'true');
    expect(screen.getByRole('button', { name: 'Version' })).toHaveAttribute('data-has-selection', 'false');
  });

  it('calls onSelectionChange when selecting a facet value', async () => {
    const { onSelectionChange } = renderFacetBar();

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));

    const option = await screen.findByRole('menuitemradio', { name: 'Fr' });
    fireEvent.click(option);

    await waitFor(() => {
      expect(onSelectionChange).toHaveBeenCalledWith('language', 'fr');
    });
  });

  it('offers a default option that clears the facet selection', async () => {
    const { onSelectionChange } = renderFacetBar({
      selections: { language: 'en' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Language, en selected' }));

    const defaultOption = await screen.findByRole('menuitemradio', {
      name: 'All',
    });
    fireEvent.click(defaultOption);

    await waitFor(() => {
      expect(onSelectionChange).toHaveBeenCalledWith('language', '');
    });
  });

  it('does not render the selection bar when nothing is selected', () => {
    renderFacetBar({ selections: { language: '' } });

    expect(screen.queryByRole('group', { name: 'Selected search filters' })).not.toBeInTheDocument();
  });

  it('renders a chip per selected facet value', () => {
    renderFacetBar({ selections: { language: 'en', docs_version: 'v2.0' } });

    const selectionBar = screen.getByRole('group', {
      name: 'Selected search filters',
    });
    expect(selectionBar).toHaveTextContent('En');
    expect(selectionBar).toHaveTextContent('V2.0');
  });

  it('clears a single selection when dismissing its chip', () => {
    const { onSelectionChange } = renderFacetBar({
      selections: { language: 'en', docs_version: 'v2.0' },
    });

    const dismissLanguage = screen.getByRole('button', {
      name: 'Clear filter: En (Language)',
    });
    fireEvent.click(dismissLanguage);

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith('language', '');
  });

  it('clears every selection when clicking "Clear all"', () => {
    const { clearSelections } = renderFacetBar({
      selections: { language: 'en', docs_version: 'v2.0' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(clearSelections).toHaveBeenCalledTimes(1);
  });

  it('uses custom translations', () => {
    renderFacetBar({
      selections: { language: 'en' },
      translations: {
        clearAllLabel: 'Tout effacer',
        facetsAriaLabel: 'Filtres',
        selectedFacetsAriaLabel: 'Filtres actifs',
      },
    });

    expect(screen.getByRole('group', { name: 'Filtres' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Filtres actifs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tout effacer' })).toBeInTheDocument();
  });

  describe('focus management', () => {
    it('moves focus to the next chip when dismissing a chip with siblings', () => {
      render(<StatefulFacetBar initialSelections={{ language: 'en', docs_version: 'v2.0' }} />);

      const dismissLanguage = screen.getByRole('button', {
        name: 'Clear filter: En (Language)',
      });
      dismissLanguage.focus();
      fireEvent.click(dismissLanguage);

      expect(screen.queryByRole('button', { name: 'Clear filter: En (Language)' })).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: 'Clear filter: V2.0 (Version)',
        }),
      ).toHaveFocus();
    });

    it('moves focus to the previous chip when dismissing the last chip in the row', () => {
      render(<StatefulFacetBar initialSelections={{ language: 'en', docs_version: 'v2.0' }} />);

      const dismissVersion = screen.getByRole('button', {
        name: 'Clear filter: V2.0 (Version)',
      });
      dismissVersion.focus();
      fireEvent.click(dismissVersion);

      expect(screen.getByRole('button', { name: 'Clear filter: En (Language)' })).toHaveFocus();
    });

    it("moves focus to the facet's menu trigger when dismissing the only chip", () => {
      render(<StatefulFacetBar initialSelections={{ language: 'en' }} />);

      const dismiss = screen.getByRole('button', {
        name: 'Clear filter: En (Language)',
      });
      dismiss.focus();
      fireEvent.click(dismiss);

      // Selection bar unmounted entirely…
      expect(screen.queryByRole('group', { name: 'Selected search filters' })).not.toBeInTheDocument();
      // …and focus landed on the cleared facet's trigger (label no longer announces a selection)
      expect(screen.getByRole('button', { name: 'Language' })).toHaveFocus();
    });

    it('moves focus to the first facet trigger when clicking "Clear all"', () => {
      render(<StatefulFacetBar initialSelections={{ language: 'en', docs_version: 'v2.0' }} />);

      const clearAll = screen.getByRole('button', { name: 'Clear all' });
      clearAll.focus();
      fireEvent.click(clearAll);

      expect(screen.queryByRole('group', { name: 'Selected search filters' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Language' })).toHaveFocus();
    });
  });
});
