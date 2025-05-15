import type { AskAiState } from '../useAskAi';

import type { DocSearchHit } from './DocSearchHit';

export type StoredDocSearchHit = Omit<DocSearchHit, '_highlightResult' | '_snippetResult'>;
export type StoredAskAiState = Omit<DocSearchHit, '_highlightResult' | '_snippetResult'> & { askState?: AskAiState };
