import assets from './lib/assets';
import css from './lib/css';
import js from './lib/js';
import markdown from './lib/markdown';
import redirects from './lib/redirects';
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
})();
