import docsearchCore from 'docsearch.js-core';

import docsearch from '.';

jest.mock('docsearch.js-core');

const castToJestMock = (obj: any): jest.Mock => obj;

describe('docsearch', () => {
  beforeEach(() => {
    castToJestMock(docsearchCore).mockImplementation(() => {});
  });

  afterEach(() => {
    castToJestMock(docsearchCore).mockReset();
  });

  test('forwards the options to docsearch-core', () => {
    const containerNode = document.createElement('div');
    const docsearchOptions = {
      appId: 'appId',
      apiKey: 'apiKey',
      indexName: 'indexName',
      containerNode,
    };

    docsearch(docsearchOptions);

    expect(docsearchCore).toHaveBeenCalledTimes(1);
    expect(docsearchCore).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'appId',
        apiKey: 'apiKey',
        indexName: 'indexName',
      })
    );
  });
});
