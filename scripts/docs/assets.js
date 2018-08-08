import pify from 'pify';
import cpx from 'cpx';
const copy = pify(cpx.copy);

const sourcePattern = './src/**/*.{gif,png,ico,html,svg,woff}';

export default {
  async run() {
    return await copy(sourcePattern, './docs');
  },

  watch() {
    cpx.watch(sourcePattern, './docs');
  },
};
