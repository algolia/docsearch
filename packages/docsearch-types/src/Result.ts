import { Response } from 'algoliasearch';

export interface Result extends Response {
  exhaustiveNbHits: boolean;
}
