/** @jsx h */

import { h, Component } from 'preact';
import Downshift from 'downshift/preact';
import {
  DocSearchHit,
  DocSearchHits,
  QueryParameters,
  Result,
} from 'docsearch-types';

import { Dropdown } from './Dropdown';
import { SearchBox } from './SearchBox';

type DocSearchProps = {
  placeholder: string;
  stalledSearchDelay: number;
  search(
    searchParameters: QueryParameters
  ): Promise<{ hits: DocSearchHits; result: Result }>;
  onItemSelect?({ hit }: { hit: DocSearchHit }): void;
} & typeof defaultProps;

type DocSearchState = {
  query: string;
  hits: DocSearchHits;
  isDropdownOpen: boolean;
  isLoading: boolean;
  isStalled: boolean;
};

let setIsStalledId: number | null;
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

const defaultProps = {
  placeholder: '',
  stalledSearchDelay: 300,
  onItemSelect: ({ hit }) => {
    if (typeof window !== 'undefined') {
      window.location.assign(hit.url);
    }
  },
};

export class DocSearch extends Component<DocSearchProps, DocSearchState> {
  static defaultProps = defaultProps;

  state = {
    query: '',
    hits: {},
    isDropdownOpen: false,
    isLoading: false,
    isStalled: false,
  };

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
            this.props.onItemSelect({ hit: item });
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
            <SearchBox
              placeholder={this.props.placeholder}
              query={this.state.query}
              getInputProps={getInputProps}
              onFocus={() => {
                if (hasQuery) {
                  this.setState({
                    isDropdownOpen: true,
                  });
                }
              }}
              onKeyDown={(event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                  this.setState({
                    query: '',
                    isDropdownOpen: false,
                  });
                }
              }}
              onReset={() => {
                this.setState({
                  query: '',
                });
              }}
              onChange={(event: any) => {
                if (setIsStalledId) {
                  clearTimeout(setIsStalledId);
                  this.setState({
                    isStalled: false,
                  });
                }

                this.setState({
                  isLoading: true,
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
                      this.setState({
                        isStalled: false,
                      });
                    }

                    this.setState({
                      hits,
                      isLoading: false,
                      isDropdownOpen: true,
                    });
                  })
                  .catch(error => {
                    if (setIsStalledId) {
                      clearTimeout(setIsStalledId);
                      this.setState({
                        isStalled: false,
                      });
                    }

                    this.setState({
                      isLoading: false,
                      isDropdownOpen: false,
                    });

                    throw error;
                  });
              }}
            />

            {isOpen && (
              <Dropdown
                isLoading={this.state.isLoading}
                hits={this.state.hits}
                query={this.state.query}
                hasResults={hasResults}
                getMenuProps={getMenuProps}
                getItemProps={getItemProps}
              />
            )}
          </div>
        )}
      </Downshift>
    );
  }
}
