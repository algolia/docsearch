import type { DocSearchHit, StoredAskAiState, StoredDocSearchHit } from './types';
import { createStorage } from './utils/storage';

type CreateStoredSearchesOptions = {
  key: string;
  limit?: number;
};

export type StoredSearchPlugin<TItem> = {
  add: (item: TItem) => void;
  remove: (item: TItem) => void;
  getAll: () => TItem[];
};

export function createStoredSearches<TItem extends StoredDocSearchHit>({
  key,
  limit = 5,
}: CreateStoredSearchesOptions): StoredSearchPlugin<TItem> {
  const storage = createStorage<TItem>(key);
  let items = storage.getItem().slice(0, limit);

  return {
    add(item: TItem): void {
      const { _highlightResult, _snippetResult, ...hit } = item as unknown as DocSearchHit;

      const isQueryAlreadySaved = items.findIndex((x) => x.objectID === hit.objectID);

      if (isQueryAlreadySaved > -1) {
        items.splice(isQueryAlreadySaved, 1);
      }

      items.unshift(hit as TItem);
      items = items.slice(0, limit);

      storage.setItem(items);
    },
    remove(item: TItem): void {
      items = items.filter((x) => x.objectID !== item.objectID);

      storage.setItem(items);
    },
    getAll(): TItem[] {
      return items;
    },
  };
}

export function createStoredConversations<TItem extends StoredAskAiState>({
  key,
  limit = 5,
}: CreateStoredSearchesOptions): StoredSearchPlugin<TItem> {
  const storage = createStorage<TItem>(key);
  let items = storage.getItem().slice(0, limit);

  return {
    add(item: TItem): void {
      const { askState } = item;

      // check if this query is already saved
      // @todo: this is a bit of a hack, we should be able to use
      //  conversationId to identify.
      const isQueryAlreadySaved = items.findIndex(
        (x) =>
          x.objectID === askState?.conversationId || x.askState?.messages[0].content === askState?.messages[0].content,
      );

      if (isQueryAlreadySaved > -1) {
        items[isQueryAlreadySaved] = item;
      } else {
        items.unshift(item);
        items = items.slice(0, limit);
      }

      storage.setItem(items);
    },
    getAll(): TItem[] {
      return items;
    },
    remove(item: TItem): void {
      items = items.filter((x) => x.objectID !== item.objectID);

      storage.setItem(items);
    },
  };
}
