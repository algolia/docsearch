// Guarded for if Segment is blocked on users site.
function getAnalytics() {
  if (typeof window === 'undefined') return null;
  if (!window.analytics || typeof window.analytics === 'undefined') return null;

  return window.analytics;
}

export function hasConsent() {
  if (typeof window === 'undefined') return false;
  if (typeof window.OnetrustActiveGroups !== 'string') return false;

  return window.OnetrustActiveGroups.split(',').includes('C0002');
}

export function track(event, properties) {
  if (!hasConsent()) return;

  getAnalytics()?.track(event, properties);
}
