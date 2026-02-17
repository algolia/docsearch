import { execSync } from 'node:child_process';

import { glob } from 'glob';

const pattern = 'lib/theme/**/*.js';
const files = glob.sync(pattern);

if (files.length > 0) {
  try {
    execSync(`prettier --config ../../.prettierrc --write "${pattern}"`, {
      stdio: 'inherit',
    });
  } catch (error) {
    throw new Error(`Prettier failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
