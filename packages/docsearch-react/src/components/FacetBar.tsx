import React, { type JSX } from 'react';

import type { DocSearchFacet } from '../DocSearch';
import { ChevronIcon } from '../icons';
import { capitalize } from '../utils';
import { getFacetLabel } from '../utils/facets';

import { Chip } from './ui/Chip';
import { Menu } from './ui/Menu';

export type FacetBarTranslations = Partial<{
  /**
   * Label displayed as the default (all) facet option.
   *
   * @default "All"
   */
  defaultValueLabel: string;
  /**
   * Facet menu trigger aria label when a facet is selected.
   *
   * @default "selected"
   */
  facetMenuTriggerAriaLabel: string;
  /**
   * Label displayed for clearing all facets action.
   *
   * @default "Clear all"
   */
  clearAllLabel: string;
  /**
   * Aria label for the list of possible facets.
   *
   * @default "Search filters"
   */
  facetsAriaLabel: string;
  /**
   * Aria label for the list of selected facets.
   *
   * @default "Selected search filters"
   */
  selectedFacetsAriaLabel: string;
  /**
   * Aria label indicating to clear a selected facet.
   *
   * @default "Clear filter:"
   */
  clearFacetAriaLabel: string;
}>;

export interface FacetBarFacet extends DocSearchFacet {
  values: string[];
}

interface FacetMenuProps {
  facet: FacetBarFacet;
  selectedValue: string;
  defaultValueLabel: string;
  menuTriggerSelectedAriaLabel: string;
  onSelectionChange: (facet: string, value: string) => void;
  registerTrigger: (facetKey: string, el: HTMLButtonElement | null) => void;
}

const FacetMenu = React.memo(function FacetMenu({
  facet,
  selectedValue,
  defaultValueLabel,
  onSelectionChange,
  registerTrigger,
  menuTriggerSelectedAriaLabel,
}: FacetMenuProps): JSX.Element {
  const label = getFacetLabel(facet);
  const handleValueChange = React.useCallback(
    (value: string) => {
      onSelectionChange(facet.key, value);
    },
    [facet.key, onSelectionChange],
  );
  const triggerRef = React.useCallback(
    (el: HTMLButtonElement | null) => {
      registerTrigger(facet.key, el);
    },
    [facet.key, registerTrigger],
  );

  return (
    <Menu>
      <Menu.Trigger
        ref={triggerRef}
        data-has-selection={Boolean(selectedValue)}
        aria-label={selectedValue ? `${label}, ${selectedValue} ${menuTriggerSelectedAriaLabel}` : label}
      >
        <span>{capitalize(label)}</span>
        <ChevronIcon />
      </Menu.Trigger>
      <Menu.Popup>
        <Menu.RadioGroup value={selectedValue} onValueChange={handleValueChange}>
          <Menu.RadioItem value="" label={`${defaultValueLabel} ${label}`}>
            {defaultValueLabel}
          </Menu.RadioItem>
          {facet.values.map((value) => (
            <Menu.RadioItem key={value} value={value} label={value}>
              {capitalize(value)}
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      </Menu.Popup>
    </Menu>
  );
});

interface SelectedFacetChipProps {
  facetKey: string;
  facetLabel: string;
  value: string;
  dismissAriaLabel: string;
  onDismiss: (facetKey: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

const SelectedFacetChip = React.memo(function SelectedFacetChip({
  facetKey,
  facetLabel,
  value,
  dismissAriaLabel,
  onDismiss,
}: SelectedFacetChipProps): JSX.Element {
  const handleDismissFacet = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onDismiss(facetKey, e);
    },
    [facetKey, onDismiss],
  );

  return (
    <Chip>
      {capitalize(value)}
      <Chip.Dismiss
        aria-label={`${dismissAriaLabel} ${capitalize(value)} (${facetLabel})`}
        onClick={handleDismissFacet}
      />
    </Chip>
  );
});

interface FacetBarProps {
  facets: FacetBarFacet[];
  selections: Record<string, string>;
  onSelectionChange: (facet: string, value: string) => void;
  clearSelections: () => void;
  translations?: FacetBarTranslations;
}

export const FacetBar = React.memo(function FacetBar({
  facets,
  selections,
  onSelectionChange,
  clearSelections,
  translations = {},
}: FacetBarProps): JSX.Element | null {
  const {
    defaultValueLabel = 'All',
    facetMenuTriggerAriaLabel = 'selected',
    clearAllLabel = 'Clear all',
    facetsAriaLabel = 'Search filters',
    selectedFacetsAriaLabel = 'Selected search filters',
    clearFacetAriaLabel = 'Clear filter:',
  } = translations;
  const selectionsToDisplay = React.useMemo(() => {
    return Object.entries(selections).filter(([_, value]) => Boolean(value));
  }, [selections]);

  const triggerRefs = React.useRef(new Map<string, HTMLButtonElement>());

  const registerTrigger = React.useCallback((facetKey: string, el: HTMLButtonElement | null) => {
    if (el) {
      triggerRefs.current.set(facetKey, el);
    } else {
      triggerRefs.current.delete(facetKey);
    }
  }, []);

  const handleDismissFacet = React.useCallback(
    (facetKey: string, ev: React.MouseEvent<HTMLButtonElement>) => {
      const dismissButton = ev.currentTarget;
      const selectionBar = dismissButton.closest('.DocSearch-FacetSelectionBar');

      if (selectionBar) {
        const dismissButtons = Array.from(selectionBar.querySelectorAll<HTMLButtonElement>('.DocSearch-Chip-Dismiss'));
        const index = dismissButtons.indexOf(dismissButton);
        const target = dismissButtons[index + 1] ?? dismissButtons[index - 1] ?? triggerRefs.current.get(facetKey);

        target?.focus();
      }

      onSelectionChange(facetKey, '');
    },
    [onSelectionChange],
  );

  const handleClearAll = React.useCallback(() => {
    triggerRefs.current.values().next().value?.focus();
    clearSelections();
  }, [clearSelections]);

  const facetLabels = React.useMemo(() => new Map(facets.map((f) => [f.key, getFacetLabel(f)])), [facets]);

  if (facets.length === 0) {
    return null;
  }

  return (
    <>
      <div className="DocSearch-FacetBar" role="group" aria-label={facetsAriaLabel}>
        {facets.map((facet) => {
          const selectedValue = selections[facet.key] ?? '';

          return (
            <FacetMenu
              key={facet.key}
              facet={facet}
              selectedValue={selectedValue}
              defaultValueLabel={defaultValueLabel}
              registerTrigger={registerTrigger}
              menuTriggerSelectedAriaLabel={facetMenuTriggerAriaLabel}
              onSelectionChange={onSelectionChange}
            />
          );
        })}
      </div>
      {selectionsToDisplay.length > 0 && (
        <div className="DocSearch-FacetSelectionBar" role="group" aria-label={selectedFacetsAriaLabel}>
          {selectionsToDisplay.map(([key, value]) => (
            <SelectedFacetChip
              key={key}
              facetKey={key}
              facetLabel={facetLabels.get(key) ?? key}
              value={value}
              dismissAriaLabel={clearFacetAriaLabel}
              onDismiss={handleDismissFacet}
            />
          ))}
          <button type="button" className="DocSearch-FacetSelectionBar-Action" onClick={handleClearAll}>
            {clearAllLabel}
          </button>
        </div>
      )}
    </>
  );
});
