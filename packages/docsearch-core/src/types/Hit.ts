export interface HitAttributeHighlightResult {
  value: string;
  matchLevel: 'none' | 'partial' | 'full';
  matchedWords: string[];
  fullyHighlighted?: boolean;
}

export interface HitHighlightResult {
  [attribute: string]:
    | HitAttributeHighlightResult
    | HitAttributeHighlightResult[]
    | HitHighlightResult;
}

export type HitAttributeSnippetResult = Pick<
  HitAttributeHighlightResult,
  'value' | 'matchLevel'
>;

interface HitSnippetResult {
  [attribute: string]:
    | HitAttributeSnippetResult
    | HitAttributeSnippetResult[]
    | HitSnippetResult;
}

export interface Hit {
  [attribute: string]: any;
  objectID: string;
  _highlightResult: HitHighlightResult;
  _snippetResult: HitSnippetResult;
  _rankingInfo?: {
    promoted: boolean;
    nbTypos: number;
    firstMatchedWord: number;
    proximityDistance?: number;
    geoDistance: number;
    geoPrecision?: number;
    nbExactWords: number;
    words: number;
    filters: number;
    userScore: number;
    matchedGeoLocation?: {
      lat: number;
      lng: number;
      distance: number;
    };
  };
  _distinctSeqID?: number;
}
