import { AutocompleteApi } from '@algolia/autocomplete-core';
import React from 'react';

interface UseTouchEventsProps {
  getEnvironmentProps: AutocompleteApi<any>['getEnvironmentProps'];
  panelElement: HTMLDivElement | null;
  searchBoxElement: HTMLDivElement | null;
  inputElement: HTMLInputElement | null;
}

export function useTouchEvents({
  getEnvironmentProps,
  panelElement,
  searchBoxElement,
  inputElement,
}: UseTouchEventsProps) {
  React.useEffect(() => {
    if (!(panelElement && searchBoxElement && inputElement)) {
      return undefined;
    }

    const { onTouchStart, onTouchMove } = getEnvironmentProps({
      panelElement,
      searchBoxElement,
      inputElement,
    });

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [getEnvironmentProps, panelElement, searchBoxElement, inputElement]);
}
