import { OnResultOptions } from 'docsearch.js-core';

function renderer({ containerNode, hits }: OnResultOptions<HTMLElement>): void {
  if (!containerNode) {
    return;
  }

  containerNode.innerHTML = `<pre>${JSON.stringify(hits, null, 2)}</pre>`;
}

export default renderer;
