/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const packages = [
  'packages/docsearch-css',
  'packages/docsearch-react',
  'packages/docsearch-js',
];

module.exports = {
  monorepo: {
    mainVersionFile: 'lerna.json',
    // We rely on Lerna to bump our dependencies.
    packagesToBump: [],
    packagesToPublish: packages,
  },
  publishCommand({ tag }) {
    return `yarn publish --access public --tag ${tag}`;
  },
  versionUpdated({ exec, dir, version }) {
    // Update package dependencies
    exec(
      `yarn lerna version ${version} --exact --no-git-tag-version --no-push --yes`
    );

    // Ship.js reads JSON and writes with `fs.writeFileSync(JSON.stringify(json, null, 2))`
    // which causes a lint error in the `lerna.json` file.
    exec('yarn eslint lerna.json --fix');

    fs.writeFileSync(
      path.resolve(dir, 'packages', 'docsearch-react', 'src', 'version.ts'),
      `export const version = '${version}';\n`
    );
  },
  // Skip preparation if it contains only `chore` commits
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;

    if (releaseType === 'patch' && fix === 0) {
      return false;
    }

    return true;
  },
};
