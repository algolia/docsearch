/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { translate } from '@docusaurus/Translate';
import clsx from 'clsx';
import React, { useState, type ReactNode } from 'react';

import type { DocsSearchVersionsHelpers } from '../hooks/useDocsSearchVersions';
import styles from '../styles.module.css';
import type { FacetGroup, Refinements } from '../types';

type SearchFacetsProps = {
  facets: FacetGroup[];
  refinements: Refinements;
  onToggle: (attribute: string, value: string) => void;
  onClear: () => void;
  hasActiveRefinements: boolean;
  showVersionSelects: boolean;
  versionHelpers: DocsSearchVersionsHelpers;
};

function VersionSelects({ versionHelpers }: { versionHelpers: DocsSearchVersionsHelpers }): ReactNode {
  const versionedPluginEntries = Object.entries(versionHelpers.allDocsData).filter(
    ([, docsData]) => docsData.versions.length > 1,
  );

  if (versionedPluginEntries.length === 0) {
    return null;
  }

  return (
    <div className={styles.facetGroup}>
      <h3 className={styles.facetLabel}>
        {translate({
          id: 'theme.SearchPage.versionLabel',
          message: 'Version',
          description: 'The label above the documentation version selectors',
        })}
      </h3>
      {versionedPluginEntries.map(([pluginId, docsData]) => {
        const labelPrefix = versionedPluginEntries.length > 1 ? `${pluginId}: ` : '';
        return (
          <select
            key={pluginId}
            defaultValue={versionHelpers.searchVersions[pluginId]}
            className={styles.versionSelect}
            onBlur={(event) => versionHelpers.setSearchVersion(pluginId, event.target.value)}
          >
            {docsData.versions.map((version) => (
              <option key={version.name} label={`${labelPrefix}${version.label}`} value={version.name} />
            ))}
          </select>
        );
      })}
    </div>
  );
}

export function SearchFacets({
  facets,
  refinements,
  onToggle,
  onClear,
  hasActiveRefinements,
  showVersionSelects,
  versionHelpers,
}: SearchFacetsProps): ReactNode {
  const [open, setOpen] = useState(false);

  const activeCount = Object.values(refinements).reduce((sum, values) => sum + values.length, 0);

  return (
    <aside
      className={styles.sidebar}
      aria-label={translate({
        id: 'theme.SearchPage.filtersLabel',
        message: 'Search filters',
        description: 'The ARIA label for the search filters sidebar',
      })}
    >
      <button
        type="button"
        className={styles.filtersToggle}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          {translate({
            id: 'theme.SearchPage.filtersToggle',
            message: 'Filters',
            description: 'The label for the mobile filters toggle button',
          })}
        </span>
        {activeCount > 0 && <span className={styles.filtersToggleBadge}>{activeCount}</span>}
      </button>

      <div className={clsx(styles.sidebarPanel, open && styles.sidebarPanelOpen)}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>
            {translate({
              id: 'theme.SearchPage.filtersTitle',
              message: 'Filters',
              description: 'The title of the search filters sidebar',
            })}
          </span>
          {hasActiveRefinements && (
            <button type="button" className={styles.clearFacetsButton} onClick={onClear}>
              {translate({
                id: 'theme.SearchPage.clearFilters',
                message: 'Clear all',
                description: 'The label for the button that clears all active filters',
              })}
            </button>
          )}
        </div>

        {showVersionSelects && <VersionSelects versionHelpers={versionHelpers} />}

        {facets.map((group) => (
          <div key={group.attribute} className={styles.facetGroup}>
            <h3 className={styles.facetLabel}>{group.label}</h3>
            <ul className={styles.facetList}>
              {group.items.map((value) => {
                const isChecked = refinements[group.attribute]?.includes(value.name) ?? value.isRefined;
                return (
                  <li key={value.name}>
                    <label className={styles.facetItem}>
                      <input
                        type="checkbox"
                        className={styles.facetCheckbox}
                        checked={isChecked}
                        onChange={() => onToggle(group.attribute, value.name)}
                      />
                      <span className={styles.facetName}>{value.name}</span>
                      <span className={styles.facetCount}>{value.count}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
