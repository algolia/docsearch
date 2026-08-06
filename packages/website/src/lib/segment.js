// Guarded for if Segment is blocked on users site.
function getAnalytics() {
  if (typeof window === 'undefined') return null;
  if (!window.analytics || typeof window.analytics === 'undefined') return null;

  return window.analytics;
}

export function track(event, properties) {
  getAnalytics()?.track(event, properties);
}
