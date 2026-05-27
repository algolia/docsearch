/** @type {import('@docusaurus/types').HtmlTags} */
export const trackingHeadTags = [
  // OneTrust must load before other tracking scripts (see cookielaw.org docs).
  {
    tagName: 'script',
    attributes: {
      src: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
      type: 'text/javascript',
      charset: 'UTF-8',
      'data-domain-script': '5e9f5149-bde8-4a13-b973-b7a9385e8ebb',
    },
  },
  {
    tagName: 'script',
    attributes: {
      type: 'text/javascript',
    },
    innerHTML: 'function OptanonWrapper() { }',
  },
  {
    tagName: 'script',
    attributes: {
      type: 'text/javascript',
    },
    innerHTML: `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="eEj3ERCjH7KxK1jEMjQF7uzmtZGALFHn";;analytics.SNIPPET_VERSION="4.15.3";
  analytics.load("eEj3ERCjH7KxK1jEMjQF7uzmtZGALFHn");
  analytics.page();
  }}();`,
  },
];
