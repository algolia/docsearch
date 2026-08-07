/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';
import { useState } from 'react';

export type DocsSearchVersionsHelpers = {
  allDocsData: ReturnType<typeof useAllDocsData>;
  versioningEnabled: boolean;
  searchVersions: { [pluginId: string]: string };
  setSearchVersion: (pluginId: string, searchVersion: string) => void;
};

export function useDocsSearchVersions(): DocsSearchVersionsHelpers {
  const allDocsData = useAllDocsData();

  // State of the version select menus / algolia facet filters
  // docsPluginId -> versionName map
  const [searchVersions, setSearchVersions] = useState<{
    [pluginId: string]: string;
  }>(() =>
    Object.entries(allDocsData).reduce(
      (acc, [pluginId, pluginData]) => ({
        ...acc,
        [pluginId]: pluginData.versions[0]!.name,
      }),
      {}
    )
  );

  const setSearchVersion = (pluginId: string, searchVersion: string): void =>
    setSearchVersions((s) => ({ ...s, [pluginId]: searchVersion }));

  const versioningEnabled = Object.values(allDocsData).some(
    (docsData) => docsData.versions.length > 1
  );

  return {
    allDocsData,
    versioningEnabled,
    searchVersions,
    setSearchVersion,
  };
}
