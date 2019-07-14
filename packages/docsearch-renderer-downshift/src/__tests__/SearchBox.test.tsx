/** @jsx h */

import { h } from 'preact';
import {
  render,
  cleanup,
  fireEvent,
  getByPlaceholderText,
  getByDisplayValue,
} from 'preact-testing-library';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import { SearchBox, SearchBoxProps } from '../SearchBox';

describe('SearchBox', () => {
  const inputId = 'docsearch-0-input';

  function getDefaultProps(): SearchBoxProps {
    return {
      placeholder: '',
      query: '',
      onFocus: jest.fn(),
      onKeyDown: jest.fn(),
      onChange: jest.fn(),
      onReset: jest.fn(),
      getInputProps: (options?: object) => ({
        ...options,
        id: inputId,
      }),
    };
  }

  afterEach(cleanup);

  test('should generate the correct DOM', () => {
    const props = {
      ...getDefaultProps(),
    };

    const { container } = render(<SearchBox {...props} />);
    const form = container.querySelector('.algolia-docsearch-form');
    const magnifierLabel = container.querySelector(
      '.algolia-docsearch-magnifierLabel'
    );
    const loadingIndicator = container.querySelector(
      '.algolia-docsearch-loadingIndicator'
    );
    const input = container.querySelector('.algolia-docsearch-input');
    const reset = container.querySelector('.algolia-docsearch-reset');

    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('novalidate', '');
    expect(form).toHaveAttribute('role', 'search');
    expect(magnifierLabel).toBeInTheDocument();
    expect(magnifierLabel).toHaveAttribute('for', inputId);
    expect(loadingIndicator).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('autocapitalize', 'off');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('autocorrect', 'off');
    expect(input).toHaveAttribute('spellcheck', 'false');
    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute('id', inputId);
    expect(reset).toHaveAttribute('hidden', '');
    expect(reset).toHaveAttribute('type', 'reset');
  });

  test('should allow custom placeholders', () => {
    const props = {
      ...getDefaultProps(),
      placeholder: 'Search placeholder',
    };

    const { container } = render(<SearchBox {...props} />);
    const input = getByPlaceholderText(container, props.placeholder);

    expect(input).toBeInTheDocument();
  });

  test('should have the query prop as input', () => {
    const props = {
      ...getDefaultProps(),
      query: 'Search query',
    };

    const { container } = render(<SearchBox {...props} />);
    const input = getByDisplayValue(container, props.query);
    const reset = container.querySelector('button[type="reset"]');

    expect(input).toBeInTheDocument();
    expect(reset).not.toHaveAttribute('hidden');
  });

  test('should call onFocus prop on input focus', () => {
    const props = {
      ...getDefaultProps(),
      placeholder: 'Search placeholder',
    };

    const { container } = render(<SearchBox {...props} />);
    const input = getByPlaceholderText(container, props.placeholder);

    expect(props.onFocus).toHaveBeenCalledTimes(0);

    input.focus();

    expect(props.onFocus).toHaveBeenCalledTimes(1);

    userEvent.type(input, 'hello');
    input.blur();

    expect(props.onFocus).toHaveBeenCalledTimes(1);

    input.focus();
    userEvent.type(input, ' there');

    expect(props.onFocus).toHaveBeenCalledTimes(2);
  });

  test('should call onKeyDown prop on key down on the input', () => {
    const props = {
      ...getDefaultProps(),
      placeholder: 'Search placeholder',
    };

    const { container } = render(<SearchBox {...props} />);
    const input = getByPlaceholderText(container, props.placeholder);

    fireEvent.keyDown(input, { key: 'a', code: 65 });

    expect(props.onKeyDown).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(input, { key: 'Enter', code: 13 });

    expect(props.onKeyDown).toHaveBeenCalledTimes(2);
  });

  test('should call onChange prop on input change', () => {
    const props = {
      ...getDefaultProps(),
      placeholder: 'Search placeholder',
    };

    const { container } = render(<SearchBox {...props} />);
    const input = getByPlaceholderText(container, props.placeholder);

    userEvent.type(input, 'hello');

    expect(props.onChange).toHaveBeenCalledTimes(5);
    expect(props.onChange).toHaveBeenCalledWith(expect.any(Event));
  });

  test('should call onReset prop on click on the reset button', () => {
    const props = {
      ...getDefaultProps(),
      placeholder: 'Search placeholder',
    };

    const { container } = render(<SearchBox {...props} />);
    const input = getByPlaceholderText(container, props.placeholder);
    const resetButton = container.querySelector('button[type="reset"]');

    userEvent.click(resetButton);

    expect(props.onReset).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(input);
  });
});
