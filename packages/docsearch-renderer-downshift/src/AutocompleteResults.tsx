/** @jsx h */

import { h } from 'preact';
import { DocSearchHit } from 'docsearch-types';

export const AutocompleteResults = ({ getItemProps, getMenuProps, hits }) => {
  return (
    <div className="algolia-docsearch-results">
      <ul {...getMenuProps()}>
        {Object.entries<DocSearchHit[]>(hits).map(([title, hits]) => {
          return (
            <li key={title}>
              <section className="algolia-docsearch-section">
                <ul>
                  <h1
                    className="algolia-docsearch-lvl0"
                    dangerouslySetInnerHTML={{ __html: title }}
                  ></h1>

                  {hits.map(hit => {
                    const { objectID, levels, content, url } = hit;
                    const category = levels[levels.length - 1];

                    return (
                      <li
                        {...getItemProps({
                          key: objectID,
                          item: hit,
                        })}
                      >
                        <a
                          href={url}
                          className="algolia-docsearch-content"
                          tabIndex={0}
                        >
                          <h2
                            className="algolia-docsearch-lvl1"
                            dangerouslySetInnerHTML={{
                              __html: category,
                            }}
                          ></h2>
                          <h3
                            className="algolia-docsearch-lvl2"
                            dangerouslySetInnerHTML={{
                              __html: [title, levels[1]]
                                .filter(Boolean)
                                .join(' / '),
                            }}
                          ></h3>
                          <p
                            className="algolia-docsearch-paragraph"
                            dangerouslySetInnerHTML={{
                              __html: content,
                            }}
                          />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
