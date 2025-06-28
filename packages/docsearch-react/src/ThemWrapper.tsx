import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';

import type { DoSearchTheme } from './types';

export type ThemeProps = {
  theme?: DoSearchTheme;
};

type ThemWrapperProps = PropsWithChildren & ThemeProps;

export const ThemWrapper: React.FC<ThemWrapperProps> = ({ theme, children }) => {
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

  return <>{children}</>;
};
