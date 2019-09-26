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
    // update internal dependencies
    exec(`yarn workspace vanilla-example add docsearch-theme-light@${version}`);
    exec(`yarn workspace vanilla-example add docsearch.js@${version}`);
    exec(`yarn workspace docsearch-core add docsearch-types@^${version}`);
    exec(
      `yarn workspace docsearch-renderer-downshift add docsearch-core@^${version}`
    );
    exec(
      `yarn workspace docsearch-renderer-downshift add docsearch-types@^${version}`
    );
    exec(`yarn workspace docsearch.js add docsearch-core@^${version}`);
    exec(`yarn workspace docsearch.js add docsearch-renderer-downshift@^${version}`);
    exec(`yarn workspace docsearch.js add docsearch-types@^${version}`);

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
