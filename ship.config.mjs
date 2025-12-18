import fs from 'fs';
import path from 'path';

const packages = [
  'packages/docsearch-css',
  'packages/docsearch-react',
  'packages/docsearch-js',
  'packages/docsearch-core',
  'packages/docsearch-modal',
  'packages/docsearch-sidepanel',
  'packages/docsearch-sidepanel-js',
];

export default {
  monorepo: {
    mainVersionFile: 'lerna.json',
    // We rely on Lerna to bump our dependencies.
    packagesToBump: [],
    packagesToPublish: packages,
  },
  publishCommand({ tag }) {
    return `npm publish --tag ${tag} --access public`;
  },
  versionUpdated({ exec, dir, version }) {
    // Update package dependencies
    exec(`yarn lerna version ${version} --exact --no-git-tag-version --no-push --yes`);

    // Ship.js reads JSON and writes with `fs.writeFileSync(JSON.stringify(json, null, 2))`
    // which causes a lint error in the `lerna.json` file.
    exec('yarn eslint lerna.json --fix');

    fs.writeFileSync(
      path.resolve(dir, 'packages', 'docsearch-react', 'src', 'version.ts'),
      `export const version = '${version}';\n`,
    );
  },
};
