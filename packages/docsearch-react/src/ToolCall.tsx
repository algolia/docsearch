import type { JSX } from 'react';
import React, { useMemo } from 'react';

import { LoadingIcon, SearchIcon, ToolIcon } from './icons';
import type { AIToolPart, SearchToolPart, ToolCalls, ToolDefinition } from './types/AskiAi';

export type ToolCallTranslations = {
  /**
   * Text shown while assistant is preparing tool call.
   */
  preToolCallText: string;
  /**
   * Text shown while assistant is performing search tool call.
   */
  searchingText: string;
  /**
   * Text shown while assistant is finished performing tool call.
   */
  toolCallResultText: string;
};

interface ToolCallProps {
  part: AIToolPart;
  translations: ToolCallTranslations;
  tools: ToolCalls;
  onSearchQueryClick?: (query: string) => void;
}

interface ToolStateProps {
  variant: 'Call' | 'PartialCall' | 'Result';
  icon: React.ReactNode;
  shimmer?: boolean;
  children: React.ReactNode;
}

function ToolState({ icon, shimmer = false, children, variant }: ToolStateProps) {
  const className = `DocSearch-AskAiScreen-MessageContent-Tool Tool--${variant}${shimmer ? ' shimmer' : ''}`;

  return (
    <div className={className}>
      {icon}
      {children}
    </div>
  );
}

interface SearchToolProps {
  part: SearchToolPart;
  translations: ToolCallTranslations;
  onSearchQueryClick?: (query: string) => void;
}

function SearchTool({ part, translations, onSearchQueryClick }: SearchToolProps) {
  const { searchingText, preToolCallText, toolCallResultText } = translations;

  switch (part.state) {
    case 'input-streaming':
      return (
        <ToolState
          shimmer={true}
          icon={<LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />}
          variant="PartialCall"
        >
          <span>{searchingText}</span>
        </ToolState>
      );
    case 'input-available':
      return (
        <ToolState
          shimmer={true}
          icon={<LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />}
          variant="Call"
        >
          <span>
            {preToolCallText} {`"${part.input.query || ''}" ...`}
          </span>
        </ToolState>
      );
    case 'output-available': {
      const query = part.type === 'tool-searchIndex' ? part.output.query : part.input.query;
      const numberOfHits = part.output.hits?.length ?? 0;

      return (
        <ToolState icon={<SearchIcon />} variant="Result">
          <span>
            {toolCallResultText}{' '}
            {onSearchQueryClick ? (
              <span
                role="button"
                tabIndex={0}
                className="DocSearch-AskAiScreen-MessageContent-Tool-Query"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSearchQueryClick(query || '');
                  }
                }}
                onClick={() => onSearchQueryClick(query || '')}
              >
                {' '}
                &quot;{query || ''}&quot;
              </span>
            ) : (
              <span className="DocSearch-AskAiScreen-MessageContent-Tool-Query"> &quot;{query || ''}&quot;</span>
            )}{' '}
            found {numberOfHits} results
          </span>
        </ToolState>
      );
    }
    default:
      return null;
  }
}

interface DynamicToolProps {
  tool: ToolDefinition;
  part: AIToolPart;
}

function DynamicTool({ tool, part }: DynamicToolProps) {
  const toolOutput = useMemo(() => {
    if (part.state !== 'output-available') return null;

    return tool.render({ message: { input: part.input, output: part.output } });
  }, [part.input, part.output, tool, part.state]);

  if (part.state === 'output-error') {
    return null;
  }

  if (part.state !== 'output-available') {
    const { callingToolText = 'Loading tool' } = tool.translations || {};

    return (
      <ToolState shimmer={true} variant="PartialCall" icon={<ToolIcon />}>
        <span>{callingToolText}</span>
      </ToolState>
    );
  }

  if (!toolOutput) return null;

  return (
    <ToolState icon={<ToolIcon />} variant="Result">
      <span>{toolOutput}</span>
    </ToolState>
  );
}

function isSearchToolPart(part: AIToolPart): part is SearchToolPart {
  return part.type === 'tool-searchIndex' || part.type.startsWith('tool-algolia_search_index');
}

export function ToolCall({ part, translations, tools, onSearchQueryClick }: ToolCallProps): JSX.Element | null {
  const normalizedToolName = part.type.replace('tool-', '');
  const dynamicTool = tools[normalizedToolName];

  if (dynamicTool) {
    return <DynamicTool tool={dynamicTool} part={part} />;
  }

  if (!isSearchToolPart(part)) {
    return null;
  }

  return <SearchTool part={part} translations={translations} onSearchQueryClick={onSearchQueryClick} />;
}
