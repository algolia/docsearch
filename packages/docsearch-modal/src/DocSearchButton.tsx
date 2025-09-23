import { useDocSearch } from '@docsearch/core';
import type { JSX } from 'react';
import React from 'react';

import { ControlKeyIcon, KKeyIcon, MetaKeyIcon } from './icons/MetaKeysIcons';
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

type ActionKey = typeof ACTION_KEY_APPLE | typeof ACTION_KEY_DEFAULT;

function isAppleDevice(): boolean {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

// TODO: Check keyboard shortcuts (getKeyboardShortcuts)

export function DocSearchButton({ translations = {}, ...props }: DocSearchButtonProps): JSX.Element {
  const { buttonText = 'Search', buttonAriaLabel = 'Search' } = translations;
  const { setDocsearchState, searchButtonRef } = useDocSearch();
  const [key, setKey] = React.useState<ActionKey | null>(null);

  React.useEffect(() => {
    if (typeof navigator !== 'undefined') {
      isAppleDevice() ? setKey(ACTION_KEY_APPLE) : setKey(ACTION_KEY_DEFAULT);
    }
  }, []);

  const handleOpen = (): void => {
    setDocsearchState('modal-open');
  };

  const [actionKeyReactsTo, actionKeyAltText, actionKeyChild] =
    key === ACTION_KEY_DEFAULT
      ? // eslint-disable-next-line react/jsx-key -- false flag
        ([ACTION_KEY_DEFAULT, 'Control', <ControlKeyIcon />] as const)
      : // eslint-disable-next-line react/jsx-key -- false flag
        (['Meta', 'Meta', <MetaKeyIcon />] as const);

  const shortcut = `${actionKeyAltText}+k`;

  return (
    <button
      type="button"
      className="DocSearch DocSearch-Button"
      aria-label={buttonAriaLabel}
      aria-keyshortcuts={shortcut}
      onClick={handleOpen}
      {...props}
      ref={searchButtonRef}
    >
      <span className="DocSearch-Button-Container">
        <SearchIcon />
        <span className="DocSearch-Button-Placeholder">{buttonText}</span>
      </span>

      <span className="DocSearch-Button-Keys">
        {key !== null && (
          <>
            <DocSearchButtonKey reactsToKey={actionKeyReactsTo}>{actionKeyChild}</DocSearchButtonKey>
            <DocSearchButtonKey reactsToKey="k">
              <KKeyIcon />
            </DocSearchButtonKey>
          </>
        )}
      </span>
    </button>
  );
}

type DocSearchButtonKeyProps = {
  reactsToKey?: string;
};

function DocSearchButtonKey({ reactsToKey, children }: React.PropsWithChildren<DocSearchButtonKeyProps>): JSX.Element {
  const [isKeyDown, setIsKeyDown] = React.useState(false);

  React.useEffect(() => {
    if (!reactsToKey) {
      return undefined;
    }

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === reactsToKey) {
        setIsKeyDown(true);
      }
    }

    function handleKeyUp(e: KeyboardEvent): void {
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

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [reactsToKey]);

  return (
    <kbd
      className={
        isKeyDown
          ? 'DocSearch-Button-Key DocSearch-Button-Key--pressed'
          : 'DocSearch-Button-Key' + (reactsToKey === 'Ctrl' ? ' DocSearch-Button-Key--ctrl' : '')
      }
    >
      {children}
    </kbd>
  );
}
