import markdown from './markdown';
import _ from 'lodash';
import css from './css';
import js from './js';
import assets from './assets';
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
  ]);

  markdown.watch();
  css.watch();
  js.watch();
  assets.watch();

  liveServer.start({
    root: './docs',
    open: '/talksearch/',
    port: 8082,
    middleware: [
      // Redirect /talksearch to the root (mimicking GitHub pages)
      function(req, res, next) {
        req.url = _.replace(req.url, /^\/talksearch/, ''); // eslint-disable-line no-param-reassign
        next();
      },
    ],
  });
})();
