import type { AutocompleteApi, AutocompleteState, BaseItem } from '@algolia/autocomplete-core';
import React, { type JSX } from 'react';

import type { DocSearchProps } from './DocSearch';
import { SparklesIcon } from './icons/SparklesIcon';
import { Snippet } from './Snippet';
import type { InternalDocSearchHit, StoredDocSearchHit } from './types';

export type ResultsTranslations = Partial<{
  askAiPlaceholder: string;
}>;
interface ResultsProps<TItem extends BaseItem>
  extends AutocompleteApi<TItem, React.FormEvent, React.MouseEvent, React.KeyboardEvent> {
  title: string;
  translations?: ResultsTranslations;
  collection: AutocompleteState<TItem>['collections'][0];
  renderIcon: (props: { item: TItem; index: number }) => React.ReactNode;
  renderAction: (props: {
    item: TItem;
    runDeleteTransition: (cb: () => void) => void;
    runFavoriteTransition: (cb: () => void) => void;
  }) => React.ReactNode;
  onItemClick: (item: TItem, event: KeyboardEvent | MouseEvent) => void;
  hitComponent: DocSearchProps['hitComponent'];
}

export function Results<TItem extends StoredDocSearchHit>(props: ResultsProps<TItem>): JSX.Element | null {
  if (!props.collection || props.collection.items.length === 0) {
    return null;
  }

  if (props.collection.source.sourceId === 'askAI') {
    return (
      <section className="DocSearch-AskAi-Section">
        <ul {...props.getListProps({ source: props.collection.source })}>
          <AskAiButton item={props.collection.items[0]} translations={props.translations} {...props} />
        </ul>
      </section>
    );
  }

  if (props.collection.source.sourceId === 'recentConversations') {
    return (
      <section className="DocSearch-Hits">
        <div className="DocSearch-Hit-source">{props.title}</div>
        <ul {...props.getListProps({ source: props.collection.source })}>
          {props.collection.items.map((item, index) => {
            return <Result key={[props.title, item.objectID].join(':')} item={item} index={index} {...props} />;
          })}
        </ul>
      </section>
    );
  }

  return (
    <section className="DocSearch-Hits">
      <div className="DocSearch-Hit-source">{props.title}</div>

      <ul {...props.getListProps({ source: props.collection.source })}>
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
  const [status, setStatus] = React.useState<'deleting' | 'favoriting' | 'idle'>('idle');

  const actionRef = React.useRef<(() => void) | null>(null);
  const Hit = hitComponent!;

  const runDeleteTransition = (cb: () => void): void => {
    setStatus('deleting');
    actionRef.current = cb;
  };

  const runFavoriteTransition = (cb: () => void): void => {
    setStatus('favoriting');
    actionRef.current = cb;
  };

  const handleAnimEnd = (): void => {
    actionRef.current?.();
    actionRef.current = null;
  };

  return (
    <li
      className={[
        'DocSearch-Hit',
        (item as unknown as InternalDocSearchHit).__docsearch_parent && 'DocSearch-Hit--Child',
        status === 'favoriting' && 'DocSearch-Hit--favoriting',
        status === 'deleting' && 'DocSearch-Hit--deleting',
      ]
        .filter(Boolean)
        .join(' ')}
      onAnimationEnd={handleAnimEnd}
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

          {item.hierarchy[item.type] && item.type === 'lvl1' && (
            <div className="DocSearch-Hit-content-wrapper">
              <Snippet className="DocSearch-Hit-title" hit={item} attribute="hierarchy.lvl1" />
              {item.content && <Snippet className="DocSearch-Hit-path" hit={item} attribute="content" />}
            </div>
          )}

          {item.type === 'askAI' && (
            <div className="DocSearch-Hit-content-wrapper">
              <Snippet className="DocSearch-Hit-title" hit={item} attribute="hierarchy.lvl1" />
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

          {renderAction({ item, runDeleteTransition, runFavoriteTransition })}
        </div>
      </Hit>
    </li>
  );
}

interface AskAiButtonProps<TItem extends BaseItem> extends ResultsProps<TItem> {
  item: TItem;
  translations?: ResultsTranslations;
}

function AskAiButton<TItem extends StoredDocSearchHit>({
  item,
  getItemProps,
  onItemClick,
  translations,
  collection,
}: AskAiButtonProps<TItem>): JSX.Element {
  const { askAiPlaceholder = 'Ask AI: ' } = translations || {};

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
            <span className="DocSearch-Hit-AskAIButton-title-highlight">{askAiPlaceholder}</span>
            <mark className="DocSearch-Hit-AskAIButton-title-query">{item.query || ''}</mark>
          </div>
        </div>
      </div>
    </li>
  );
}
