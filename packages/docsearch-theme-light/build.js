/* eslint-disable import/no-commonjs, no-console */

const fs = require('fs');
const util = require('util');
const postcss = require('postcss');

const { plugins } = require('./postcss.config');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);

const source = 'src/index.css';
const destinationFolder = 'dist';
const destination = `${destinationFolder}/index.css`;

async function build({ from, to }) {
  const css = await readFile('src/index.css');
  const result = await postcss(plugins).process(css, { from, to });

  const directoryExists = await exists(destinationFolder);

  if (!directoryExists) {
    await mkdir(destinationFolder);
  }

  await writeFile(destination, result.css);

  if (result.map) {
    await writeFile(`${destination}.map`, result.map);
  }
}

build({ from: source, to: destination })
  .then(() => {
    console.log(`Theme compiled to "${destination}".`);
  })
  .catch(error => {
    console.error(error);
  });
