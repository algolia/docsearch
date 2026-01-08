import { DocSearch } from '@docsearch/core';
import { DocSearchButton, DocSearchModal } from '@docsearch/modal';
import { Sidepanel, SidepanelButton } from '@docsearch/sidepanel';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useHistory } from '@docusaurus/router';
import React from 'react';
import { createPortal } from 'react-dom';

import '@docsearch/css/dist/sidepanel.css';

const APP_ID = 'beta3G7FSQDJR3';
const API_KEY = '0faad3eae2ba413c16355a0f8670c201';
const ASSISTANT_ID = 'e3Kl4lTCBlSA';
const ASK_AI_INDEX_NAME = 'docsearch-markdown';

function useSearchResultUrlProcessor() {
  return React.useCallback((url) => {
    const parsedURL = new URL(url);

    // Otherwise => transform to relative URL for SPA navigation
    const relativeUrl = `${parsedURL.pathname + parsedURL.hash}`;

    return relativeUrl;
  }, []);
}

function useNavigator() {
  const history = useHistory();
  const [navigator] = React.useState(() => {
    return {
      navigate(params) {
        history.push(params.itemUrl);
      },
    };
  });
  return navigator;
}

function useTransformItems() {
  const processSearchResultUrl = useSearchResultUrlProcessor();
  const [transformItems] = React.useState(() => {
    return (items) =>
      items.map((item) => ({
        ...item,
        url: processSearchResultUrl(item.url),
      }));
  });
  return transformItems;
}

export default function Root({ children }) {
  const navigator = useNavigator();
  const transformItems = useTransformItems();

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
                  navigator={navigator}
                  transformItems={transformItems}
                />
              </>,
              document.querySelector('.navbarSearchContainer_Bca1'),
            )}

            <SidepanelButton />
            <Sidepanel
              useStagingEnv={true}
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
