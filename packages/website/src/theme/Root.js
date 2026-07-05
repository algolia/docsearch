import { useLocation } from '@docusaurus/router';
import React from 'react';

/**
 * Fires Segment page events on client-side navigations (Docusaurus SPA).
 * Initial page view is handled by the Segment snippet in the document head.
 */
export default function Root({ children }) {
  const { pathname } = useLocation();
  const isInitialPageView = React.useRef(true);

  React.useEffect(() => {
    if (isInitialPageView.current) {
      isInitialPageView.current = false;
      return;
    }

    if (typeof window !== 'undefined' && window.analytics?.page) {
      window.analytics.page();
    }
  }, [pathname]);

  return children;
}
