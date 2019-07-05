import formatHits from './formatHits';
import { docsearchHits } from './fixtures/';

describe('formatHits', () => {
  test('with empty hits', () => {
    const hits = [];
    const formattedHits = formatHits(hits);

    expect(formattedHits).toEqual({});
  });

  test('with actual hits', () => {
    const hits = docsearchHits;
    const formattedHits = formatHits(hits);

    expect(formattedHits).toMatchSnapshot();
  });
});
