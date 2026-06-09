import type { AutocompleteApi, AutocompleteState, BaseItem } from '@algolia/autocomplete-core';
import React, { type JSX } from 'react';

import { HitContent } from './components/ui/HitContent';
import type { DocSearchProps } from './DocSearch';
import { useRelativeFormattedDate } from './hooks/useRelativeFormattedDate';
import { SparklesIcon } from './icons/SparklesIcon';
import { Snippet } from './Snippet';
import type { InternalDocSearchHit, StoredDocSearchHit } from './types';
import { decodeHtmlEntities, getHitItemBreadcrumbs } from './utils';

export type ResultsTranslations = Partial<{
  askAiPlaceholder: string;
  noResultsAskAiPlaceholder: string;
  recentConversationTimestampFallback: string;
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

    return decodeHtmlEntities(props.title);
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
  translations = {},
}: ResultProps<TItem>): JSX.Element {
  const Hit = hitComponent!;
  const { recentConversationTimestampFallback = 'A while ago' } = translations;
  const titleAttribute = item.type === 'content' ? 'content' : `hierarchy.${item.type}`;
  const breadcrumbs = getHitItemBreadcrumbs(item);

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

          {/* lvl0 is special where there wouldn't be any "parent" to use for breadcrumbs */}
          {item.type === 'lvl0' && (
            <HitContent
              title={<Snippet hit={item} attribute="hierarchy.lvl0" />}
              subText={<Snippet hit={item} attribute="content" />}
            />
          )}

          {item.type === 'askAI' ? (
            <AskAIResultContent item={item} relativeDateFallbackText={recentConversationTimestampFallback} />
          ) : (
            <HitContent title={<Snippet hit={item} attribute={titleAttribute} />} subText={breadcrumbs} />
          )}

          {renderAction({ item })}
        </div>
      </Hit>
    </li>
  );
}

interface AskAIResultContentProps<TItem extends StoredDocSearchHit> {
  item: TItem;
  relativeDateFallbackText: string;
}

function AskAIResultContent<TItem extends StoredDocSearchHit>({
  item,
  relativeDateFallbackText,
}: AskAIResultContentProps<TItem>) {
  const storedDate = item.hierarchy.lvl2 ? new Date(item.hierarchy.lvl2) : new Date();
  const relativeDate = useRelativeFormattedDate(storedDate);

  return (
    <HitContent
      title={decodeHtmlEntities(item.hierarchy.lvl1 || '')}
      subText={relativeDate || relativeDateFallbackText}
    />
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
