import type { AutocompleteApi, AutocompleteState, BaseItem } from '@algolia/autocomplete-core';
import React, { type JSX } from 'react';

import type { DocSearchProps } from './DocSearch';
import { useRelativeFormattedDate } from './hooks/useRelativeFormattedDate';
import { SparklesIcon } from './icons/SparklesIcon';
import { Snippet } from './Snippet';
import type { InternalDocSearchHit, StoredDocSearchHit } from './types';
import { sanitizeUserInput } from './utils/sanitize';

export type ResultsTranslations = Partial<{
  askAiPlaceholder: string;
  noResultsAskAiPlaceholder: string;
}>;
interface ResultsProps<TItem extends BaseItem>
  extends AutocompleteApi<TItem, React.FormEvent, React.MouseEvent, React.KeyboardEvent> {
  title?: string | null;
  translations?: ResultsTranslations;
  collection: AutocompleteState<TItem>['collections'][0];
  renderIcon: (props: { item: TItem; index: number }) => React.ReactNode;
  renderAction: (props: { item: TItem }) => React.ReactNode;
  onItemClick: (item: TItem, event: KeyboardEvent | MouseEvent) => void;
  hitComponent: DocSearchProps['hitComponent'];
  state: AutocompleteState<TItem>;
  sourceIcon?: JSX.Element;
}

export function Results<TItem extends StoredDocSearchHit>(props: ResultsProps<TItem>): JSX.Element | null {
  // The collection title, decoded to handle encoded HTML entities
  // If there is not a title, return null to not render anything
  const decodedTitle = React.useMemo(() => {
    if (!props.title) {
      return null;
    }

    return props.title
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }, [props.title]);

  if (!props.collection || props.collection.items.length === 0) {
    return null;
  }

  if (props.collection.source.sourceId === 'askAI') {
    return (
      <section className="DocSearch-Hits">
        <div className="DocSearch-Hit-source">Ask AI Assistant</div>
        <ul className="DocSearch-Hits-padded" {...props.getListProps({ source: props.collection.source })}>
          <AskAiButton item={props.collection.items[0]} translations={props.translations} {...props} />
        </ul>
      </section>
    );
  }

  if (props.collection.source.sourceId === 'recentConversations') {
    return (
      <section className="DocSearch-Hits">
        <div className="DocSearch-Hit-source">
          <SparklesIcon />
          {decodedTitle}
        </div>
        <ul className="DocSearch-Hits-padded" {...props.getListProps({ source: props.collection.source })}>
          {props.collection.items.map((item, index) => {
            return <Result key={[props.title, item.objectID].join(':')} item={item} index={index} {...props} />;
          })}
        </ul>
      </section>
    );
  }

  return (
    <section className="DocSearch-Hits">
      <div className="DocSearch-Hit-source">
        {props.sourceIcon ?? null}
        {decodedTitle}
      </div>

      <ul className="DocSearch-Hits-padded" {...props.getListProps({ source: props.collection.source })}>
        {props.collection.items.map((item, index) => {
          return <Result key={[props.title, item.objectID].join(':')} item={item} index={index} {...props} />;
        })}
      </ul>
    </section>
  );
}

interface ResultProps<TItem extends BaseItem> extends ResultsProps<TItem> {
  item: TItem;
  index: number;
}

function Result<TItem extends StoredDocSearchHit>({
  item,
  index,
  renderIcon,
  renderAction,
  getItemProps,
  onItemClick,
  collection,
  hitComponent,
}: ResultProps<TItem>): JSX.Element {
  const Hit = hitComponent!;
  const storedDate = item.type === 'askAI' && item.hierarchy.lvl2 ? new Date(item.hierarchy.lvl2) : new Date();
  const relativeDate = useRelativeFormattedDate(storedDate);

  return (
    <li
      className={[
        'DocSearch-Hit',
        (item as unknown as InternalDocSearchHit).__docsearch_parent && 'DocSearch-Hit--Child',
      ]
        .filter(Boolean)
        .join(' ')}
      {...getItemProps({
        item,
        source: collection.source,
        onClick(event) {
          onItemClick(item, event);
        },
      })}
    >
      <Hit hit={item}>
        <div className="DocSearch-Hit-Container">
          {renderIcon({ item, index })}

          {item.type === 'askAI' && (
            <div className="DocSearch-Hit-content-wrapper">
              <span className="DocSearch-Hit-title">{sanitizeUserInput(item.hierarchy.lvl1 || '')}</span>
              <span className="DocSearch-Hit-path">{relativeDate}</span>
            </div>
          )}

          {item.hierarchy[item.type] && item.type === 'lvl1' && (
            <div className="DocSearch-Hit-content-wrapper">
              <Snippet className="DocSearch-Hit-title" hit={item} attribute="hierarchy.lvl1" />
              {item.hierarchy.lvl0 && <Snippet className="DocSearch-Hit-path" hit={item} attribute="hierarchy.lvl0" />}
            </div>
          )}

          {item.hierarchy[item.type] &&
            (item.type === 'lvl2' ||
              item.type === 'lvl3' ||
              item.type === 'lvl4' ||
              item.type === 'lvl5' ||
              item.type === 'lvl6') && (
              <div className="DocSearch-Hit-content-wrapper">
                <Snippet className="DocSearch-Hit-title" hit={item} attribute={`hierarchy.${item.type}`} />
                <Snippet className="DocSearch-Hit-path" hit={item} attribute="hierarchy.lvl1" />
              </div>
            )}

          {item.type === 'content' && (
            <div className="DocSearch-Hit-content-wrapper">
              <Snippet className="DocSearch-Hit-title" hit={item} attribute="content" />
              <Snippet className="DocSearch-Hit-path" hit={item} attribute="hierarchy.lvl1" />
            </div>
          )}

          {renderAction({ item })}
        </div>
      </Hit>
    </li>
  );
}

interface AskAiButtonProps<TItem extends BaseItem> extends ResultsProps<TItem> {
  item: TItem;
  translations?: ResultsTranslations;
  state: AutocompleteState<TItem>;
}

function AskAiButton<TItem extends StoredDocSearchHit>({
  item,
  getItemProps,
  onItemClick,
  collection,
}: AskAiButtonProps<TItem>): JSX.Element | null {
  if (!item.query) return null;

  return (
    <li
      className="DocSearch-Hit"
      {...getItemProps({
        item,
        source: collection.source,
        onClick(event) {
          onItemClick(item, event);
        },
      })}
    >
      <div className="DocSearch-Hit--AskAI">
        <div className="DocSearch-Hit-AskAIButton DocSearch-Hit-Container">
          <div className=" DocSearch-Hit-AskAIButton-icon DocSearch-Hit-icon">
            <SparklesIcon />
          </div>
          <div className="DocSearch-Hit-AskAIButton-title">
            <span className="DocSearch-Hit-AskAIButton-title-query">{item.query}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
