import markdown from './lib/markdown';
import css from './lib/css';
import js from './lib/js';
import assets from './lib/assets';
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
})();
