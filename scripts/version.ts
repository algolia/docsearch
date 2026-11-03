// oxlint-disable no-console
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { $ } from 'bun';

import { log } from './log';

const BASE_BRANCH = 'main';

type Report = (message: string) => void;

interface ChangesetStatus {
  changesets: Array<{
    id: string;
    summary: string;
    releases: Array<{ name: string; type: string }>;
  }>;
  releases: Array<{
    name: string;
    type: string;
    oldVersion: string;
    newVersion: string;
  }>;
}

function fail(message: string): never {
  log.error(message);
  process.exit(1);
}

function describeError(err: unknown): string {
  if (err instanceof $.ShellError) {
    const stderr = err.stderr.toString().trim();
    return stderr ? `${err.message}\n${stderr}` : err.message;
  }

  return err instanceof Error ? err.message : String(err);
}

function checkGithubCli(report: Report) {
  const bin = Bun.which('gh');

  if (!bin || bin.trim().length === 0) {
    report('GitHub CLI not installed');
  }
}

async function assertReadyToVersion(report: Report) {
  const currentBranch = (await $`git branch --show-current`.text()).trim();
  if (currentBranch !== BASE_BRANCH) {
    report(`Must be on ${BASE_BRANCH}, currently on ${currentBranch}`);
  }

  if ((await $`git status --porcelain`.text()).trim()) {
    report('Working tree is not clean');
  }

  await $`git fetch origin ${BASE_BRANCH}`.quiet();
  const [local, remote] = await Promise.all([
    $`git rev-parse HEAD`.text(),
    $`git rev-parse origin/${BASE_BRANCH}`.text(),
  ]);
  if (local.trim() !== remote.trim()) {
    report(`${BASE_BRANCH} is not in sync with origin/${BASE_BRANCH}`);
  }

  if ((await $`gh auth status`.quiet().nothrow()).exitCode !== 0) {
    report('GitHub CLI is not authenticated, run `gh auth login`');
  }
}

async function assertBranchAvailable(branch: string, report: Report) {
  const [local, remote] = await Promise.all([
    $`git rev-parse --verify --quiet refs/heads/${branch}`.quiet().nothrow(),
    $`git ls-remote --exit-code --heads origin ${branch}`.quiet().nothrow(),
  ]);

  if (local.exitCode === 0) {
    report(`Branch ${branch} already exists locally`);
  }

  if (remote.exitCode === 0) {
    report(`Branch ${branch} already exists on origin`);
  }
}

async function getChangesetStatus() {
  const outputFile = path.join(tmpdir(), `changeset-status-${Date.now()}.json`);

  try {
    await $`bun run changeset status --output ${outputFile}`.quiet();
    const status: ChangesetStatus = await Bun.file(outputFile).json();

    return {
      ...status,
      releases: status.releases
        .filter((r) => r.type !== 'none' && r.newVersion !== r.oldVersion)
        .toSorted((a, b) => a.name.localeCompare(b.name)),
    };
  } finally {
    await rm(outputFile, { force: true });
  }
}

function getReleaseName(releases: ChangesetStatus['releases']) {
  const react = releases.find(({ name }) => name === '@docsearch/react');

  if (react) {
    return `v${react.newVersion}`;
  }

  return releases
    .map(
      ({ name, newVersion }) =>
        `${name.replace('@docsearch/', '')}-v${newVersion}`
    )
    .join('_');
}

function buildPrBody(releaseName: string, status: ChangesetStatus): string {
  return [
    `## Release ${releaseName}`,
    '',
    '### Changes',
    '',
    ...status.changesets.map(({ summary, releases }) => {
      const scope = releases
        .map(({ name, type }) => `\`${name}\` (${type})`)
        .join(', ');
      return `- ${summary.trim().replace(/\n/g, '\n  ')}\n  <sub>${scope}</sub>`;
    }),
    '',
    '### Packages',
    '',
    '| Package | Bump | Version |',
    '| --- | --- | --- |',
    ...status.releases.map(
      ({ name, type, oldVersion, newVersion }) =>
        `| \`${name}\` | ${type} | ${oldVersion} → ${newVersion} |`
    ),
    '',
    '---',
    '',
    'Merging this PR triggers the CircleCI `release` job, which publishes to npm and creates the GitHub releases for the packages sharing the `@docsearch/react` version.',
  ].join('\n');
}

const CELL = '\x1f';
const ROW = '\x1e';

function renderTable(children: string): string {
  const rows = children
    .split(ROW)
    .slice(0, -1)
    .map((row) => row.split(CELL).slice(0, -1));
  const widths = rows[0].map((_, i) =>
    Math.max(...rows.map((row) => Bun.stringWidth(row[i] ?? '')))
  );
  const lines = rows.map((row) =>
    row
      .map((cell, i) => cell + ' '.repeat(widths[i] - Bun.stringWidth(cell)))
      .join('  ')
      .trimEnd()
  );
  const divider = `\x1b[2m${widths.map((w) => '─'.repeat(w)).join('  ')}\x1b[22m`;

  return [lines[0], divider, ...lines.slice(1)].join('\n') + '\n\n';
}

function renderPreview(body: string) {
  const output = Bun.markdown.render(body, {
    heading: (children, { level }) =>
      level <= 2
        ? `\x1b[1;4m${children}\x1b[0m\n\n`
        : `\x1b[1m${children}\x1b[22m\n\n`,
    paragraph: (children) => children + '\n\n',
    strong: (children) => `\x1b[1m${children}\x1b[22m`,
    codespan: (children) => `\x1b[36m${children}\x1b[39m`,
    list: (children) => children + '\n',
    listItem: (children) =>
      `• ${children
        .trim()
        .replace(/<sub>(.*?)<\/sub>/gs, '\x1b[2m$1\x1b[22m')
        .replace(/\n/g, '\n  ')}\n`,
    th: (children) => `\x1b[1m${children}\x1b[22m${CELL}`,
    td: (children) => children + CELL,
    tr: (children) => children + ROW,
    table: renderTable,
    hr: () => `\x1b[2m${'─'.repeat(40)}\x1b[22m\n\n`,
  });

  log.log(output.trimEnd());
}

function logPackages(releases: ChangesetStatus['releases']) {
  const nameWidth = Math.max(...releases.map(({ name }) => name.length));

  log.log('Packages:');
  releases.forEach(({ name, type, oldVersion, newVersion }) => {
    log.log(
      `  ${name.padEnd(nameWidth)}  ${oldVersion} → ${newVersion} (${type})`
    );
  });
}

async function rollback(branch: string) {
  try {
    await $`git switch -f ${BASE_BRANCH}`.quiet();
    await $`git branch -D ${branch}`.quiet();
    await $`git clean -fd`.quiet();
    log.info(
      `Rolled back: deleted local ${branch} and restored ${BASE_BRANCH}.`
    );
  } catch (err) {
    log.error(`Rollback failed: ${describeError(err)}`);
    log.info(
      `Restore manually: git switch -f ${BASE_BRANCH} && git branch -D ${branch} && git clean -fd`
    );
  }
}

async function createReleasePr({
  branch,
  title,
  prBody,
}: {
  branch: string;
  title: string;
  prBody: string;
}) {
  let branchCreated = false;
  let pushed = false;

  try {
    await $`git switch -c ${branch}`;
    branchCreated = true;

    await $`bun run changeset version`;
    await $`bun run sync:docsearch-version`;
    await $`bun install`;

    await $`git add -A`;
    await $`git commit -m ${title}`;
    await $`git push -u origin ${branch}`;
    pushed = true;

    const prUrl =
      await $`gh pr create --base ${BASE_BRANCH} --head ${branch} --title ${title} --body ${prBody}`.text();

    log.success(`Opened ${prUrl.trim()}`);
  } catch (err) {
    log.error(describeError(err));
    log.line();

    if (pushed) {
      log.info(
        `${branch} was pushed, so nothing was rolled back. Open the PR manually:`
      );
      log.log(
        `  gh pr create --base ${BASE_BRANCH} --head ${branch} --title "${title}" --fill`
      );
    } else if (branchCreated) {
      await rollback(branch);
    } else {
      log.info('No changes have been made.');
    }

    process.exit(1);
  }
}

async function run({ dryRun }: { dryRun: boolean }) {
  const report = dryRun ? (message: string) => log.warn(message) : fail;

  if (dryRun) {
    log.warn('DRY_RUN enabled - no actual changes will be made');
  }

  checkGithubCli(report);

  await assertReadyToVersion(report);

  const changesetStatus = await getChangesetStatus();

  if (changesetStatus.releases.length === 0) {
    fail('No pending changesets to version');
  }

  const releaseName = getReleaseName(changesetStatus.releases);
  const branch = `releases/${releaseName}`;
  const title = `chore(release): ${releaseName}`;
  const prBody = buildPrBody(releaseName, changesetStatus);

  await assertBranchAvailable(branch, report);

  log.line();
  log.log(`Branch: ${branch}`);
  log.log(`Title: ${title}`);
  log.line();

  if (dryRun) {
    renderPreview(prBody);
    return;
  }

  logPackages(changesetStatus.releases);
  log.line();

  // oxlint-disable-next-line no-alert - Bun has a built-in `confirm` method.
  if (!confirm(`Version packages and open a PR from ${branch}?`)) {
    log.line();
    log.info('Aborted, no changes have been made.');
    return;
  }

  await createReleasePr({ branch, title, prBody });
}

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    'dry-run': {
      type: 'boolean',
      short: 'd',
      default: false,
    },
  },
  strict: true,
});

run({ dryRun: values['dry-run'] }).catch((err) => fail(describeError(err)));
