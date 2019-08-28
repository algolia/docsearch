import markdown from './lib/markdown';
import _ from 'lodash';
import css from './lib/css';
import js from './lib/js';
import assets from './lib/assets';
import redirects from './lib/redirects';
import liveServer from 'live-server';
import pAll from 'p-all';

(async function() {
  await pAll([
    async () => {
      await markdown.run();
      await css.run();
    },
    async () => await js.run(),
    async () => await assets.run(),
    async () => await redirects.run(),
  ]);

  markdown.watch();
  css.watch();
  js.watch();
  assets.watch();

  liveServer.start({
    root: './dist',
    open: '/docsearch/',
    port: 8082,
    middleware: [
      // Redirect subdirectory to the root (mimicking GitHub pages)
      function(req, res, next) {
        req.url = _.replace(req.url, /^\/docsearch/, ''); // eslint-disable-line no-param-reassign
        next();
      },
    ],
  });
})();
