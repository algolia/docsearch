import type { AutocompleteApi } from '@algolia/autocomplete-core';
import React from 'react';

interface UseTouchEventsProps {
  getEnvironmentProps: AutocompleteApi<any>['getEnvironmentProps'];
  panelElement: HTMLDivElement | null;
  formElement: HTMLDivElement | null;
  inputElement: HTMLInputElement | null;
}

export function useTouchEvents({
  getEnvironmentProps,
  panelElement,
  formElement,
  inputElement,
}: UseTouchEventsProps): void {
  React.useEffect(() => {
    if (!(panelElement && formElement && inputElement)) {
      return undefined;
    }

    const { onTouchStart, onTouchMove } = getEnvironmentProps({
      panelElement,
      formElement,
      inputElement,
    });

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return (): void => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [getEnvironmentProps, panelElement, formElement, inputElement]);
}
