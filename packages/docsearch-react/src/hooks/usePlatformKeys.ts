import { useEffect, useState } from 'react';

import { ACTION_KEY_APPLE, ACTION_KEY_DEFAULT, isAppleDevice } from '../utils';

export function usePlatformKeys() {
  const [key, setKey] = useState<
    typeof ACTION_KEY_APPLE | typeof ACTION_KEY_DEFAULT | null
  >(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      isAppleDevice() ? setKey(ACTION_KEY_APPLE) : setKey(ACTION_KEY_DEFAULT);
    }
  }, []);

  const [actionKeyReactsTo, actionKeyAltText, actionKeyLabel] =
    key === ACTION_KEY_DEFAULT
      ? ([ACTION_KEY_DEFAULT, 'Control', 'Ctrl'] as const)
      : (['Meta', 'Meta', '⌘'] as const);

  return {
    actionKeyReactsTo,
    actionKeyAltText,
    actionKeyLabel,
    key,
  };
}
