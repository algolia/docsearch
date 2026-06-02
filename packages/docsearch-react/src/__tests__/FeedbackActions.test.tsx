import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { FeedbackActions, type FeedbackActionsTranslations } from '../components/FeedbackActions';
import type { StoredSearchPlugin } from '../stored-searches';
import type { StoredAskAiMessage, StoredAskAiState } from '../types';

const TRANSLATIONS: FeedbackActionsTranslations = {
  likeButtonTitle: 'Like',
  dislikeButtonTitle: 'Dislike',
  thanksForFeedbackText: 'Thanks for your feedback!',
  feedbackPanelTitle: 'What went wrong? (optional)',
  feedbackSubmitButtonText: 'Submit',
  feedbackTagIncorrect: 'Incorrect or incomplete',
};

function createConversations(stored?: StoredAskAiMessage): StoredSearchPlugin<StoredAskAiState> {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    getAll: vi.fn(() => []),
    getOne: vi.fn(() => stored),
    addFeedback: vi.fn(),
  };
}

function renderComponent(overrides: Partial<React.ComponentProps<typeof FeedbackActions>> = {}): {
  onFeedback: ReturnType<typeof vi.fn>;
} {
  const onFeedback = vi.fn().mockResolvedValue(undefined);
  render(
    <FeedbackActions
      showActions={true}
      id="message-1"
      latestAssistantMessageContent="Some answer"
      translations={TRANSLATIONS}
      conversations={createConversations()}
      onFeedback={onFeedback}
      {...overrides}
    />,
  );
  return { onFeedback };
}

describe('FeedbackActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('does not render when showActions is false', () => {
    const { container } = render(
      <FeedbackActions
        id="message-1"
        showActions={false}
        latestAssistantMessageContent="Some answer"
        translations={TRANSLATIONS}
        conversations={createConversations()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('submits positive feedback immediately on thumbs up', async () => {
    const { onFeedback } = renderComponent();

    fireEvent.click(screen.getByTitle('Like'));

    await waitFor(() => expect(onFeedback).toHaveBeenCalledWith('message-1', { thumbs: 1 }));
    expect(onFeedback).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument();
  });

  it('opens the note panel on thumbs down without sending feedback yet', () => {
    const { onFeedback } = renderComponent();

    fireEvent.click(screen.getByTitle('Dislike'));

    expect(screen.getByText('What went wrong? (optional)')).toBeInTheDocument();
    expect(onFeedback).not.toHaveBeenCalled();
  });

  it('submits negative feedback with tags and notes', async () => {
    const { onFeedback } = renderComponent();

    fireEvent.click(screen.getByTitle('Dislike'));
    fireEvent.click(screen.getByText('Incorrect or incomplete'));
    fireEvent.change(screen.getByPlaceholderText('Share some details...'), {
      target: { value: '  it was wrong  ' },
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() =>
      expect(onFeedback).toHaveBeenCalledWith('message-1', {
        thumbs: 0,
        tags: ['incorrect'],
        notes: 'it was wrong',
      }),
    );
    expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument();
  });

  it('submits multiple selected tags as an array', async () => {
    const { onFeedback } = renderComponent();

    fireEvent.click(screen.getByTitle('Dislike'));
    fireEvent.click(screen.getByText('Incorrect or incomplete'));
    fireEvent.click(screen.getByText('Other'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() =>
      expect(onFeedback).toHaveBeenCalledWith('message-1', {
        thumbs: 0,
        tags: ['incorrect', 'other'],
        notes: undefined,
      }),
    );
  });

  it('allows submitting negative feedback without tags or notes', async () => {
    const { onFeedback } = renderComponent();

    fireEvent.click(screen.getByTitle('Dislike'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() =>
      expect(onFeedback).toHaveBeenCalledWith('message-1', {
        thumbs: 0,
        tags: undefined,
        notes: undefined,
      }),
    );
  });

  it('toggles a selected tag off when clicked again', async () => {
    const { onFeedback } = renderComponent();

    fireEvent.click(screen.getByTitle('Dislike'));
    const tag = screen.getByText('Incorrect or incomplete');
    fireEvent.click(tag);
    fireEvent.click(tag);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() =>
      expect(onFeedback).toHaveBeenCalledWith('message-1', {
        thumbs: 0,
        tags: undefined,
        notes: undefined,
      }),
    );
  });

  it('closing the note panel returns to actions without recording feedback', () => {
    const { onFeedback } = renderComponent();

    fireEvent.click(screen.getByTitle('Dislike'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByText('What went wrong? (optional)')).not.toBeInTheDocument();
    expect(screen.getByTitle('Like')).toBeInTheDocument();
    expect(onFeedback).not.toHaveBeenCalled();
  });

  it('keeps the panel open and shows an error when submission fails', async () => {
    const onFeedback = vi.fn().mockRejectedValue(new Error('Network down'));
    render(
      <FeedbackActions
        showActions={true}
        id="message-1"
        latestAssistantMessageContent="Some answer"
        translations={TRANSLATIONS}
        conversations={createConversations()}
        onFeedback={onFeedback}
      />,
    );

    fireEvent.click(screen.getByTitle('Dislike'));
    fireEvent.click(screen.getByText('Submit'));

    expect(await screen.findByText('Network down')).toBeInTheDocument();
    expect(screen.getByText('What went wrong? (optional)')).toBeInTheDocument();
  });

  it('restores the thanks view when feedback was already recorded', () => {
    const stored = {
      id: 'message-1',
      feedback: 'dislike',
    } as unknown as StoredAskAiMessage;
    renderComponent({ conversations: createConversations(stored) });

    expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument();
    expect(screen.queryByTitle('Like')).not.toBeInTheDocument();
  });
});
