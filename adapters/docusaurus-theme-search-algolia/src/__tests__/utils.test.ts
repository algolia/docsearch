/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assert from 'node:assert/strict';

import { describe, it } from 'vitest';

import { mergeFacetFilters } from '../client/utils';

describe('mergeFacetFilters', () => {
  it('merges [string,string]', () => {
    assert.deepStrictEqual(mergeFacetFilters('f1', 'f2'), ['f1', 'f2']);
  });

  it('merges [string,array]', () => {
    assert.deepStrictEqual(mergeFacetFilters('f1', ['f2', 'f3']), ['f1', 'f2', 'f3']);
  });

  it('merges [string,undefined]', () => {
    assert.deepStrictEqual(mergeFacetFilters('f1', undefined), 'f1');
  });

  it('merges [undefined,string]', () => {
    assert.deepStrictEqual(mergeFacetFilters(undefined, 'f1'), 'f1');
  });

  it('merges [array,undefined]', () => {
    assert.deepStrictEqual(mergeFacetFilters(['f1', 'f2'], undefined), ['f1', 'f2']);
  });

  it('merges [undefined,array]', () => {
    assert.deepStrictEqual(mergeFacetFilters(undefined, ['f1', 'f2']), ['f1', 'f2']);
  });

  it('merges [array,array]', () => {
    assert.deepStrictEqual(mergeFacetFilters(['f1'], ['f2']), ['f1', 'f2']);

    assert.deepStrictEqual(mergeFacetFilters(['f1', 'f2'], ['f3', 'f4']), ['f1', 'f2', 'f3', 'f4']);
  });
});
