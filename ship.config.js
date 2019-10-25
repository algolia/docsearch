/* eslint-disable import/no-commonjs */
const fs = require('fs');
const path = require('path');

module.exports = {
  mergeStrategy: {
    toSameBranch: ['next'],
  },
  monorepo: {
    mainVersionFile: 'lerna.json',
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
    exec(
      `yarn workspace docsearch.js add docsearch-renderer-downshift@^${version}`
    );
    exec(`yarn workspace docsearch.js add docsearch-types@^${version}`);

    // update version.ts
    fs.writeFileSync(
      path.resolve(dir, 'packages/docsearch-core/src/version.ts'),
      `export default '${version}';\n`
    );
  },
};
