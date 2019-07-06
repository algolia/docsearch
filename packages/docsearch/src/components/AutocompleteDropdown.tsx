/** @jsx h */

import { h, Component } from 'preact';
import Downshift from 'downshift/preact';

import { DocSearchHit, DocSearchHits } from '../docsearch';
import { AutocompleteResults, AutocompleteFooter } from '.';

interface AutocompleteProps {
  search(searchParameters: any): Promise<{ hits: any; result: any }>;
  searchParameters?: any;
  onItemSelect?({ hit }: { hit: any }): void;
}

interface AutocompleteState {
  hits: DocSearchHits;
  isDropdownOpen: boolean;
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

export class AutocompleteDropdown extends Component<
  AutocompleteProps,
  AutocompleteState
> {
  constructor(props: AutocompleteProps) {
    super(props);

    this.state = {
      hits: {},
      isDropdownOpen: false,
    };
  }

  render() {
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
          itemNode.scrollIntoView(false);
        }}
        stateReducer={stateReducer}
      >
        {({ getInputProps, getItemProps, getMenuProps, inputValue }) => (
          <div>
            <form action="" role="search" noValidate>
              <input
                {...getInputProps({
                  placeholder: 'Search docs...',
                  type: 'search',
                  autoComplete: 'off',
                  autoCorrect: 'off',
                  autoCapitalize: 'off',
                  spellCheck: 'false',
                  maxLength: '512',
                  onChange: (event: any) => {
                    this.props
                      .search({
                        ...this.props.searchParameters,
                        query: event.target.value,
                      })
                      .then(({ hits }) => {
                        this.setState({ hits });
                      });
                  },
                  onFocus: () => {
                    this.setState({
                      isDropdownOpen: true,
                    });
                  },
                })}
              />
            </form>

            {this.state.isDropdownOpen && Boolean(inputValue) && (
              <div className="algolia-docsearch-dropdown">
                <AutocompleteResults
                  hits={this.state.hits}
                  getItemProps={getItemProps}
                  getMenuProps={getMenuProps}
                />

                <AutocompleteFooter />
              </div>
            )}
          </div>
        )}
      </Downshift>
    );
  }
}

AutocompleteDropdown.defaultProps = {
  onItemSelect: ({ hit }) => {
    if (typeof window !== 'undefined') {
      window.location.assign(hit.url);
    }
  },
};
