import { useEffect } from 'react';

export type DocSearchTheme = 'dark' | 'light';

export interface UseThemeProps {
  theme?: DocSearchTheme;
}

export const useTheme = ({ theme }: UseThemeProps): void => {
  useEffect(() => {
    if (!theme) {
      return undefined;
    }

    const previousTheme = document.documentElement.dataset.theme;

    if (theme === previousTheme) {
      return undefined;
    }

    document.documentElement.dataset.theme = theme;

    return (): void => {
      if (previousTheme === undefined) {
        delete document.documentElement.dataset.theme;
      } else {
        document.documentElement.dataset.theme = previousTheme;
      }
    };
  }, [theme]);
};
