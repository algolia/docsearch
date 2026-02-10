import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { glob } from 'glob';

const pattern = 'lib/theme/**/*.js';
const files = glob.sync(pattern);

if (files.length > 0) {
  try {
    execSync(`prettier --config ../../.prettierrc --write "${pattern}"`, {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Prettier failed:', error.message);
    process.exit(1);
  }
}
