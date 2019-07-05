import docsearchCore from 'docsearch.js-core';

import docsearch from '.';
import renderer from './renderer';

jest.mock('docsearch.js-core');

const castToJestMock = (obj: any): jest.Mock => obj;

describe('docsearch', () => {
  beforeEach(() => {
    castToJestMock(docsearchCore).mockImplementation(() => {});
  });

  afterEach(() => {
    castToJestMock(docsearchCore).mockReset();
  });

  test('propagates the options to docsearch-core', () => {
    const docsearchOptions = {
      appId: 'appId',
      apiKey: 'apiKey',
      indexName: 'indexName',
    };

    docsearch(docsearchOptions);

    expect(docsearchCore).toHaveBeenCalledTimes(1);
    expect(docsearchCore).toHaveBeenCalledWith(
      expect.objectContaining(docsearchOptions)
    );
    expect(docsearchCore).toHaveBeenCalledWith(
      expect.objectContaining({ onResult: renderer })
    );
  });
});
