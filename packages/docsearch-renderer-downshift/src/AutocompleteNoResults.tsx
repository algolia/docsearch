import { h } from 'preact';

export const AutocompleteNoResults = ({ query }) => {
  return (
    <div>
      <p>
        No results for <q>{query}</q>
      </p>
      <p>Try to use different terms.</p>
    </div>
  );
};
