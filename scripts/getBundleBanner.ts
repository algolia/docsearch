import { execSync } from 'child_process';

export function getBundleBanner(pkg: any): string {
  const isRelease = process.env.DOCSEARCH_RELEASE === 'true';
  const lastCommitHash = isRelease
    ? undefined
    : execSync('git rev-parse --short HEAD').toString().trim();
  const version = isRelease
    ? pkg.version
    : `${pkg.version} (UNRELEASED ${lastCommitHash})`;
  const authors = '© Algolia, Inc. and contributors';

  return `/*! ${pkg.name} ${version} | MIT License | ${authors} | ${pkg.homepage} */`;
}
