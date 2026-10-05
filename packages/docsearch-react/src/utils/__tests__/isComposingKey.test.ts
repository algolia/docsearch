import { describe, expect, it } from 'vitest';

import { isComposingKey } from '../isComposingKey';

function keyEvent({
  isComposing = false,
  keyCode = 13,
}: {
  isComposing?: boolean;
  keyCode?: number;
}): {
  keyCode: number;
  nativeEvent: { isComposing: boolean };
} {
  return {
    keyCode,
    nativeEvent: { isComposing },
  };
}

describe('isComposingKey', () => {
  it('is true while the browser reports an active composition', () => {
    expect(isComposingKey(keyEvent({ isComposing: true, keyCode: 13 }))).toBe(
      true
    );
  });

  it('is true for the Safari IME process key code', () => {
    expect(isComposingKey(keyEvent({ isComposing: false, keyCode: 229 }))).toBe(
      true
    );
  });

  it('is false for a committed Enter', () => {
    expect(isComposingKey(keyEvent({ isComposing: false, keyCode: 13 }))).toBe(
      false
    );
  });
});
