import docsearchCore from 'docsearch-core';

jest.mock('docsearch-core');

const castToJestMock = (obj: any): jest.Mock => obj;

describe('docsearch-preset-autocomplete', () => {
  beforeEach(() => {
    castToJestMock(docsearchCore).mockImplementation(() => {});
  });

  afterEach(() => {
    castToJestMock(docsearchCore).mockReset();
  });
});
