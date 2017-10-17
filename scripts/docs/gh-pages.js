/* eslint no-console:0 */
import ghpages from 'gh-pages';
import {join} from 'path';

let basePath = join(__dirname, '../../docs/_site');

ghpages.clean();

if (process.env.CI === 'true') {
  ghpages.publish(basePath, {
    repo: 'https://' + process.env.GH_TOKEN + '@github.com/algolia/docsearch.git'
  }, end);
} else {
  ghpages.publish(basePath, end);
}

function end(err) {
  if (err) {
    throw err;
  } else {
    console.log('published gh-pages');
  }
}