// eslint-disable-next-line import/no-commonjs
module.exports = {
  mergeStrategy: {
    toSameBranch: ['next'],
  },
  packageJsons: [
    'lerna.json',
    'packages/docsearch/package.json',
    'packages/docsearch-core/package.json',
    'packages/docsearch-renderer-downshift/package.json',
    'packages/docsearch-theme-light/package.json',
    'packages/docsearch-types/package.json',
  ],
  versionUpdated: ({ version, exec }) => {
    [
      `npx json -I -f examples/vanilla/package.json -e 'this.dependencies["docsearch-theme-light"] = "${version}"'`,
      `npx json -I -f examples/vanilla/package.json -e 'this.dependencies["docsearch"] = "${version}"'`,
      `npx json -I -f packages/docsearch-core/package.json -e 'this.dependencies["docsearch-types"] = "^${version}"'`,
      `npx json -I -f packages/docsearch-renderer-downshift/package.json -e 'this.dependencies["docsearch-core"] = "^${version}"'`,
      `npx json -I -f packages/docsearch-renderer-downshift/package.json -e 'this.dependencies["docsearch-types"] = "^${version}"'`,
      `npx json -I -f packages/docsearch/package.json -e 'this.dependencies["docsearch-core"] = "^${version}"'`,
      `npx json -I -f packages/docsearch/package.json -e 'this.dependencies["docsearch-renderer-downshift"] = "^${version}"'`,
      `npx json -I -f packages/docsearch/package.json -e 'this.dependencies["docsearch-types"] = "^${version}"'`,
      `echo "export default '${version}';" > packages/docsearch-core/src/version.ts`,
    ].forEach(exec);
  },
  installCommand: () => `echo "Skipping 'yarn install'"`,
  publishCommand: () =>
    `lerna exec --scope docsearch* -- yarn publish --no-git-tag-version --non-interactive`,
};
