import React, { type JSX, useState, useEffect } from 'react';

import { MemoizedMarkdown } from './MemoizedMarkdown';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';
import { useAskAi } from './useAskAi';

export type AskAiScreenTranslations = Partial<{
  titleText: string;
  disclaimerText: string;
  relatedSourcesText: string;
}>;

type AskAiScreenProps = Omit<ScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  translations?: AskAiScreenTranslations;
};

export function AskAiScreen({ translations = {}, ...props }: AskAiScreenProps): JSX.Element {
  const {
    disclaimerText = 'Answers are generated using artificial intelligence. This is an experimental technology, and information may occasionally be incorrect or misleading.',
    relatedSourcesText = 'Related Sources',
  } = translations;

  const genAiClient = props.genAiClient;
  if (!genAiClient) {
    // @todo: add a link to the documentation
    throw new Error('You have to provide credentials to use the Ask AI feature.\nSee documentation:');
  }

  const { ask, messages, currentResponse, loadingStatus, context, error } = useAskAi({ genAiClient });

  // if we have no messages and a query, and are not loading/streaming, we can use it as the initial query
  if (messages.length === 0 && props.state.query && loadingStatus === 'idle') {
    ask({ query: props.state.query });
  }

  // determine the initial query to display
  const displayedQuery = messages.find((m) => m.role === 'user')?.content || 'No query provided';

  // select the content to display based on the status
  const displayedAnswer =
    loadingStatus === 'streaming' ? currentResponse : messages.find((m) => m.role === 'assistant')?.content || '';

  return (
    <div className="DocSearch-AskAiScreen DocSearch-AskAiScreen-Container">
      <div className="DocSearch-AskAiScreen-Header">
        <div className="DocSearch-Screen-Icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-sparkles-icon lucide-sparkles"
          >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            <path d="M20 3v4" />
            <path d="M22 5h-4" />
            <path d="M4 17v2" />
            <path d="M5 18H3" />
          </svg>
        </div>
        <p className="DocSearch-AskAi-Disclaimer">{disclaimerText}</p>
      </div>
      <div className="DocSearch-AskAiScreen-Body">
        <div className="DocSearch-AskAiScreen-Response-Container">
          <div className="DocSearch-AskAiScreen-Response">
            <p className="DocSearch-AskAiScreen-Query">{displayedQuery}</p>
            {error && <p className="DocSearch-AskAiScreen-Error">{error.message}</p>}
            <div
              className={`DocSearch-AskAiScreen-Answer ${
                loadingStatus === 'streaming' ? 'DocSearch-AskAiScreen-Answer--streaming' : ''
              }`}
            >
              {(loadingStatus === 'streaming' || loadingStatus === 'idle') && (
                <MemoizedMarkdown content={displayedAnswer} id="ask-ai-answer" />
              )}
              {loadingStatus === 'loading' && (
                <div className="DocSearch-AskAiScreen-Streaming-Loader">
                  <PulseLoader />
                </div>
              )}
            </div>
            <div className="DocSearch-AskAiScreen-Answer-Footer">
              {loadingStatus === 'idle' && displayedAnswer.length > 0 && (
                <div className="DocSearch-AskAiScreen-Actions">
                  <CopyButton onClick={() => navigator.clipboard.writeText(displayedAnswer)} />
                  <LikeButton />
                  <DislikeButton />
                </div>
              )}
            </div>
          </div>
          <div className="DocSearch-AskAiScreen-RelatedSources">
            <p className="DocSearch-AskAiScreen-RelatedSources-Title">{relatedSourcesText}</p>
            {context.length === 0 &&
              loadingStatus === 'loading' &&
              // eslint-disable-next-line react/no-array-index-key
              Array.from({ length: 3 }).map((_, index) => <SkeletonSource key={index} />)}
            {context.length > 0 &&
              context.map((source) => (
                <a
                  key={source.objectID}
                  href={source.url || source.objectID || '#'}
                  className="DocSearch-AskAiScreen-RelatedSources-Item-Link"
                >
                  <RelatedSourceIcon />
                  <span>{source.title || source.url || source.objectID}</span>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonSource(): JSX.Element {
  return (
    <div className="DocSearch-AskAiScreen-SkeletonSource">
      <RelatedSourceIcon />
      <div className="DocSearch-AskAiScreen-SkeletonSource-Text" />
    </div>
  );
}

function RelatedSourceIcon(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

function PulseLoader(): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="0" fill="currentColor">
        <animate
          id="svgSpinnersPulseMultiple0"
          fill="freeze"
          attributeName="r"
          begin="0;svgSpinnersPulseMultiple2.end"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          values="0;11"
        ></animate>
        <animate
          fill="freeze"
          attributeName="opacity"
          begin="0;svgSpinnersPulseMultiple2.end"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          values="1;0"
        ></animate>
      </circle>
      <circle cx="12" cy="12" r="0" fill="currentColor">
        <animate
          id="svgSpinnersPulseMultiple1"
          fill="freeze"
          attributeName="r"
          begin="svgSpinnersPulseMultiple0.begin+0.2s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          values="0;11"
        ></animate>
        <animate
          fill="freeze"
          attributeName="opacity"
          begin="svgSpinnersPulseMultiple0.begin+0.2s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          values="1;0"
        ></animate>
      </circle>
      <circle cx="12" cy="12" r="0" fill="currentColor">
        <animate
          id="svgSpinnersPulseMultiple2"
          fill="freeze"
          attributeName="r"
          begin="svgSpinnersPulseMultiple0.begin+0.4s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          values="0;11"
        ></animate>
        <animate
          fill="freeze"
          attributeName="opacity"
          begin="svgSpinnersPulseMultiple0.begin+0.4s"
          calcMode="spline"
          dur="1.2s"
          keySplines=".52,.6,.25,.99"
          values="1;0"
        ></animate>
      </circle>
    </svg>
  );
}

function CopyButton({ onClick }: { onClick: () => void }): JSX.Element {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 1500); // reset after 1.5 seconds
      return (): void => clearTimeout(timer);
    }
    return undefined;
  }, [isCopied]);

  const handleClick = (): void => {
    onClick();
    setIsCopied(true);
  };

  return (
    <button
      type="button"
      className={`DocSearch-AskAiScreen-ActionButton DocSearch-AskAiScreen-CopyButton ${
        isCopied ? 'DocSearch-AskAiScreen-CopyButton--copied' : ''
      }`}
      disabled={isCopied} // disable button briefly after copy
      onClick={handleClick}
    >
      {isCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-check-icon lucide-check"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-copy-icon lucide-copy"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </button>
  );
}

function LikeButton(): JSX.Element {
  // @todo: implement like button
  return (
    <button type="button" className="DocSearch-AskAiScreen-ActionButton DocSearch-AskAiScreen-LikeButton">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-thumbs-up-icon lucide-thumbs-up"
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    </button>
  );
}

function DislikeButton(): JSX.Element {
  // @todo: implement dislike button
  return (
    <button type="button" className="DocSearch-AskAiScreen-ActionButton DocSearch-AskAiScreen-DislikeButton">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-thumbs-down-icon lucide-thumbs-down"
      >
        <path d="M17 14V2" />
        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
      </svg>
    </button>
  );
}
