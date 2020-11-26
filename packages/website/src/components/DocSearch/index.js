import React, { useRef, useEffect } from 'react';
import Head from '@docusaurus/Head';

export default function DocSearch({ appId, indexName, apiKey }) {
  const docsearchRef = useRef(null);
  useEffect(() => {
    if (!docsearchRef.current) {
      return;
    }
    import('docsearch.js').then(({ default: docsearch }) => {
      docsearch({
        appId,
        apiKey,
        indexName,
        inputSelector: `#${docsearchRef.current.id}`,
        autocompleteOptions: {
          hint: false,
          appendTo: '.sbx-docsearch-demo__wrapper',
        },
      });
    });
  }, [docsearchRef, indexName, apiKey]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
        />
      </Head>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="sbx-icon-search-13"
            viewBox="0 0 40 40"
          >
            <path
              d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"
              fillRule="evenodd"
            />
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="sbx-icon-clear-3"
            viewBox="0 0 20 20"
          >
            <path
              d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"
              fillRule="evenodd"
            />
          </symbol>
        </svg>
        <form noValidate="novalidate" className="sbx-docsearch-demo">
          <div role="search" className="sbx-docsearch-demo__wrapper">
            <input
              id="q"
              type="search"
              name="search"
              placeholder="Search documentation..."
              autoComplete="off"
              required="required"
              className="mb-2 sbx-docsearch-demo__input"
              ref={docsearchRef}
            />
            <button
              type="submit"
              title="Submit your search query."
              className="sbx-docsearch-demo__submit"
            >
              <svg role="img" aria-label="Search">
                <use xlinkHref="#sbx-icon-search-13"></use>
              </svg>
            </button>
            <button
              type="reset"
              title="Clear the search query."
              className="sbx-docsearch-demo__reset"
            >
              <svg role="img" aria-label="Reset">
                <use xlinkHref="#sbx-icon-clear-3"></use>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
