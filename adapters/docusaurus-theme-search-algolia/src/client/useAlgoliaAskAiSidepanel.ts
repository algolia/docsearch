/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { AskAiConfig } from '@docsearch/docusaurus-adapter';
import { useCallback, useMemo, useRef, useState } from 'react';

type AskAiTogglePayload = {
  query: string;
  messageId?: string;
  suggestedQuestionId?: string;
};

type SidepanelOptions = Exclude<NonNullable<AskAiConfig['sidePanel']>, boolean>;

type UseAlgoliaAskAiSidepanelParams = {
  askAiConfig?: AskAiConfig;
  importSidepanel: () => Promise<void>;
};

type UseAlgoliaAskAiSidepanelResult = {
  sidePanelEnabled: boolean;
  showSidepanelButton: boolean;
  sidePanelOptions?: SidepanelOptions;
  sidePanelAgentStudio: boolean;
  sidepanelPortalContainer: HTMLElement | null;
  isSidepanelOpen: boolean;
  sidepanelInitialMessage?: AskAiTogglePayload;
  openSidepanel: (payload?: AskAiTogglePayload) => void;
  closeSidepanel: () => void;
  toggleSidepanel: () => void;
  handleSidepanelOpen: () => void;
  loadSidepanel: () => Promise<void>;
};

export function useAlgoliaAskAiSidepanel({
  askAiConfig,
  importSidepanel,
}: UseAlgoliaAskAiSidepanelParams): UseAlgoliaAskAiSidepanelResult {
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false);
  const [sidepanelInitialMessage, setSidepanelInitialMessage] = useState<AskAiTogglePayload | undefined>(undefined);
  const openRequestId = useRef(0);

  const sidePanelConfig = askAiConfig?.sidePanel;
  const sidePanelEnabled = Boolean(sidePanelConfig);
  const sidePanelOptions = typeof sidePanelConfig === 'object' ? sidePanelConfig : undefined;
  const showSidepanelButton = sidePanelEnabled && sidePanelOptions?.hideButton !== true;
  const sidePanelAgentStudio = askAiConfig?.agentStudio ?? false;

  const sidepanelPortalContainer = useMemo(() => {
    return typeof document !== 'undefined' ? document.body : null;
  }, []);

  const loadSidepanel = useCallback(() => {
    return importSidepanel();
  }, [importSidepanel]);

  const openSidepanel = useCallback(
    (payload?: AskAiTogglePayload) => {
      if (!sidePanelEnabled || !askAiConfig) {
        return;
      }
      const initialMessage =
        payload?.query && payload.query.length > 0
          ? {
              query: payload.query,
              messageId: payload.messageId,
              suggestedQuestionId: payload.suggestedQuestionId,
            }
          : undefined;
      const requestId = openRequestId.current + 1;
      openRequestId.current = requestId;
      setSidepanelInitialMessage(initialMessage);
      loadSidepanel().then(() => {
        if (openRequestId.current === requestId) {
          setIsSidepanelOpen(true);
        }
      });
    },
    [askAiConfig, loadSidepanel, sidePanelEnabled],
  );

  const closeSidepanel = useCallback(() => {
    openRequestId.current += 1;
    setIsSidepanelOpen(false);
    setSidepanelInitialMessage(undefined);
  }, []);

  const toggleSidepanel = useCallback(() => {
    if (isSidepanelOpen) {
      closeSidepanel();
      return;
    }
    openSidepanel();
  }, [closeSidepanel, isSidepanelOpen, openSidepanel]);

  const handleSidepanelOpen = useCallback(() => {
    setIsSidepanelOpen(true);
  }, []);

  return {
    sidePanelEnabled,
    showSidepanelButton,
    sidePanelOptions,
    sidePanelAgentStudio,
    sidepanelPortalContainer,
    isSidepanelOpen,
    sidepanelInitialMessage,
    openSidepanel,
    closeSidepanel,
    toggleSidepanel,
    handleSidepanelOpen,
    loadSidepanel,
  };
}
