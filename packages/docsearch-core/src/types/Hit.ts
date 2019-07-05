interface DocSearchHitAttributeHighlightResult {
  value: string;
  matchLevel: string; // 'none' | 'partial' | 'full'
  matchedWords: string[];
  fullyHighlighted?: boolean;
}

interface DocSearchHitHighlightResultHierarchy {
  lvl0?: DocSearchHitAttributeHighlightResult;
  lvl1?: DocSearchHitAttributeHighlightResult;
  lvl2?: DocSearchHitAttributeHighlightResult;
  lvl3?: DocSearchHitAttributeHighlightResult;
  lvl4?: DocSearchHitAttributeHighlightResult;
  lvl5?: DocSearchHitAttributeHighlightResult;
  lvl6?: DocSearchHitAttributeHighlightResult;
}

export interface DocSearchHitHighlightResult {
  content?: DocSearchHitAttributeHighlightResult;
  hierarchy: DocSearchHitHighlightResultHierarchy;
  hierarchy_camel: DocSearchHitHighlightResultHierarchy[];
}

interface DocSearchHitAttributeSnippetResult {
  value: string;
  matchLevel: string; // 'none' | 'partial' | 'full'
}

interface DocSearchHitSnippetResult {
  content: DocSearchHitAttributeSnippetResult;
}

export interface DocSearchHit {
  [attribute: string]: any;
  objectID: string;
  content: string | null;
  url: string;
  anchor: string | null;
  hierarchy: {
    lvl0: string | null;
    lvl1: string | null;
    lvl2: string | null;
    lvl3: string | null;
    lvl4: string | null;
    lvl5: string | null;
    lvl6: string | null;
  };
  _highlightResult: DocSearchHitHighlightResult;
  _snippetResult?: DocSearchHitSnippetResult;
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
