import { hasConsent } from '@site/src/lib/segment.js';

/** @type import('@docusaurus/types').ClientModule */
export default {
  onRouteDidUpdate({ location, previousLocation }) {
    if (
      window.analytics &&
      hasConsent() &&
      previousLocation &&
      location.pathname !== previousLocation.pathname
    ) {
      setTimeout(() => {
        window.analytics.page();
      });
    }
  },
};
