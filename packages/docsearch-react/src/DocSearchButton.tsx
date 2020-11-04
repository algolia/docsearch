import React, { useEffect, useState } from 'react';

import { ControlKeyIcon } from './icons/ControlKeyIcon';
import { SearchIcon } from './icons/SearchIcon';

export type DocSearchButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const ACTION_KEY_DEFAULT = 'Ctrl' as const;
const ACTION_KEY_APPLE = '⌘' as const;

function hasNavigator() {
  return typeof navigator === 'undefined';
}

function isAppleDevice() {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

export const DocSearchButton = React.forwardRef<
  HTMLButtonElement,
  DocSearchButtonProps
>((props, ref) => {
  const [key, setKey] = useState<
    typeof ACTION_KEY_APPLE | typeof ACTION_KEY_DEFAULT | null
  >(null);

  useEffect(() => {
    if (hasNavigator()) {
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
      <div className="DocSearch-Button-Container">
        <SearchIcon />
        <span className="DocSearch-Button-Placeholder">Search</span>
      </div>

      {key !== null ? (
        <div className="DocSearch-Button-Keys">
          <span className="DocSearch-Button-Key">
            {key === ACTION_KEY_DEFAULT ? <ControlKeyIcon /> : key}
          </span>
          <span className="DocSearch-Button-Key">K</span>
        </div>
      ) : null}
    </button>
  );
});
