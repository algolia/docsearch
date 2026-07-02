import { cleanup } from '@testing-library/react';
import type { Mock } from 'vitest';
import { afterEach, vi } from 'vitest';

// Vitest does not expose a global `afterEach`, so @testing-library/react never registers its
// automatic cleanup (see RTL dist/index.js). Without this, DOM from earlier tests leaks.
afterEach(() => {
  cleanup();
});

type MatchMediaProps = Partial<{
  matches: boolean;
  media: string;
  onchange: null;
  addListener: Mock;
  removeListener: Mock;
  addEventListener: Mock;
  removeEventListener: Mock;
  dispatchEvent: Mock;
}>;

const createMatchMedia = (props: MatchMediaProps): Mock => {
  return vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    ...props,
  }));
};

vi.stubGlobal('scrollTo', vi.fn());
vi.stubGlobal('matchMedia', createMatchMedia({ matches: true }));
