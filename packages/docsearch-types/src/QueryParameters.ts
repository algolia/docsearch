import { QueryParameters as RawQueryParameters } from 'algoliasearch';

export interface QueryParameters extends RawQueryParameters {
  attributesToSnippet?: string[];
}
