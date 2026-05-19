import React from 'react';

export function useRefreshOnInitialQuery({
  initialQuery,
  inputRef,
  refresh,
}: {
  initialQuery: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  refresh: () => void;
}): void {
  React.useEffect(() => {
    if (initialQuery.length > 0) {
      refresh();

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [initialQuery, inputRef, refresh]);
}
