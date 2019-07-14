import { getHighlightedValue } from './getHighlightedValue';

describe('getHighlightedValue', () => {
  test('returns the correct highlighted property', () => {
    const hit = {
      anchor: 'structure-the-hierarchy-of-information',
      content: null,
      url: '',
      objectID: '2356576240',
      lvl0: 'Requirements, Tips, FAQ',
      lvl1: 'Tips for a good search',
      lvl2:
        'Structure the <span class="algolia-docsearch-suggestion--highlight">hie</span>rarchy of information',
    };

    const highlightedLvl0 = getHighlightedValue(hit, 'lvl0');
    const highlightedLvl1 = getHighlightedValue(hit, 'lvl1');
    const highlightedLvl2 = getHighlightedValue(hit, 'lvl2');

    expect(highlightedLvl0).toMatchInlineSnapshot(`"Requirements, Tips, FAQ"`);
    expect(highlightedLvl1).toMatchInlineSnapshot(`"Tips for a good search"`);
    expect(highlightedLvl2).toMatchInlineSnapshot(
      `"Structure the <span class=\\"algolia-docsearch-suggestion--highlight\\">hie</span>rarchy of information"`
    );
  });
});
