/**
 * Estimates the size of localStorage usage in bytes.
 */
export function getLocalStorageSize(): number {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 0;
  }

  let total = 0;
  for (const key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      total += window.localStorage[key].length + key.length;
    }
  }
  return total;
}

/**
 * Attempts to free up localStorage space by removing DocSearch-related items
 * starting with the oldest/largest ones.
 */
function cleanupDocSearchStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  const docSearchKeys: Array<{ key: string; size: number }> = [];

  // Find all DocSearch-related keys and their sizes
  for (const key in window.localStorage) {
    if (key.includes('__DOCSEARCH_')) {
      const value = window.localStorage[key];
      docSearchKeys.push({ key, size: value.length + key.length });
    }
  }

  // Sort by size (largest first) to remove the most impactful items
  docSearchKeys.sort((a, b) => b.size - a.size);

  // Remove up to half of the DocSearch items, starting with the largest
  const itemsToRemove = Math.ceil(docSearchKeys.length / 2);
  for (let i = 0; i < itemsToRemove && i < docSearchKeys.length; i++) {
    try {
      window.localStorage.removeItem(docSearchKeys[i].key);
    } catch {
      // Silently ignore cleanup errors to prevent crashes
    }
  }
}

/**
 * Safely sets an item in localStorage with quota exceeded error handling.
 *
 * @param key - The localStorage key.
 * @param value - The value to store (will be JSON.stringified).
 */
function safeSetLocalStorageItem(key: string, value: any): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Handle quota exceeded error by clearing old data and retrying
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      try {
        // First, try comprehensive cleanup of DocSearch storage
        cleanupDocSearchStorage();
        // Retry with original data
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // If still failing, silently fail to prevent crashes
      }
    } else {
      // For other localStorage errors, silently fail to prevent crashes
    }
  }
}

/**
 * Proactively manages localStorage quota by cleaning up when usage is high
 * Should be called periodically to prevent quota exceeded errors.
 */
export function manageLocalStorageQuota(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  const currentSize = getLocalStorageSize();
  // Typical localStorage limit is 5-10MB, start cleanup at 4MB to be safe
  const CLEANUP_THRESHOLD = 4 * 1024 * 1024; // 4MB

  if (currentSize > CLEANUP_THRESHOLD) {
    cleanupDocSearchStorage();
  }
}

/**
 * Checks if local storage is available and usable.
 */
export function isLocalStorageSupported(): boolean {
  // guard against ssr and browsers where localstorage is disabled
  if (typeof window === 'undefined' || !('localStorage' in window)) {
    return false;
  }

  const key = '__TEST_KEY__';
  try {
    window.localStorage.setItem(key, '');
    window.localStorage.removeItem(key);
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
      safeSetLocalStorageItem(key, item);
    },
    getItem(): TItem[] {
      const item = window.localStorage.getItem(key);
      if (item === null) return [];
      try {
        const parsed = JSON.parse(item);
        return Array.isArray(parsed) ? (parsed as TItem[]) : [];
      } catch {
        // clear corrupted data and return empty list
        window.localStorage.removeItem(key);
        return [];
      }
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
        safeSetLocalStorageItem(key, item);
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
