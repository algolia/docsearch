import type { JSX } from 'react';
import React, { useMemo } from 'react';

import { LoadingIcon, MemoryIcon, SearchIcon, ToolIcon } from '../icons';
import type { AIToolPart, MemoryToolPart, SearchToolPart, ToolCalls, ToolDefinition } from '../types/AskiAi';

import { ToolState } from './ui/ToolState';

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
  /**
   * Text shown when the agent saved related information to memory.
   */
  savedMemoryToolResultText: string;
  /**
   * Text shown when the agent used the memory tool to enhance results.
   */
  memoryToolResultText: string;
};

interface ToolCallProps {
  part: AIToolPart;
  translations: ToolCallTranslations;
  tools: ToolCalls;
  onSearchQueryClick?: (query: string) => void;
  memoryEnabled?: boolean;
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

interface CustomToolProps {
  tool: ToolDefinition;
  part: AIToolPart;
}

function CustomTool({ tool, part }: CustomToolProps) {
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

function MemoryTool({ part, translations }: { part: MemoryToolPart; translations: ToolCallTranslations }) {
  const { savedMemoryToolResultText, memoryToolResultText } = translations;

  if (part.state === 'output-error') return null;

  if (part.type === 'tool-algolia_memorize') {
    return (
      <ToolState variant="Result" icon={<MemoryIcon />}>
        {savedMemoryToolResultText}
      </ToolState>
    );
  }

  return (
    <ToolState variant="Result" icon={<MemoryIcon />}>
      {memoryToolResultText}
    </ToolState>
  );
}

function isSearchToolPart(part: AIToolPart): part is SearchToolPart {
  return part.type === 'tool-searchIndex' || part.type.startsWith('tool-algolia_search_index');
}

function isMemoryToolPart(part: AIToolPart): part is MemoryToolPart {
  return (
    part.type === 'tool-algolia_ponder' ||
    part.type === 'tool-algolia_memorize' ||
    part.type === 'tool-algolia_memory_search'
  );
}

export function ToolCall({
  part,
  translations,
  tools,
  onSearchQueryClick,
  memoryEnabled = false,
}: ToolCallProps): JSX.Element | null {
  const normalizedToolName = part.type.replace('tool-', '');
  const customTool = tools[normalizedToolName];

  if (customTool) {
    return <CustomTool tool={customTool} part={part} />;
  }

  if (memoryEnabled && isMemoryToolPart(part)) {
    return <MemoryTool part={part} translations={translations} />;
  }

  if (isSearchToolPart(part)) {
    return <SearchTool part={part} translations={translations} onSearchQueryClick={onSearchQueryClick} />;
  }

  return null;
}
