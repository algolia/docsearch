/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs, import/no-extraneous-dependencies */

const { execSync } = require('child_process');
const fs = require('fs');
const util = require('util');

const cssnano = require('cssnano');
const postcss = require('postcss');

const pkg = require('./package.json');

const readFile = util.promisify(fs.readFile);

function getBundleBanner(_pkg) {
  const lastCommitHash = execSync('git rev-parse --short HEAD').toString().trim();
  const version = process.env.SHIPJS ? _pkg.version : `${_pkg.version} (UNRELEASED ${lastCommitHash})`;
  const authors = '© Algolia, Inc. and contributors';

  return `/*! ${_pkg.name} ${version} | MIT License | ${authors} | ${_pkg.homepage} */`;
}

function build({ input, output, banner }) {
  fs.readFile(input, (error, css) => {
    if (error) {
      throw error;
    }

    postcss([cssnano])
      .process(css, { from: input, to: output })
      .then((result) => {
        fs.writeFile(output, [banner, result.css].join('\n'), () => true);
      });
  });
}

build({
  input: 'src/_variables.css',
  output: 'dist/_variables.css',
  banner: getBundleBanner({ ...pkg, name: `${pkg.name} Variables` }),
});
build({
  input: 'src/button.css',
  output: 'dist/button.css',
  banner: getBundleBanner({ ...pkg, name: `${pkg.name} Button` }),
});
build({
  input: 'src/modal.css',
  output: 'dist/modal.css',
  banner: getBundleBanner({ ...pkg, name: `${pkg.name} Modal` }),
});
build({
  input: 'src/sidepanel.css',
  output: 'dist/sidepanel.css',
  banner: getBundleBanner({ ...pkg, name: `${pkg.name} Sidepanel` }),
});

async function buildStyle() {
  const variablesCss = await readFile('src/_variables.css');
  const buttonCss = await readFile('src/button.css');
  const modalCss = await readFile('src/modal.css');

  const variablesOutput = await postcss([cssnano]).process(variablesCss, {
    from: undefined,
  });
  const buttonOutput = await postcss([cssnano]).process(buttonCss, {
    from: undefined,
  });
  const modalOutput = await postcss([cssnano]).process(modalCss, {
    from: undefined,
  });

  fs.writeFile(
    'dist/style.css',
    [getBundleBanner(pkg), [variablesOutput.css, buttonOutput.css, modalOutput.css].join('')].join('\n'),
    () => true,
  );

  fs.writeFile(
    'dist/style.scss',
    [getBundleBanner(pkg), [variablesOutput.css, buttonOutput.css, modalOutput.css].join('')].join('\n'),
    () => true,
  );
}

buildStyle();
