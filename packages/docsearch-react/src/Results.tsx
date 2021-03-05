import {
  AutocompleteApi,
  AutocompleteState,
  BaseItem,
} from '@algolia/autocomplete-core';
import React from 'react';

import { DocSearchProps } from './DocSearch';
import { Snippet } from './Snippet';
import { InternalDocSearchHit, StoredDocSearchHit } from './types';

interface ResultsProps<TItem extends BaseItem>
  extends AutocompleteApi<
    TItem,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  title: string;
  collection: AutocompleteState<TItem>['collections'][0];
  renderIcon(props: { item: TItem; index: number }): React.ReactNode;
  renderAction(props: {
    item: TItem;
    runDeleteTransition: (cb: () => void) => void;
    runFavoriteTransition: (cb: () => void) => void;
  }): React.ReactNode;
  onItemClick(item: TItem): void;
  hitComponent: DocSearchProps['hitComponent'];
}

export function Results<TItem extends StoredDocSearchHit>(
  props: ResultsProps<TItem>
) {
  if (!props.collection || props.collection.items.length === 0) {
    return null;
  }

  return (
    <section className="DocSearch-Hits">
      <div className="DocSearch-Hit-source">{props.title}</div>

      <ul {...props.getListProps()}>
        {props.collection.items.map((item, index) => {
          return (
            <Result
              key={[props.title, item.objectID].join(':')}
              item={item}
              index={index}
              {...props}
            />
          );
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
}: ResultProps<TItem>) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isFavoriting, setIsFavoriting] = React.useState(false);
  const action = React.useRef<(() => void) | null>(null);
  const Hit = hitComponent!;

  function runDeleteTransition(cb: () => void) {
    setIsDeleting(true);
    action.current = cb;
  }

  function runFavoriteTransition(cb: () => void) {
    setIsFavoriting(true);
    action.current = cb;
  }

  return (
    <li
      className={[
        'DocSearch-Hit',
        ((item as unknown) as InternalDocSearchHit).__docsearch_parent &&
          'DocSearch-Hit--Child',
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
        onClick() {
          onItemClick(item);
        },
      })}
    >
      <Hit hit={item}>
        <div className="DocSearch-Hit-Container">
          {renderIcon({ item, index })}

          {item.hierarchy[item.type] && item.type === 'lvl1' && (
            <div className="DocSearch-Hit-content-wrapper">
              <Snippet
                className="DocSearch-Hit-title"
                hit={item}
                attribute="hierarchy.lvl1"
              />
              {item.content && (
                <Snippet
                  className="DocSearch-Hit-path"
                  hit={item}
                  attribute="content"
                />
              )}
            </div>
          )}

          {item.hierarchy[item.type] &&
            (item.type === 'lvl2' ||
              item.type === 'lvl3' ||
              item.type === 'lvl4' ||
              item.type === 'lvl5' ||
              item.type === 'lvl6') && (
              <div className="DocSearch-Hit-content-wrapper">
                <Snippet
                  className="DocSearch-Hit-title"
                  hit={item}
                  attribute={`hierarchy.${item.type}`}
                />
                <Snippet
                  className="DocSearch-Hit-path"
                  hit={item}
                  attribute="hierarchy.lvl1"
                />
              </div>
            )}

          {item.type === 'content' && (
            <div className="DocSearch-Hit-content-wrapper">
              <Snippet
                className="DocSearch-Hit-title"
                hit={item}
                attribute="content"
              />
              <Snippet
                className="DocSearch-Hit-path"
                hit={item}
                attribute="hierarchy.lvl1"
              />
            </div>
          )}

          {renderAction({ item, runDeleteTransition, runFavoriteTransition })}
        </div>
      </Hit>
    </li>
  );
}
