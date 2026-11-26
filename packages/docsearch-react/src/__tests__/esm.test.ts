// @vitest-environment node

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import pkg from '../../package.json';

const entryPoints = Object.keys(pkg.exports)
  .filter((subpath) => !subpath.startsWith('./style'))
  .map((subpath) => pkg.name + subpath.slice(1));

describe('ESM build', () => {
  // Vitest adds its own CommonJS interop, so only a plain Node process shows how consumers load the build.
  it('can be imported in Node', () => {
    expect(() =>
      execFileSync(
        process.execPath,
        [
          '--input-type=module',
          '--eval',
          `for (const entry of ${JSON.stringify(entryPoints)}) await import(entry);`,
        ],
        { cwd: fileURLToPath(new URL('../..', import.meta.url)), stdio: 'pipe' }
      )
    ).not.toThrow();
  }, 15_000);
});
