import { useEffect } from 'react';

import type { DocSearchTheme } from './types';

export interface UseThemeProps {
  theme?: DocSearchTheme;
}

export const useTheme = ({ theme }: UseThemeProps): void => {
  useEffect(() => {
    if (theme) {
      const previousTheme = document.documentElement.dataset.theme;
      if (theme !== previousTheme) {
        document.documentElement.dataset.theme = theme;
        return (): void => {
          if (previousTheme === undefined) delete document.documentElement.dataset.theme;
          else document.documentElement.dataset.theme = previousTheme;
        };
      }
    }
    return undefined;
  }, [theme]);
};
