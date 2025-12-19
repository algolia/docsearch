import { DocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchModal } from '@docsearch/modal';
import { Sidepanel, SidepanelButton } from '@docsearch/sidepanel';
import BrowserOnly from '@docusaurus/BrowserOnly';
import React from 'react';
import { createPortal } from 'react-dom';

import '@docsearch/css/dist/sidepanel.css';

const APP_ID = 'PMZUYBQDAK';
const API_KEY = '24b09689d5b4223813d9b8e48563c8f6';
const ASSISTANT_ID = 'askAIDemo';
const ASK_AI_INDEX_NAME = 'docsearch-markdown';

export default function Root({ children }) {
  return (
    <>
      {children}

      <BrowserOnly>
        {() => (
          <DocSearch>
            {createPortal(
              <>
                <DocSearchButton translations={{ buttonText: 'Go on, give it a search...' }} />
                <DocSearchModal
                  appId={APP_ID}
                  apiKey={API_KEY}
                  indexName="docsearch"
                  askAi={{
                    appId: APP_ID,
                    apiKey: API_KEY,
                    indexName: ASK_AI_INDEX_NAME,
                    assistantId: ASSISTANT_ID,
                  }}
                  placeholder="Search or ask AI"
                  translations={{
                    footer: {
                      poweredByText: 'Powered by',
                    },
                  }}
                />
              </>,
              document.querySelector('.navbarSearchContainer_Bca1'),
            )}

            <SidepanelButton />
            <Sidepanel
              appId={APP_ID}
              apiKey={API_KEY}
              indexName={ASK_AI_INDEX_NAME}
              assistantId={ASSISTANT_ID}
              suggestedQuestions={true}
            />
          </DocSearch>
        )}
      </BrowserOnly>
    </>
  );
}
