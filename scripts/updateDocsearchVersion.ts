import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const packageJsonPath = join(root, 'packages', 'docsearch-react', 'package.json');
const versionFilePath = join(root, 'packages', 'docsearch-react', 'src', 'version.ts');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const packageVersion = packageJson.version;

if (typeof packageVersion !== 'string') {
  throw new Error('Unable to determine @docsearch/react version.');
}

const nextContent = `export const version = '${packageVersion}';\n`;
const currentContent = readFileSync(versionFilePath, 'utf8');

if (currentContent === nextContent) {
  console.log('DocSearch version file already up to date.');
} else {
  writeFileSync(versionFilePath, nextContent, 'utf8');
  console.log(`Updated docsearch-react version to ${packageVersion}.`);
}
