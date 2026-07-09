import fs from 'fs';
import path from 'path';

import browserslist from 'browserslist';
import { browserslistToTargets, bundle } from 'lightningcss';

import { getBundleBanner } from '../../scripts/getBundleBanner';

import pkg from './package.json' with { type: 'json' };

interface Entry {
  input: string;
  outputs: string[];
  /** Suffix appended to the package name in the bundle banner. */
  bannerName?: string;
}

const ENTRIES: Entry[] = [
  {
    input: 'src/_variables.css',
    outputs: ['dist/_variables.css'],
    bannerName: 'Variables',
  },
  {
    input: 'src/button.css',
    outputs: ['dist/button.css'],
    bannerName: 'Button',
  },
  { input: 'src/modal.css', outputs: ['dist/modal.css'], bannerName: 'Modal' },
  {
    input: 'src/askai.css',
    outputs: ['dist/askai.css', 'dist/askai.scss'],
    bannerName: 'Ask AI',
  },
  { input: 'src/style.css', outputs: ['dist/style.css', 'dist/style.scss'] },
  {
    input: 'src/sidepanel.css',
    outputs: ['dist/sidepanel.css', 'dist/sidepanel.scss'],
    bannerName: 'Sidepanel',
  },
];

const targets = browserslistToTargets(browserslist(undefined, { path: import.meta.dirname }));

function build({ input, outputs, bannerName }: Entry): void {
  const banner = getBundleBanner({
    ...pkg,
    name: bannerName ? `${pkg.name} ${bannerName}` : pkg.name,
  });

  const { code } = bundle({
    filename: path.join(import.meta.dirname, input),
    minify: true,
    targets,
  });

  const content = [banner, code.toString()].join('\n');

  for (const output of outputs) {
    fs.writeFileSync(path.join(import.meta.dirname, output), content);
  }
}

ENTRIES.forEach(build);
