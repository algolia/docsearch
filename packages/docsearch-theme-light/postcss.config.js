/* eslint-disable import/no-commonjs, no-console */

const fs = require('fs');
const util = require('util');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssVariables = require('postcss-css-variables');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

const source = 'src/index.css';
const destination = 'dist/index.css';
const plugins = [
  autoprefixer,
  cssVariables({
    preserve: true,
  }),
];

async function build({ from, to }) {
  const css = await readFile('src/index.css');
  const result = await postcss(plugins).process(css, { from, to });

  const directoryExists = await exists('dist');

  if (!directoryExists) {
    await mkdir('dist');
  }

  await writeFile('dist/index.css', result.css);

  if (result.map) {
    await writeFile('dist/index.css.map', result.map);
  }
}

build({ from: source, to: destination })
  .then(() => {
    console.log(`Theme compiled to "${destination}".`);
  })
  .catch(error => {
    console.error(error);
  });
