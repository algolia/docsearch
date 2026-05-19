import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

import { AskAiSearchBox } from '../components/AskAiSearchBox';
import { KeywordSearchBox } from '../components/KeywordSearchBox';
import { SearchBoxForm } from '../components/ui/SearchBoxForm';

function createState(overrides = {}): any {
  return {
    query: '',
    collections: [],
    status: 'idle',
    ...overrides,
  };
}

function createAutocomplete(overrides = {}): any {
  const onChange = vi.fn();
  const onKeyDown = vi.fn();

  return {
    getFormProps: vi.fn(() => ({
      onReset: vi.fn(),
    })),
    getInputProps: vi.fn(() => ({
      'aria-autocomplete': 'list',
      onChange,
      onKeyDown,
    })),
    getLabelProps: vi.fn(() => ({
      htmlFor: 'docsearch-input',
    })),
    setQuery: vi.fn(),
    ...overrides,
  };
}

function renderSearchBoxForm(props = {}): ReturnType<typeof render> {
  const autocomplete = createAutocomplete();

  return render(
    <SearchBoxForm
      {...autocomplete}
      state={createState()}
      autoFocus={false}
      inputRef={React.createRef<HTMLInputElement>()}
      isFromSelection={false}
      placeholder="Search docs"
      clearButtonTitle="Clear"
      clearButtonAriaLabel="Clear the query"
      closeButtonText="Close"
      closeButtonAriaLabel="Close"
      searchInputLabel="Search"
      onClose={vi.fn()}
      {...props}
    />,
  );
}

describe('SearchBoxForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders the shared form, input, clear button, close button, and search label', () => {
    renderSearchBoxForm({
      state: createState({ query: 'docsearch' }),
    });

    expect(document.querySelector('.DocSearch-Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search docs')).toBeInTheDocument();
    expect(document.querySelector('.DocSearch-Clear')).toHaveTextContent('Clear');
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('title', 'Close');
    expect(document.querySelector('.DocSearch-MagnifierLabel')).toHaveTextContent('Search');
  });

  it('renders the loading indicator while keyword search is stalled', () => {
    renderSearchBoxForm({
      state: createState({ status: 'stalled' }),
    });

    expect(document.querySelector('.DocSearch-LoadingIndicator')).toBeInTheDocument();
    expect(document.querySelector('.DocSearch-MagnifierLabel')).not.toBeInTheDocument();
  });

  it('allows scoped input props and slots to override base autocomplete props', () => {
    const onKeyDown = vi.fn();
    const onChange = vi.fn();

    renderSearchBoxForm({
      leadingElement: <span data-testid="leading">Leading</span>,
      inputOverlay: <span data-testid="overlay">Overlay</span>,
      actionsBeforeClose: <button type="button">Action</button>,
      hideInput: true,
      inputProps: {
        disabled: true,
        enterKeyHint: 'enter',
        onChange,
        onKeyDown,
      },
    });

    const input = screen.getByPlaceholderText('Search docs');

    expect(screen.getByTestId('leading')).toBeInTheDocument();
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('enterkeyhint', 'enter');
    expect(input).toHaveAttribute('hidden');

    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.change(input, { target: { value: 'ask' } });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('KeywordSearchBox', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('passes keyword search defaults to the shared form', () => {
    render(
      <KeywordSearchBox
        {...createAutocomplete()}
        state={createState()}
        autoFocus={false}
        inputRef={React.createRef<HTMLInputElement>()}
        isFromSelection={false}
        placeholder="Search docs"
        onClose={vi.fn()}
      />,
    );

    expect(document.querySelector('.DocSearch-Clear')).toHaveTextContent('Clear');
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('title', 'Close');
    expect(screen.getByPlaceholderText('Search docs')).toHaveAttribute('enterkeyhint', 'search');
  });
});

describe('AskAiSearchBox', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  function renderAskAiSearchBox(props = {}): ReturnType<typeof render> {
    return render(
      <AskAiSearchBox
        {...createAutocomplete()}
        state={createState({ query: 'follow up', collections: [null, null, { items: [{ objectID: '1' }] }] })}
        autoFocus={false}
        inputRef={React.createRef<HTMLInputElement>()}
        isFromSelection={false}
        placeholder="Ask another question..."
        isAskAiActive={true}
        askAiStatus="ready"
        askAiState="initial"
        setAskAiState={vi.fn()}
        onAskAgain={vi.fn()}
        onAskAiToggle={vi.fn()}
        onClose={vi.fn()}
        onNewConversation={vi.fn()}
        onStopAskAiStreaming={vi.fn()}
        onViewConversationHistory={vi.fn()}
        {...props}
      />,
    );
  }

  it('renders Ask AI-specific back action and conversation menu actions', () => {
    renderAskAiSearchBox();

    expect(screen.getByRole('button', { name: 'Back to keyword search' })).toBeInTheDocument();
    expect(screen.getByText('Start a new conversation')).toBeInTheDocument();
    expect(screen.getByText('Conversation history')).toBeInTheDocument();
  });

  it('renders the stop streaming action and disables the input while streaming', () => {
    renderAskAiSearchBox({ askAiStatus: 'streaming' });

    expect(document.querySelector('.DocSearch-StopStreaming')).toBeInTheDocument();
    expect(screen.getByDisplayValue('')).toBeDisabled();
    expect(screen.getByText('Answering...')).toBeInTheDocument();
  });

  it('intercepts Enter while Ask AI is active to ask again', () => {
    const onAskAgain = vi.fn();

    renderAskAiSearchBox({ onAskAgain });

    fireEvent.keyDown(screen.getByPlaceholderText('Ask another question...'), { key: 'Enter' });

    expect(onAskAgain).toHaveBeenCalledWith('follow up');
  });

  it('uses thread-depth behavior in Ask AI mode', () => {
    const onNewConversation = vi.fn();

    renderAskAiSearchBox({ isThreadDepthError: true, onNewConversation });

    const input = screen.getByPlaceholderText('Conversation limit reached');

    expect(input).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Back to keyword search' }));

    expect(onNewConversation).toHaveBeenCalledTimes(1);
  });
});
