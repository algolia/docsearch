import { createAutocomplete, type AutocompleteOptions } from '@algolia/autocomplete-core';
import React from 'react';

import type { DocSearchState, InternalDocSearchHit } from '../types';

type Autocomplete = ReturnType<
  typeof createAutocomplete<
    InternalDocSearchHit,
    React.FormEvent<HTMLFormElement>,
    React.MouseEvent,
    React.KeyboardEvent
  >
>;

type UseAutocompleteProps = {
  initialQuery: string;
  insights?: AutocompleteOptions<InternalDocSearchHit>['insights'];
  navigator?: AutocompleteOptions<InternalDocSearchHit>['navigator'];
  onStateChanged: (state: DocSearchState<InternalDocSearchHit>) => void;
  getSources: AutocompleteOptions<InternalDocSearchHit>['getSources'];
};

type UseAutocomplete = (props: UseAutocompleteProps) => Autocomplete;

export const useAutocomplete: UseAutocomplete = (props) => {
  const autocompleteRef = React.useRef<Autocomplete>(undefined);

  if (!autocompleteRef.current) {
    autocompleteRef.current = createAutocomplete({
      id: 'docsearch',
      defaultActiveItemId: 0,
      openOnFocus: true,
      initialState: {
        query: props.initialQuery,
        context: {
          searchSuggestions: [],
        },
      },
      insights: Boolean(props.insights),
      navigator: props.navigator,
      onStateChange(changes) {
        props.onStateChanged(changes.state);
      },
      getSources: props.getSources,
    });
  }

  return autocompleteRef.current;
};
