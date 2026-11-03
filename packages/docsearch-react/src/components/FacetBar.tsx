import React, { type JSX } from 'react';

import type { DocSearchFacet } from '../DocSearch';
import { ChevronIcon } from '../icons';
import { capitalize } from '../utils';
import type {
  FacetSelections,
  FacetSelectionUpdate,
} from '../utils/createDocSearchSources';
import { getFacetLabel } from '../utils/facets';

import { Chip } from './ui/Chip';
import { Menu } from './ui/Menu';

export type FacetBarTranslations = Partial<{
  /**
   * Label displayed as the default (all) facet option.
   *
   * @default 'All'
   */
  defaultValueLabel: string;
  /**
   * Facet menu trigger aria label suffix when one or more values are selected,
   * for example `Language, en, fr selected`.
   *
   * @default 'selected'
   */
  facetMenuTriggerAriaLabel: string;
  /**
   * Label displayed for clearing all facets action.
   *
   * @default 'Clear all'
   */
  clearAllLabel: string;
  /**
   * Aria label for the list of possible facets.
   *
   * @default 'Search filters'
   */
  facetsAriaLabel: string;
  /**
   * Aria label for the list of selected facets.
   *
   * @default 'Selected search filters'
   */
  selectedFacetsAriaLabel: string;
  /**
   * Aria label indicating to clear a selected facet.
   *
   * @default 'Clear filter:'
   */
  clearFacetAriaLabel: string;
}>;

export interface FacetBarFacet extends DocSearchFacet {
  values: string[];
}

const EMPTY_SELECTION: string[] = [];

interface FacetValueItemProps {
  facetKey: string;
  value: string;
  checked: boolean;
  onToggle: (facetKey: string, value: string) => void;
}

const FacetValueItem = React.memo(function FacetValueItem({
  facetKey,
  value,
  checked,
  onToggle,
}: FacetValueItemProps): JSX.Element {
  const handleCheckedChange = React.useCallback(() => {
    onToggle(facetKey, value);
  }, [facetKey, onToggle, value]);

  return (
    <Menu.CheckboxItem
      checked={checked}
      label={value}
      onCheckedChange={handleCheckedChange}
    >
      {capitalize(value)}
    </Menu.CheckboxItem>
  );
});

function toggleValue(value: string) {
  return (currentValues: string[]): string[] =>
    currentValues.includes(value)
      ? currentValues.filter((selected) => selected !== value)
      : [...currentValues, value];
}

function removeValue(value: string) {
  return (currentValues: string[]): string[] =>
    currentValues.filter((selected) => selected !== value);
}

interface FacetMenuProps {
  facet: FacetBarFacet;
  selectedValues: string[];
  defaultValueLabel: string;
  menuTriggerSelectedAriaLabel: string;
  onSelectionChange: (facet: string, update: FacetSelectionUpdate) => void;
  registerTrigger: (facetKey: string, el: HTMLButtonElement | null) => void;
}

const FacetMenu = React.memo(function FacetMenu({
  facet,
  selectedValues,
  defaultValueLabel,
  onSelectionChange,
  registerTrigger,
  menuTriggerSelectedAriaLabel,
}: FacetMenuProps): JSX.Element {
  const label = getFacetLabel(facet);
  const hasSelection = selectedValues.length > 0;
  const selectedSet = React.useMemo(
    () => new Set(selectedValues),
    [selectedValues]
  );

  const handleToggleValue = React.useCallback(
    (facetKey: string, value: string) => {
      onSelectionChange(facetKey, toggleValue(value));
    },
    [onSelectionChange]
  );

  const handleSelectAll = React.useCallback(() => {
    onSelectionChange(facet.key, EMPTY_SELECTION);
  }, [facet.key, onSelectionChange]);

  const triggerRef = React.useCallback(
    (el: HTMLButtonElement | null) => {
      registerTrigger(facet.key, el);
    },
    [facet.key, registerTrigger]
  );

  return (
    <Menu>
      <Menu.Trigger
        ref={triggerRef}
        data-has-selection={hasSelection}
        aria-label={
          hasSelection
            ? `${label}, ${selectedValues.join(', ')} ${menuTriggerSelectedAriaLabel}`
            : label
        }
      >
        <span>{capitalize(label)}</span>
        <ChevronIcon />
      </Menu.Trigger>
      <Menu.Popup>
        <Menu.Item
          className="DocSearch-Menu-ResetItem"
          label={`${defaultValueLabel} ${label}`}
          onClick={handleSelectAll}
        >
          {defaultValueLabel}
        </Menu.Item>
        {facet.values.map((value) => (
          <FacetValueItem
            key={value}
            facetKey={facet.key}
            value={value}
            checked={selectedSet.has(value)}
            onToggle={handleToggleValue}
          />
        ))}
      </Menu.Popup>
    </Menu>
  );
});

interface SelectedFacetChipProps {
  facetKey: string;
  facetLabel: string;
  value: string;
  dismissAriaLabel: string;
  onDismiss: (
    facetKey: string,
    value: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

const SelectedFacetChip = React.memo(function SelectedFacetChip({
  facetKey,
  facetLabel,
  value,
  dismissAriaLabel,
  onDismiss,
}: SelectedFacetChipProps): JSX.Element | null {
  const handleDismissFacet = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onDismiss(facetKey, value, e);
    },
    [facetKey, onDismiss, value]
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
  selections: FacetSelections;
  onSelectionChange: (facet: string, update: FacetSelectionUpdate) => void;
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
  const visibleFacetKeys = React.useMemo(
    () => new Set(facets.map((f) => f.key)),
    [facets]
  );
  const selectionsToDisplay = React.useMemo(() => {
    const entries: Array<[key: string, value: string]> = [];

    for (const [key, values] of Object.entries(selections)) {
      if (!visibleFacetKeys.has(key)) continue;

      for (const value of values) {
        entries.push([key, value]);
      }
    }

    return entries;
  }, [selections, visibleFacetKeys]);

  const triggerRefs = React.useRef(new Map<string, HTMLButtonElement>());

  const registerTrigger = React.useCallback(
    (facetKey: string, el: HTMLButtonElement | null) => {
      if (el) {
        triggerRefs.current.set(facetKey, el);
      } else {
        triggerRefs.current.delete(facetKey);
      }
    },
    []
  );

  const handleDismissFacet = React.useCallback(
    (
      facetKey: string,
      value: string,
      ev: React.MouseEvent<HTMLButtonElement>
    ) => {
      const dismissButton = ev.currentTarget;
      const selectionBar = dismissButton.closest(
        '.DocSearch-FacetSelectionBar'
      );

      if (selectionBar) {
        const dismissButtons = Array.from(
          selectionBar.querySelectorAll<HTMLButtonElement>(
            '.DocSearch-Chip-Dismiss'
          )
        );
        const index = dismissButtons.indexOf(dismissButton);
        const target =
          dismissButtons[index + 1] ??
          dismissButtons[index - 1] ??
          triggerRefs.current.get(facetKey);

        target?.focus();
      }

      onSelectionChange(facetKey, removeValue(value));
    },
    [onSelectionChange]
  );

  const handleClearAll = React.useCallback(() => {
    triggerRefs.current.values().next().value?.focus();
    clearSelections();
  }, [clearSelections]);

  const facetLabels = React.useMemo(
    () => new Map(facets.map((f) => [f.key, getFacetLabel(f)])),
    [facets]
  );

  if (facets.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className="DocSearch-FacetBar"
        role="group"
        aria-label={facetsAriaLabel}
      >
        {facets.map((facet) => (
          <FacetMenu
            key={facet.key}
            facet={facet}
            selectedValues={selections[facet.key] ?? EMPTY_SELECTION}
            defaultValueLabel={defaultValueLabel}
            registerTrigger={registerTrigger}
            menuTriggerSelectedAriaLabel={facetMenuTriggerAriaLabel}
            onSelectionChange={onSelectionChange}
          />
        ))}
      </div>
      {selectionsToDisplay.length > 0 && (
        <div
          className="DocSearch-FacetSelectionBar"
          role="group"
          aria-label={selectedFacetsAriaLabel}
        >
          {selectionsToDisplay.map(([key, value]) => (
            <SelectedFacetChip
              key={`${key}:${value}`}
              facetKey={key}
              facetLabel={facetLabels.get(key) ?? key}
              value={value}
              dismissAriaLabel={clearFacetAriaLabel}
              onDismiss={handleDismissFacet}
            />
          ))}
          <button
            type="button"
            className="DocSearch-FacetSelectionBar-Action"
            onClick={handleClearAll}
          >
            {clearAllLabel}
          </button>
        </div>
      )}
    </>
  );
});
