import type { PropsWithChildren } from 'react';
import React, { useEffect } from 'react';

import type { DocSearchTheme } from './types';

export type ThemeProps = {
  theme?: DocSearchTheme;
};

type ThemeWrapperProps = PropsWithChildren & ThemeProps;

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children }) => {
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
