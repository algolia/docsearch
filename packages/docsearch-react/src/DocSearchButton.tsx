import React, { useEffect, useState } from 'react';

import { ControlKeyIcon } from './icons/ControlKeyIcon';
import { SearchIcon } from './icons/SearchIcon';

type Translations = Partial<{
  buttonText: string;
  buttonAriaLabel: string;
}>

export type DocSearchButtonProps = React.ComponentProps<'button'> & {translations?: Translations}

const ACTION_KEY_DEFAULT = 'Ctrl' as const;
const ACTION_KEY_APPLE = '⌘' as const;

function isAppleDevice() {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

export const DocSearchButton = React.forwardRef<
  HTMLButtonElement,
  DocSearchButtonProps
>(({translations = {}, ...props}, ref) => {
  const {
    buttonText = "Search",
    buttonAriaLabel = "Search"
  } = translations;
  
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
      aria-label={buttonAriaLabel}
      {...props}
      ref={ref}
    >
      <span className="DocSearch-Button-Container">
        <SearchIcon />
        <span className="DocSearch-Button-Placeholder">{buttonText}</span>
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
