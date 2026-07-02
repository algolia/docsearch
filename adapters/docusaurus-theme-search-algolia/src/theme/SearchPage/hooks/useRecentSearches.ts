/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { useCallback, useEffect, useState } from 'react';

import { RECENT_SEARCHES_KEY, RECENT_SEARCHES_LIMIT } from '../constants';

function readRecentSearches(): string[] {
  if (!ExecutionEnvironment.canUseDOM) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(searches: string[]): void {
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }

  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch {
    // Ignore write failures (private mode, quota, etc.): recent searches are
    // a non-critical enhancement.
  }
}

type UseRecentSearches = {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
};

export function useRecentSearches(): UseRecentSearches {
  // Start empty so the server and first client render match, then hydrate from
  // localStorage after mount to avoid hydration mismatches.
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  const persist = useCallback((next: string[]) => {
    setRecentSearches(next);
    writeRecentSearches(next);
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, RECENT_SEARCHES_LIMIT);
      writeRecentSearches(next);
      return next;
    });
  }, []);

  const removeRecentSearch = useCallback(
    (query: string) => {
      persist(recentSearches.filter((item) => item !== query));
    },
    [persist, recentSearches],
  );

  const clearRecentSearches = useCallback(() => {
    persist([]);
  }, [persist]);

  return { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches };
}
