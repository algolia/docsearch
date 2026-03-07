import type { DocSearchTransformClient } from '..';
import { version } from '../version';

export const setSidepanelSearchClient = (client: DocSearchTransformClient): DocSearchTransformClient => {
  if (/docsearch-sidepanel.js \(.*\)/.test(client.transporter.algoliaAgent.value) === false) {
    client.addAlgoliaAgent('docsearch-sidepanel', version);
  }

  return client;
};
