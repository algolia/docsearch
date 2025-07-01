import { ASK_AI_API_URL } from './constants';

// ... existing imports ...
const TOKEN_KEY = 'askai_token';

type TokenPayload = { exp: number };

const decode = (token: string): TokenPayload => {
  const [b64] = token.split('.');
  return JSON.parse(atob(b64));
};

const isExpired = (token?: string | null): boolean => {
  if (!token) return true;
  try {
    const { exp } = decode(token);
    // refresh 30 s before the backend rejects it
    return Date.now() / 1000 > exp - 30;
  } catch {
    return true;
  }
};

let inflight: Promise<string> | null = null;

// call /token once, cache the promise while it’s running
// eslint-disable-next-line require-await
export const getValidToken = async ({ configId }: { configId: string }): Promise<string> => {
  const cached = sessionStorage.getItem(TOKEN_KEY);
  if (!isExpired(cached)) return cached!;

  if (!inflight) {
    inflight = fetch(`${ASK_AI_API_URL}/token`, {
      method: 'POST',
      headers: {
        'x-algolia-assistant-id': configId,
        'content-type': 'application/json',
      },
    })
      .then((r) => r.json())
      .then(({ token }) => {
        sessionStorage.setItem(TOKEN_KEY, token);
        return token;
      })
      .finally(() => (inflight = null));
  }

  return inflight;
};
