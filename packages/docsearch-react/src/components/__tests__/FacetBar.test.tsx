import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React, { type JSX } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { FacetSelectionUpdate } from '../../utils/createDocSearchSources';
import { FacetBar } from '../FacetBar';

const FACETS = [
  { key: 'language', values: ['en', 'fr'] },
  { key: 'docs_version', label: 'Version', values: ['v1.0', 'v2.0'] },
];

function resolveUpdate(
  update: FacetSelectionUpdate,
  currentValues: string[]
): string[] {
  return typeof update === 'function' ? update(currentValues) : update;
}

/**
 * Renders the bar with a spy that records the resolved values for each change,
 * mirroring how useDocSearchFacets resolves functional updates.
 */
function renderFacetBar(
  overrides: Partial<React.ComponentProps<typeof FacetBar>> = {}
): {
  onSelectionChange: ReturnType<typeof vi.fn>;
  clearSelections: ReturnType<typeof vi.fn>;
} {
  const selections = overrides.selections ?? {};
  const onSelectionChange = vi.fn();
  const clearSelections = vi.fn();
  render(
    <FacetBar
      facets={FACETS}
      clearSelections={clearSelections}
      {...overrides}
      selections={selections}
      onSelectionChange={(facet: string, update: FacetSelectionUpdate) => {
        onSelectionChange(
          facet,
          resolveUpdate(update, selections[facet] ?? [])
        );
      }}
    />
  );
  return { onSelectionChange, clearSelections };
}

/**
 * Focus-management tests need real unmounts: a stateful wrapper that applies
 * selection changes the way the modals do via useDocSearchFacets.
 */
function StatefulFacetBar({
  initialSelections,
}: {
  initialSelections: Record<string, string[]>;
}): JSX.Element {
  const [selections, setSelections] = React.useState(initialSelections);

  const handleSelectionChange = React.useCallback(
    (facet: string, update: FacetSelectionUpdate) => {
      setSelections((prev) => ({
        ...prev,
        [facet]: resolveUpdate(update, prev[facet] ?? []),
      }));
    },
    []
  );

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
      <FacetBar
        facets={[]}
        selections={{}}
        clearSelections={vi.fn()}
        onSelectionChange={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a trigger per facet with humanized or custom labels', () => {
    renderFacetBar();

    const toolbar = screen.getByRole('group', { name: 'Search filters' });
    expect(toolbar).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Language' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Version' })).toBeInTheDocument();
  });

  it('marks triggers with a selection via data-has-selection', () => {
    renderFacetBar({ selections: { language: ['en'] } });

    expect(
      screen.getByRole('button', { name: 'Language, en selected' })
    ).toHaveAttribute('data-has-selection', 'true');
    expect(screen.getByRole('button', { name: 'Version' })).toHaveAttribute(
      'data-has-selection',
      'false'
    );
  });

  it('announces every selected value in the trigger aria label', () => {
    renderFacetBar({ selections: { language: ['en', 'fr'] } });

    expect(
      screen.getByRole('button', { name: 'Language, en, fr selected' })
    ).toBeInTheDocument();
  });

  it('renders facet values as checkbox menu items', async () => {
    renderFacetBar({ selections: { language: ['en'] } });

    fireEvent.click(
      screen.getByRole('button', { name: 'Language, en selected' })
    );

    expect(
      await screen.findByRole('menuitemcheckbox', { name: 'En' })
    ).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Fr' })
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('renders the default option as a plain action item', async () => {
    renderFacetBar();

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));

    const defaultOption = await screen.findByRole('menuitem', {
      name: 'All',
    });
    expect(defaultOption).not.toHaveAttribute('aria-checked');
  });

  it('calls onSelectionChange with the added value when selecting a facet value', async () => {
    const { onSelectionChange } = renderFacetBar();

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));

    const option = await screen.findByRole('menuitemcheckbox', { name: 'Fr' });
    fireEvent.click(option);

    await waitFor(() => {
      expect(onSelectionChange).toHaveBeenCalledWith('language', ['fr']);
    });
  });

  it('appends to existing selections when selecting another value', async () => {
    const { onSelectionChange } = renderFacetBar({
      selections: { language: ['en'] },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Language, en selected' })
    );

    const option = await screen.findByRole('menuitemcheckbox', { name: 'Fr' });
    fireEvent.click(option);

    await waitFor(() => {
      expect(onSelectionChange).toHaveBeenCalledWith('language', ['en', 'fr']);
    });
  });

  it('removes a value when unselecting a checked facet value', async () => {
    const { onSelectionChange } = renderFacetBar({
      selections: { language: ['en', 'fr'] },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Language, en, fr selected' })
    );

    const option = await screen.findByRole('menuitemcheckbox', { name: 'En' });
    fireEvent.click(option);

    await waitFor(() => {
      expect(onSelectionChange).toHaveBeenCalledWith('language', ['fr']);
    });
  });

  it('accumulates rapid toggles without losing earlier selections', async () => {
    render(<StatefulFacetBar initialSelections={{}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));

    const en = await screen.findByRole('menuitemcheckbox', { name: 'En' });
    const fr = screen.getByRole('menuitemcheckbox', { name: 'Fr' });
    fireEvent.click(en);
    fireEvent.click(fr);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Language, en, fr selected' })
      ).toBeInTheDocument();
    });
  });

  it('keeps the menu open after toggling a value', async () => {
    render(<StatefulFacetBar initialSelections={{}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));

    const option = await screen.findByRole('menuitemcheckbox', { name: 'Fr' });
    fireEvent.click(option);

    await waitFor(() => {
      expect(
        screen.getByRole('menuitemcheckbox', { name: 'Fr' })
      ).toHaveAttribute('aria-checked', 'true');
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('offers a default option that clears the facet selection', async () => {
    const { onSelectionChange } = renderFacetBar({
      selections: { language: ['en', 'fr'] },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Language, en, fr selected' })
    );

    const defaultOption = await screen.findByRole('menuitem', {
      name: 'All',
    });
    fireEvent.click(defaultOption);

    await waitFor(() => {
      expect(onSelectionChange).toHaveBeenCalledWith('language', []);
    });
  });

  it('does not render the selection bar when nothing is selected', () => {
    renderFacetBar({ selections: { language: [] } });

    expect(
      screen.queryByRole('group', { name: 'Selected search filters' })
    ).not.toBeInTheDocument();
  });

  it('renders a chip per selected facet value', () => {
    renderFacetBar({
      selections: { language: ['en', 'fr'], docs_version: ['v2.0'] },
    });

    const selectionBar = screen.getByRole('group', {
      name: 'Selected search filters',
    });
    expect(selectionBar).toHaveTextContent('En');
    expect(selectionBar).toHaveTextContent('Fr');
    expect(selectionBar).toHaveTextContent('V2.0');
    expect(
      screen.getAllByRole('button', { name: /^Clear filter:/ })
    ).toHaveLength(3);
  });

  it('clears only the dismissed value when dismissing its chip', () => {
    const { onSelectionChange } = renderFacetBar({
      selections: { language: ['en', 'fr'], docs_version: ['v2.0'] },
    });

    const dismissEnglish = screen.getByRole('button', {
      name: 'Clear filter: En (Language)',
    });
    fireEvent.click(dismissEnglish);

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith('language', ['fr']);
  });

  it('clears every selection when clicking "Clear all"', () => {
    const { clearSelections } = renderFacetBar({
      selections: { language: ['en'], docs_version: ['v2.0'] },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(clearSelections).toHaveBeenCalledTimes(1);
  });

  it('uses custom translations', () => {
    renderFacetBar({
      selections: { language: ['en'] },
      translations: {
        clearAllLabel: 'Tout effacer',
        facetsAriaLabel: 'Filtres',
        selectedFacetsAriaLabel: 'Filtres actifs',
      },
    });

    expect(screen.getByRole('group', { name: 'Filtres' })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Filtres actifs' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Tout effacer' })
    ).toBeInTheDocument();
  });

  describe('focus management', () => {
    it('moves focus to the next chip when dismissing a chip with siblings', () => {
      render(
        <StatefulFacetBar
          initialSelections={{ language: ['en'], docs_version: ['v2.0'] }}
        />
      );

      const dismissLanguage = screen.getByRole('button', {
        name: 'Clear filter: En (Language)',
      });
      dismissLanguage.focus();
      fireEvent.click(dismissLanguage);

      expect(
        screen.queryByRole('button', { name: 'Clear filter: En (Language)' })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: 'Clear filter: V2.0 (Version)',
        })
      ).toHaveFocus();
    });

    it('moves focus to the next chip of the same facet when dismissing one of its values', () => {
      render(
        <StatefulFacetBar initialSelections={{ language: ['en', 'fr'] }} />
      );

      const dismissEnglish = screen.getByRole('button', {
        name: 'Clear filter: En (Language)',
      });
      dismissEnglish.focus();
      fireEvent.click(dismissEnglish);

      expect(
        screen.queryByRole('button', { name: 'Clear filter: En (Language)' })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Clear filter: Fr (Language)' })
      ).toHaveFocus();
    });

    it('moves focus to the previous chip when dismissing the last chip in the row', () => {
      render(
        <StatefulFacetBar
          initialSelections={{ language: ['en'], docs_version: ['v2.0'] }}
        />
      );

      const dismissVersion = screen.getByRole('button', {
        name: 'Clear filter: V2.0 (Version)',
      });
      dismissVersion.focus();
      fireEvent.click(dismissVersion);

      expect(
        screen.getByRole('button', { name: 'Clear filter: En (Language)' })
      ).toHaveFocus();
    });

    it("moves focus to the facet's menu trigger when dismissing the only chip", () => {
      render(<StatefulFacetBar initialSelections={{ language: ['en'] }} />);

      const dismiss = screen.getByRole('button', {
        name: 'Clear filter: En (Language)',
      });
      dismiss.focus();
      fireEvent.click(dismiss);

      // Selection bar unmounted entirely…
      expect(
        screen.queryByRole('group', { name: 'Selected search filters' })
      ).not.toBeInTheDocument();
      // …and focus landed on the cleared facet's trigger (label no longer announces a selection)
      expect(screen.getByRole('button', { name: 'Language' })).toHaveFocus();
    });

    it('moves focus to the first facet trigger when clicking "Clear all"', () => {
      render(
        <StatefulFacetBar
          initialSelections={{ language: ['en'], docs_version: ['v2.0'] }}
        />
      );

      const clearAll = screen.getByRole('button', { name: 'Clear all' });
      clearAll.focus();
      fireEvent.click(clearAll);

      expect(
        screen.queryByRole('group', { name: 'Selected search filters' })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Language' })).toHaveFocus();
    });
  });
});
