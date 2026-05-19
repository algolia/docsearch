import type { AutocompleteApi } from '@algolia/autocomplete-core';
import type React from 'react';

import type { DocSearchTheme, InternalDocSearchHit } from '../types';
import { useTouchEvents } from '../useTouchEvents';
import { useTrapFocus } from '../useTrapFocus';

import { useDocSearchModalEffects } from './useDocSearchModalEffects';

export function useModalEnvironment({
  getEnvironmentProps,
  containerRef,
  dropdownRef,
  formElementRef,
  inputRef,
  initialScrollY,
  modalRef,
  snippetLength,
  theme,
}: {
  getEnvironmentProps: AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent<HTMLFormElement>,
    React.MouseEvent,
    React.KeyboardEvent
  >['getEnvironmentProps'];
  containerRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  formElementRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  initialScrollY: number;
  modalRef: React.RefObject<HTMLDivElement | null>;
  snippetLength: React.MutableRefObject<number>;
  theme?: DocSearchTheme;
}): void {
  useTouchEvents({
    getEnvironmentProps,
    panelElement: dropdownRef.current,
    formElement: formElementRef.current,
    inputElement: inputRef.current,
  });
  useTrapFocus({ container: containerRef.current });
  useDocSearchModalEffects({ initialScrollY, modalRef, snippetLength, theme });
}
