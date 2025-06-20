/**
 * Checks if local storage is available and usable.
 */
export function isLocalStorageSupported(): boolean {
  const key = '__TEST_KEY__';
  try {
    localStorage.setItem(key, '');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a simple storage interface for arrays using localstorage.
 * Provides basic getitem and setitem functionality.
 * Falls back to a no-op implementation if localstorage is not supported..
 *
 * @template titem The type of items to store.
 * @param key - The localstorage key to use.
 * @returns An object with setitem and getitem methods.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createStorage<TItem>(key: string) {
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

/**
 * Creates a simple storage interface for a single object using localstorage.
 * Provides basic getitem, setitem, and removeitem functionality.
 * Falls back to a no-op implementation if localstorage is not supported.
 *
 * @template titem The type of the object to store.
 * @param key - The localstorage key to use.
 * @returns An object with setitem, getitem, and removeitem methods.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createObjectStorage<TItem>(key: string) {
  if (isLocalStorageSupported() === false) {
    return {
      setItem(_item: TItem | null): void {},
      getItem(): TItem | null {
        return null;
      },
      removeItem(): void {},
    };
  }

  return {
    setItem(item: TItem | null): void {
      if (item === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(item));
      }
    },
    getItem(): TItem | null {
      const item = window.localStorage.getItem(key);
      try {
        return item ? (JSON.parse(item) as TItem) : null;
      } catch {
        // handle potential JSON parsing errors, e.g., corrupted data
        window.localStorage.removeItem(key); // clear corrupted data
        return null;
      }
    },
    removeItem(): void {
      window.localStorage.removeItem(key);
    },
  };
}
