import type { DocSearchHit, StoredAskAiState, StoredDocSearchHit, StoredAskAiMessage } from './types';
import { createStorage } from './utils/storage';

type CreateStoredSearchesOptions = {
  key: string;
  limit?: number;
};

export type StoredSearchPlugin<TItem> = {
  add: (item: TItem) => void;
  remove: (item: TItem) => void;
  getAll: () => TItem[];
  addFeedback?: (messageId: string, feedback: 'dislike' | 'like') => void;
  getOne?: (messageId: string) => StoredAskAiMessage | undefined;
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
      const { objectID, messages } = item;

      // check if this query is already saved
      const isQueryAlreadySaved = items.findIndex(
        (x) => x.objectID === objectID || x.messages?.[0]?.content === messages?.[0]?.content,
      );

      if (isQueryAlreadySaved > -1) {
        items[isQueryAlreadySaved] = item;
      } else {
        items.unshift(item);
        items = items.slice(0, limit);
      }

      storage.setItem(items);
    },
    /** Record feedback (like/dislike) for a given message id within stored conversations. */
    addFeedback(messageId: string, feedback: 'dislike' | 'like'): void {
      const conv = items.find((c) => c.messages?.some((m) => m.id === messageId));
      if (!conv || !conv.messages) return;

      const msg = conv.messages.find((m) => m.id === messageId);
      if (!msg) return;

      (msg as any).feedback = feedback;

      storage.setItem(items);
    },
    getOne(messageId: string): StoredAskAiMessage | undefined {
      const conv = items.find((c) => c.messages?.some((m) => m.id === messageId));
      return conv?.messages?.find((m) => m.id === messageId);
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
