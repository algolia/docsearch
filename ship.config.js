/* eslint-disable import/no-commonjs */
const fs = require('fs');
const path = require('path');

module.exports = {
  mergeStrategy: {
    toSameBranch: ['next'],
  },
  monorepo: {
    readVersionFrom: 'lerna.json',
    packagesToBump: ['packages/*'],
    packagesToPublish: ['packages/*'],
  },
  versionUpdated: ({ version, dir, exec }) => {
    const update = (package, dependency) =>
      exec(`yarn workspace ${package} add ${dependency}@${version}`);

    // update internal dependencies
    update('vanilla-example', 'docsearch-theme-light');
    update('vanilla-example', 'docsearch.js');
    update('docsearch-core', 'docsearch-types');
    update('docsearch-renderer-downshift', 'docsearch-core');
    update('docsearch-renderer-downshift', 'docsearch-types');
    update('docsearch.js', 'docsearch-core');
    update('docsearch.js', 'docsearch-renderer-downshift');
    update('docsearch.js', 'docsearch-types');

    // update lerna.json
    const lernaConfigPath = path.resolve(dir, 'lerna.json');
    const lernaConfig = {
      ...JSON.parse(fs.readFileSync(lernaConfigPath)),
      version,
    };
    fs.writeFileSync(lernaConfigPath, JSON.stringify(lernaConfig, null, 2));

    // update version.ts
    fs.writeFileSync(
      path.resolve(dir, 'packages/docsearch-core/src/version.ts'),
      `export default '${version}';\n`
    );
  },
};
