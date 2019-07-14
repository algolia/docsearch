import formatHits from './formatHits';
import { hits } from './fixtures/';

describe('formatHits', () => {
  test('with empty hits', () => {
    const hits = [];
    const formattedHits = formatHits(hits);

    expect(formattedHits).toEqual({});
  });

  test('with actual hits', () => {
    const formattedHits = formatHits(hits);

    expect(formattedHits).toMatchSnapshot();
  });
});
