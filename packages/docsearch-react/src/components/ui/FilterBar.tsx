import React, { type JSX } from 'react';

import type { DocSearchFacet } from '../../DocSearch';
import { ChevronIcon } from '../../icons';
import { getFacetLabel } from '../../utils/facets';

import { Menu } from './Menu';

export type FilterBarFacet = DocSearchFacet & {
  values: string[];
};

export function FilterBar({
  facets,
  selections,
  onSelectionChange,
}: {
  facets: FilterBarFacet[];
  selections: Record<string, string>;
  onSelectionChange: (facet: string, value: string) => void;
}): JSX.Element | null {
  if (facets.length === 0) {
    return null;
  }

  return (
    <div className="DocSearch-FilterBar" role="toolbar" aria-label="Search filters">
      {facets.map((facet) => {
        const selectedValue = selections[facet.key] ?? '';
        const label = getFacetLabel(facet);

        return (
          <Menu key={facet.key}>
            <Menu.Trigger
              className={
                selectedValue
                  ? 'DocSearch-FilterBar-Trigger DocSearch-FilterBar-Trigger--Active'
                  : 'DocSearch-FilterBar-Trigger'
              }
            >
              <span className="DocSearch-FilterBar-Trigger-Label">{label}</span>
              <span aria-hidden="true" className="DocSearch-FilterBar-Trigger-Icon">
                <ChevronIcon size={16} />
              </span>
            </Menu.Trigger>
            <Menu.Popup>
              <Menu.RadioGroup value={selectedValue} onValueChange={(value) => onSelectionChange(facet.key, value)}>
                <Menu.RadioItem className="DocSearch-FilterBar-Option" value="" label={`All ${label}`}>
                  All
                </Menu.RadioItem>
                {facet.values.map((value) => (
                  <Menu.RadioItem className="DocSearch-FilterBar-Option" key={value} value={value} label={value}>
                    {value}
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu>
        );
      })}
    </div>
  );
}
