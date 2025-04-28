import type { AutocompleteApi, AutocompleteState, BaseItem } from '@algolia/autocomplete-core';
import React, { type JSX } from 'react';

import type { DocSearchProps } from './DocSearch';
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
          <AskAiResult item={props.collection.items[0]} translations={props.translations} {...props} />
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
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isFavoriting, setIsFavoriting] = React.useState(false);
  const action = React.useRef<(() => void) | null>(null);
  const Hit = hitComponent!;

  function runDeleteTransition(cb: () => void): void {
    setIsDeleting(true);
    action.current = cb;
  }

  function runFavoriteTransition(cb: () => void): void {
    setIsFavoriting(true);
    action.current = cb;
  }

  return (
    <li
      className={[
        'DocSearch-Hit',
        (item as unknown as InternalDocSearchHit).__docsearch_parent && 'DocSearch-Hit--Child',
        isDeleting && 'DocSearch-Hit--deleting',
        isFavoriting && 'DocSearch-Hit--favoriting',
      ]
        .filter(Boolean)
        .join(' ')}
      onTransitionEnd={() => {
        if (action.current) {
          action.current();
        }
      }}
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

interface AskAiResultProps<TItem extends BaseItem> extends ResultsProps<TItem> {
  item: TItem;
  translations?: ResultsTranslations;
}

function AskAiResult<TItem extends StoredDocSearchHit>({
  item,
  getItemProps,
  onItemClick,
  translations,
  collection,
}: AskAiResultProps<TItem>): JSX.Element {
  const { askAiPlaceholder = 'Ask AI: ' } = translations || {};

  const icon = (
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
  );

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
          <div className=" DocSearch-Hit-AskAIButton-icon DocSearch-Hit-icon">{icon}</div>
          <div className="DocSearch-Hit-AskAIButton-title">
            <span className="DocSearch-Hit-AskAIButton-title-highlight">{askAiPlaceholder}</span>
            <span className="DocSearch-Hit-AskAIButton-title-query">"{item.query || ''}"</span>
          </div>
        </div>
      </div>
    </li>
  );
}
