import { describe, expect, it } from 'vitest';

import type { SidepanelProps } from '../sidepanel';

describe('SidepanelProps', () => {
  it('exposes Agent Studio search parameters', () => {
    const searchParameters: SidepanelProps['searchParameters'] = {
      docs: { distinct: false },
    };

    expect(searchParameters).toEqual({ docs: { distinct: false } });
  });
});
