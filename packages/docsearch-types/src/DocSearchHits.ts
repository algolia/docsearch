import { DocSearchHit } from './DocSearchHit';

export interface DocSearchHits {
  [title: string]: DocSearchHit[];
}
