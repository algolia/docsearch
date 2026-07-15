import { AnalyticsBrowser } from '@segment/analytics-next';

// Public browser write key — same Segment source as the DocSearch MCP frontend,
// so install-intent events from both sites land in one place (context.page tells them apart).
const WRITE_KEY = 'nPDHxKLCr5n23QOyG11zRsICHC5TqzHe';

let analytics = null;

// Lazily boots Segment on first event so visitors who never interact don't load it.
// Guarded for Docusaurus SSR.
function getAnalytics() {
  if (typeof window === 'undefined') return null;
  analytics ??= AnalyticsBrowser.load({ writeKey: WRITE_KEY });
  return analytics;
}

export function track(event, properties) {
  getAnalytics()?.track(event, properties);
}
