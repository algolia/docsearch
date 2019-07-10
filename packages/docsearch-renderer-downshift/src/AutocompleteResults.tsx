/** @jsx h */

import { h } from 'preact';
import { DocSearchHit } from 'docsearch-types';

export const AutocompleteResults = ({ getItemProps, getMenuProps, hits }) => {
  return (
    <div className="algolia-docsearch-results">
      <ul {...getMenuProps()}>
        {Object.entries<DocSearchHit[]>(hits).map(([title, hits]) => {
          return (
            <li key={title} className="algolia-docsearch-item">
              <section>
                <ul>
                  <h1
                    className="algolia-docsearch-item-header"
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
                          className="algolia-docsearch-item-body"
                          tabIndex={0}
                        >
                          <h2
                            className="algolia-docsearch-item-body-title"
                            dangerouslySetInnerHTML={{
                              __html: category,
                            }}
                          />
                          <h3
                            className="algolia-docsearch-item-body-subtitle"
                            dangerouslySetInnerHTML={{
                              __html: [levels[0], levels[1]]
                                .filter(Boolean)
                                .join(' / '),
                            }}
                          />
                          <p
                            className="algolia-docsearch-item-body-paragraph"
                            dangerouslySetInnerHTML={{
                              __html: content || '',
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
