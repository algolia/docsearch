import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import React from 'react';

import DemoApp from '../components/demo/DemoApp';

import '@docsearch/css/dist/style.css';
import '@docsearch/css/dist/sidepanel.css';
import '../components/demo/demo.css';

// Bare, chrome-less page embedded in an iframe on the homepage. It hosts a live
// DocSearch widget driven by the autopilot. No @theme/Layout on purpose: the
// iframe's own document body is the containment box for the modal/side panel,
// and it keeps the site navbar's real DocSearch instance out of the way.
export default function DemoEmbedPage() {
  return (
    <>
      <Head>
        <html className="docsearch-demo-embed-html" />
        <body className="docsearch-demo-embed-body" />
        <meta name="robots" content="noindex, nofollow" />
        <title>DocSearch live demo</title>
      </Head>
      <BrowserOnly>{() => <DemoApp />}</BrowserOnly>
    </>
  );
}
