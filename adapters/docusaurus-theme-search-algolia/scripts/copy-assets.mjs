import fs from 'node:fs';
import path from 'node:path';

import fse from 'fs-extra';

const WATCH_FLAG = '--watch';
const ASSET_EXTENSIONS = new Set(['.css']);
const IGNORED_EXTENSIONS = new Set(['.ts', '.tsx', '.d.ts']);

const cwd = process.cwd();
const srcRoot = path.join(cwd, 'src', 'theme');
const destRoot = path.join(cwd, 'lib', 'theme');

async function copyAssetFile(filePath) {
  const relativePath = path.relative(srcRoot, filePath);
  const destPath = path.join(destRoot, relativePath);

  await fse.ensureDir(path.dirname(destPath));
  await fse.copyFile(filePath, destPath);
}

async function copyAssetsOnce() {
  if (!(await fse.pathExists(srcRoot))) {
    return;
  }

  const entries = await fse.readdir(srcRoot, { recursive: true });
  const filePaths = entries
    .filter((entry) => typeof entry === 'string')
    .map((entry) => path.join(srcRoot, entry))
    .filter((entryPath) => fs.statSync(entryPath).isFile());

  await Promise.all(
    filePaths
      .filter((filePath) => {
        const extension = path.extname(filePath);
        if (IGNORED_EXTENSIONS.has(extension)) {
          return false;
        }
        return ASSET_EXTENSIONS.has(extension);
      })
      .map((filePath) => copyAssetFile(filePath)),
  );
}

function watchAssets() {
  if (!fs.existsSync(srcRoot)) {
    return;
  }

  copyAssetsOnce();

  fs.watch(srcRoot, { recursive: true }, (_eventType, filename) => {
    if (!filename) {
      return;
    }
    const filePath = path.join(srcRoot, filename);
    const extension = path.extname(filePath);
    if (IGNORED_EXTENSIONS.has(extension) || !ASSET_EXTENSIONS.has(extension)) {
      return;
    }
    if (!fs.existsSync(filePath)) {
      return;
    }
    copyAssetFile(filePath);
  });
}

if (process.argv.includes(WATCH_FLAG)) {
  watchAssets();
} else {
  copyAssetsOnce();
}
