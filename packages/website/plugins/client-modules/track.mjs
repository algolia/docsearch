/** @type import('@docusaurus/types').ClientModule */
export default {
  onRouteDidUpdate({ location, previousLocation }) {
    if (
      window.analytics &&
      previousLocation &&
      location.pathname !== previousLocation.pathname
    ) {
      setTimeout(() => {
        window.analytics.page();
      });
    }
  },
};
