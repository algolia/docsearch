import type { SearchResponse } from 'algoliasearch/lite';
import { useEffect, useState } from 'react';

import { SUGGESTED_QUETIONS_INDEX_NAME } from './constants';

import type {
  DocSearchTransformClient,
  SuggestedQuestion,
  SuggestedQuestionHit,
} from '.';

type UseSuggestedQuestionsProps = {
  agentId: string | null;
  searchClient: DocSearchTransformClient;
  suggestedQuestionsEnabled?: boolean;
};

export const useSuggestedQuestions = ({
  agentId,
  searchClient,
  suggestedQuestionsEnabled = false,
}: UseSuggestedQuestionsProps): SuggestedQuestionHit[] => {
  const [suggestedQuestions, setSuggestedQuestions] = useState<
    SuggestedQuestionHit[]
  >([]);

  useEffect(() => {
    const getSuggestedQuestions = async (): Promise<void> => {
      const { results } = await searchClient.search<SuggestedQuestion>({
        requests: [
          {
            indexName: SUGGESTED_QUETIONS_INDEX_NAME,
            filters: `state:published AND assistantId:${agentId}`,
            hitsPerPage: 3,
          },
        ],
      });

      const result = results[0] as SearchResponse<SuggestedQuestion>;

      setSuggestedQuestions(result.hits);
    };

    if (suggestedQuestionsEnabled && agentId && agentId !== '') {
      getSuggestedQuestions();
    }
  }, [suggestedQuestionsEnabled, agentId, searchClient]);

  return suggestedQuestions;
};
