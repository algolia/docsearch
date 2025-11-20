import React from 'react';

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkForMobile = (): void => {
      const isMobileMediaQuery = window.matchMedia('(max-width: 768px)');

      setIsMobile(isMobileMediaQuery.matches);
    };

    checkForMobile();

    window.addEventListener('resize', checkForMobile);

    return (): void => {
      window.removeEventListener('resize', checkForMobile);
    };
  }, []);

  return isMobile;
};
