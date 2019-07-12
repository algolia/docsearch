/** @jsx h */

import { h, Component } from 'preact';
import Downshift from 'downshift/preact';
import {
  DocSearchHit,
  DocSearchHits,
  QueryParameters,
  Result,
} from 'docsearch-types';

import { AutocompleteResults } from './AutocompleteResults';
import { AutocompleteNoResults } from './AutocompleteNoResults';
import { AutocompleteFooter } from './AutocompleteFooter';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      animateTransform: SVGAttributes;
    }
  }
}

interface AutocompleteProps {
  placeholder: string;
  stalledSearchDelay: number;
  search(
    searchParameters: QueryParameters
  ): Promise<{ hits: DocSearchHits; result: Result }>;
  onItemSelect?({ hit }: { hit: DocSearchHit }): void;
}

interface AutocompleteState {
  query: string;
  hits: DocSearchHits;
  isDropdownOpen: boolean;
  isLoading: boolean;
  isStalled: boolean;
}

let docsearchIdCounter = 0;

/**
 * Generates a unique ID for an instance of a DocSearch DownShift instance.
 */
function generateId(): string {
  return String(docsearchIdCounter++);
}

function stateReducer(state: any, changes: any) {
  switch (changes.type) {
    case Downshift.stateChangeTypes.mouseUp:
      return {
        ...changes,
        inputValue: state.inputValue,
      };
    case Downshift.stateChangeTypes.blurInput:
      return {
        ...changes,
        inputValue: state.inputValue,
      };
    default:
      return changes;
  }
}

let setIsStalledId: number | null;

export class Autocomplete extends Component<
  AutocompleteProps,
  AutocompleteState
> {
  private inputRef: null | HTMLElement;

  constructor(props: AutocompleteProps) {
    super(props);

    this.state = {
      query: '',
      hits: {},
      isDropdownOpen: false,
      isLoading: false,
      isStalled: false,
    };
    this.inputRef = null;
  }

  render() {
    const hasQuery = this.state.query.length > 0;
    const hasResults = Object.keys(this.state.hits).length > 0;
    const isOpen =
      this.state.isDropdownOpen &&
      // We don't want to open the dropdown when the results
      // are loading coming from an empty input.
      !(this.state.isLoading && !hasResults) &&
      // However, we do want to leave the dropdown open when it's
      // already open because there are results displayed. Otherwise,
      // it would result in a flashy behavior.
      hasQuery;

    return (
      <Downshift
        id={`docsearch-${generateId()}`}
        itemToString={() => ''}
        defaultHighlightedIndex={0}
        onSelect={(item: DocSearchHit) => {
          this.setState({
            isDropdownOpen: false,
          });

          if (item) {
            this.props.onItemSelect!({ hit: item });
          }
        }}
        onOuterClick={() => {
          this.setState({
            isDropdownOpen: false,
          });
        }}
        scrollIntoView={(itemNode: HTMLElement) => {
          if (itemNode) {
            itemNode.scrollIntoView(false);
          }
        }}
        stateReducer={stateReducer}
      >
        {({ getInputProps, getItemProps, getMenuProps }) => (
          <div
            className={[
              'algolia-docsearch',
              this.state.isStalled && 'algolia-docsearch--stalled',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <form
              action=""
              role="search"
              noValidate
              className="algolia-docsearch-form"
            >
              <label
                for={getInputProps().id}
                className="algolia-docsearch-magnifierLabel"
              >
                <svg viewBox="0 0 18 18">
                  <path
                    d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
                    stroke="currentColor"
                    stroke-width="1.78"
                    fill="none"
                    fill-rule="evenodd"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </label>

              <div className="algolia-docsearch-loadingIndicator">
                <svg
                  viewBox="0 0 38 38"
                  stroke="currentColor"
                  stroke-opacity=".5"
                >
                  <g fill="none" fill-rule="evenodd">
                    <g transform="translate(1 1)" stroke-width="2">
                      <circle stroke-opacity=".3" cx="18" cy="18" r="18" />
                      <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from="0 18 18"
                          to="360 18 18"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  </g>
                </svg>
              </div>

              <input
                {...getInputProps({
                  placeholder: this.props.placeholder,
                  ref: (ref: HTMLElement) => {
                    this.inputRef = ref;
                  },
                  type: 'search',
                  autoComplete: 'off',
                  autoCorrect: 'off',
                  autoCapitalize: 'off',
                  spellCheck: 'false',
                  maxLength: '512',
                  value: this.state.query,
                  onChange: (event: any) => {
                    if (setIsStalledId) {
                      clearTimeout(setIsStalledId);
                    }

                    this.setState({
                      isLoading: true,
                      isStalled: false,
                      query: event.target.value,
                    });

                    setIsStalledId =
                      typeof window === 'undefined'
                        ? null
                        : window.setTimeout(() => {
                            this.setState({
                              isStalled: true,
                            });
                          }, this.props.stalledSearchDelay);

                    this.props
                      .search({
                        query: this.state.query,
                      })
                      .then(({ hits }) => {
                        if (setIsStalledId) {
                          clearTimeout(setIsStalledId);
                        }

                        this.setState({
                          hits,
                          isLoading: false,
                          isStalled: false,
                          isDropdownOpen: true,
                        });
                      })
                      .catch(error => {
                        if (setIsStalledId) {
                          clearTimeout(setIsStalledId);
                        }

                        this.setState({
                          isLoading: false,
                          isStalled: false,
                          isDropdownOpen: false,
                        });

                        throw error;
                      });
                  },
                  onFocus: () => {
                    if (hasQuery) {
                      this.setState({
                        isDropdownOpen: true,
                      });
                    }
                  },
                  onKeyDown: (event: KeyboardEvent) => {
                    if (event.key === 'Escape') {
                      this.setState({
                        query: '',
                        isDropdownOpen: false,
                      });
                    }
                  },
                })}
                className="algolia-docsearch-input"
              />

              <button
                type="reset"
                title="Clear the query"
                className="algolia-docsearch-reset"
                hidden={this.state.query.length === 0}
                onClick={() => {
                  this.setState({
                    query: '',
                  });

                  this.inputRef!.focus();
                }}
              >
                <svg viewBox="0 0 10 10">
                  <path
                    d="M5 4.12L8.93.18a.62.62 0 1 1 .89.89L5.88 5l3.94 3.93a.62.62 0 1 1-.89.89L5 5.88 1.07 9.82a.62.62 0 1 1-.89-.89L4.12 5 .18 1.07a.62.62 0 1 1 .89-.89L5 4.12z"
                    fill="currentColor"
                    fill-rule="evenodd"
                  />
                </svg>
              </button>
            </form>

            {isOpen && (
              <div className="algolia-docsearch-dropdown">
                <div className="algolia-docsearch-dropdown-container">
                  {!this.state.isLoading && !hasResults ? (
                    <AutocompleteNoResults query={this.state.query} />
                  ) : (
                    <AutocompleteResults
                      hits={this.state.hits}
                      getItemProps={getItemProps}
                      getMenuProps={getMenuProps}
                    />
                  )}

                  <AutocompleteFooter />
                </div>
              </div>
            )}
          </div>
        )}
      </Downshift>
    );
  }
}

Autocomplete.defaultProps = {
  placeholder: '',
  stalledSearchDelay: 300,
  onItemSelect: ({ hit }) => {
    if (typeof window !== 'undefined') {
      window.location.assign(hit.url);
    }
  },
};
