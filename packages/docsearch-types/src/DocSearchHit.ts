export interface DocSearchHit {
  objectID: string;
  levels: string[];
  levelIndex: number;
  content: string | null;
  url: string;
}
