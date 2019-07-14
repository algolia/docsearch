/** @jsx h */

import { h, Component } from 'preact';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      animateTransform: SVGAttributes;
    }
  }
}

export type SearchBoxProps = {
  placeholder: string;
  query: string;
  onChange: (event: any) => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onReset: (event: MouseEvent) => void;
  getInputProps?(options?: object): any;
} & typeof defaultProps;

const defaultProps = {
  getInputProps: (options?: object) => options,
};

export class SearchBox extends Component<SearchBoxProps> {
  static defaultProps = defaultProps;

  private inputRef: null | HTMLElement = null;

  render() {
    return (
      <form
        action=""
        role="search"
        noValidate
        className="algolia-docsearch-form"
      >
        <label
          for={this.props.getInputProps().id}
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
          <svg viewBox="0 0 38 38" stroke="currentColor" stroke-opacity=".5">
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
          {...this.props.getInputProps({
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
            value: this.props.query,
            onChange: this.props.onChange,
            onFocus: this.props.onFocus,
            onKeyDown: this.props.onKeyDown,
          })}
          className="algolia-docsearch-input"
        />

        <button
          type="reset"
          title="Clear the query"
          className="algolia-docsearch-reset"
          hidden={this.props.query.length === 0}
          onClick={(event: MouseEvent) => {
            this.props.onReset(event);

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
    );
  }
}
