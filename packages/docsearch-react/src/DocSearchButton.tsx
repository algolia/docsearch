import React, { useEffect, useState } from 'react';

import { ControlKeyIcon } from './icons/ControlKeyIcon';
import { SearchIcon } from './icons/SearchIcon';

export type ButtonTranslations = Partial<{
  buttonText: string;
  buttonAriaLabel: string;
}>;

export type DocSearchButtonProps = React.ComponentProps<'button'> & {
  translations?: ButtonTranslations;
};

const ACTION_KEY_DEFAULT = 'Ctrl' as const;
const ACTION_KEY_APPLE = '⌘' as const;

function isAppleDevice() {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

export const DocSearchButton = React.forwardRef<
  HTMLButtonElement,
  DocSearchButtonProps
>(({ translations = {}, ...props }, ref) => {
  const { buttonText = 'Search', buttonAriaLabel = 'Search' } = translations;

  const [key, setKey] = useState<
    typeof ACTION_KEY_APPLE | typeof ACTION_KEY_DEFAULT | null
  >(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      isAppleDevice() ? setKey(ACTION_KEY_APPLE) : setKey(ACTION_KEY_DEFAULT);
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

      <span className="DocSearch-Button-Keys">
        {key !== null && (
          <>
            <DocSearchButtonKey
              reactsToKey={
                key === ACTION_KEY_DEFAULT ? ACTION_KEY_DEFAULT : 'Meta'
              }
            >
              {key === ACTION_KEY_DEFAULT ? <ControlKeyIcon /> : key}
            </DocSearchButtonKey>
            <DocSearchButtonKey reactsToKey="k">K</DocSearchButtonKey>
          </>
        )}
      </span>
    </button>
  );
});

type DocSearchButtonKeyProps = {
  reactsToKey?: string;
};

function DocSearchButtonKey({
  reactsToKey,
  children,
}: React.PropsWithChildren<DocSearchButtonKeyProps>) {
  const [isKeyDown, setIsKeyDown] = useState(false);

  useEffect(() => {
    if (!reactsToKey) {
      return undefined;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === reactsToKey) {
        setIsKeyDown(true);
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      if (
        e.key === reactsToKey ||
        // keyup doesn't fire when Command is held down,
        // workaround is to mark key as also released when Command is released
        // See https://stackoverflow.com/a/73419500
        e.key === 'Meta'
      ) {
        setIsKeyDown(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [reactsToKey]);

  return (
    <kbd
      className={
        isKeyDown
          ? 'DocSearch-Button-Key DocSearch-Button-Key--pressed'
          : 'DocSearch-Button-Key'
      }
    >
      {children}
    </kbd>
  );
}
