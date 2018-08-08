import markdown from './markdown';
import css from './css';
import js from './js';
import assets from './assets';
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
