import type { DocSearchHit, StoredDocSearchHit } from './types';

function isLocalStorageSupported(): boolean {
  const key = '__TEST_KEY__';

  try {
    localStorage.setItem(key, '');
    localStorage.removeItem(key);

    return true;
  } catch {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createStorage<TItem>(key: string) {
  if (isLocalStorageSupported() === false) {
    return {
      setItem(): void {},
      getItem(): TItem[] {
        return [];
      },
    };
  }

  return {
    setItem(item: TItem[]): void {
      return window.localStorage.setItem(key, JSON.stringify(item));
    },
    getItem(): TItem[] {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : [];
    },
  };
}

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
