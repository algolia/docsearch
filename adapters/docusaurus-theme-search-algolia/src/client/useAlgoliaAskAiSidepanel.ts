/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import type { ThemeConfigDocSearch } from '@docsearch/docusaurus-adapter';
import { useMemo } from 'react';

type SidepanelOptions = Exclude<
  NonNullable<ThemeConfigDocSearch['sidePanel']>,
  boolean
>;

type UseAlgoliaAskAiSidepanelParams = {
  sidePanel?: ThemeConfigDocSearch['sidePanel'];
};

type UseAlgoliaAskAiSidepanelResult = {
  sidePanelEnabled: boolean;
  showSidepanelButton: boolean;
  sidePanelOptions?: SidepanelOptions;
};

export function useAlgoliaAskAiSidepanel({
  sidePanel,
}: UseAlgoliaAskAiSidepanelParams): UseAlgoliaAskAiSidepanelResult {
  const sidePanelOptions = useMemo(
    () => (typeof sidePanel === 'object' ? sidePanel : undefined),
    [sidePanel]
  );
  const sidePanelEnabled = Boolean(sidePanel);
  const showSidepanelButton =
    sidePanelEnabled && sidePanelOptions?.hideButton !== true;

  return {
    sidePanelEnabled,
    showSidepanelButton,
    sidePanelOptions,
  };
}
