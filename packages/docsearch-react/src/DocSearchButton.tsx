import React, { useEffect, useState } from 'react';

import { ControlKeyIcon } from './icons/ControlKeyIcon';
import { SearchIcon } from './icons/SearchIcon';

export type DocSearchButtonProps = React.ComponentProps<'button'> & {placeholderLabel?: string}

const ACTION_KEY_DEFAULT = 'Ctrl' as const;
const ACTION_KEY_APPLE = '⌘' as const;

function isAppleDevice() {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

export const DocSearchButton = React.forwardRef<
  HTMLButtonElement,
  DocSearchButtonProps
>(({placeholderLabel = "Search", ...props}, ref) => {
  const [key, setKey] = useState<
    typeof ACTION_KEY_APPLE | typeof ACTION_KEY_DEFAULT | null
  >(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setKey(isAppleDevice() ? ACTION_KEY_APPLE : ACTION_KEY_DEFAULT);
    }
  }, []);

  return (
    <button
      type="button"
      className="DocSearch DocSearch-Button"
      aria-label="Search"
      {...props}
      ref={ref}
    >
      <span className="DocSearch-Button-Container">
        <SearchIcon />
        <span className="DocSearch-Button-Placeholder">{placeholderLabel}</span>
      </span>

      {key !== null ? (
        <span className="DocSearch-Button-Keys">
          <span className="DocSearch-Button-Key">
            {key === ACTION_KEY_DEFAULT ? <ControlKeyIcon /> : key}
          </span>
          <span className="DocSearch-Button-Key">K</span>
        </span>
      ) : null}
    </button>
  );
});
