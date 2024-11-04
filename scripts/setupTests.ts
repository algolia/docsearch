import type { Mock } from 'vitest';
import { vi } from 'vitest';

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
