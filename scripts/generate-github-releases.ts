// oxlint-disable no-console
import { resolve } from 'node:path';
import { exit } from 'node:process';
import { parseArgs } from 'util';

import { Octokit } from '@octokit/rest';
import { $, Glob } from 'bun';

const CHANGELOG_NAME = 'CHANGELOG.md';

const log = {
  colors: {
    reset: '\x1b[0m',
    info: Bun.color('oklch(86.5% 0.127 207.078)', 'ansi'),
    success: Bun.color('oklch(76.5% 0.177 163.223)', 'ansi'),
    warn: Bun.color('oklch(87.9% 0.169 91.605)', 'ansi'),
    error: Bun.color('oklch(71.2% 0.194 13.428)', 'ansi'),
    border: Bun.color('oklch(70.7% 0.022 261.325)', 'ansi'),
  },
  log(message: string) {
    process.stdout.write(`${message}\n`);
  },
  line() {
    this.log('');
  },
  info(message: string) {
    this.log(`${this.colors.info}• ${message}${this.colors.reset}`);
  },
  success(message: string) {
    this.log(`${this.colors.success} ${message}${this.colors.reset}`);
  },
  warn(message: string) {
    this.log(`${this.colors.warn}! ${message} !${this.colors.reset}`);
  },
  error(message: string) {
    this.log(`${this.colors.error} ${message}${this.colors.reset}`);
  },
  section(title: string) {
    this.log(
      `${log.colors.border}--------- ${title} -----------${log.colors.reset}`
    );
  },
};

async function getPublishVersion(wantedVersion: string | undefined) {
  if (wantedVersion && wantedVersion.trim().length > 0) {
    return wantedVersion;
  }

  const { version } = await import('../packages/docsearch-react/src/version');

  return version;
}

function getChangelogEntry(changelog: string, version: string) {
  let headingStartInfo: { index: number; depth: number } | undefined;
  let endIndex: number | undefined;

  // Iterate through each headings and code blocks (for skipping its contents)
  const regex = /^(#{1,6})\s(.*)$|^(`{3,})/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(changelog)) !== null) {
    // Skip over code blocks so we don't match any headings inside of them
    if (match[3]) {
      const endOfCodeBlockRegex = new RegExp(`^${match[3]}`, 'gm');
      endOfCodeBlockRegex.lastIndex = regex.lastIndex;
      const endMatch = endOfCodeBlockRegex.exec(changelog);
      if (endMatch) {
        // Start next search for headings after the end of the code block
        regex.lastIndex = endOfCodeBlockRegex.lastIndex;
        continue;
      } else {
        // Can't find end of code block, probably malformed
        break;
      }
    }

    const headingDepth = match[1].length;
    const headingText = match[2].trim();

    // Search for heading of the entry
    if (headingText === version) {
      headingStartInfo = { index: regex.lastIndex, depth: headingDepth };
      continue;
    }

    // If we've found the entry heading, search for the closing heading with the same depth
    if (headingStartInfo && headingDepth === headingStartInfo.depth) {
      endIndex = match.index;
      break;
    }
  }

  return changelog.slice(headingStartInfo?.index, endIndex).trim();
}

interface Pkg {
  tagName: string;
  path: string;
  packageJson: { version: string } & Record<string, any>;
}

async function getPkg(tag: string): Promise<Pkg | null> {
  const pkgJsonFiles = new Glob('{packages,adapters}/**/package.json');
  let pkg: Pkg | null = null;

  for await (const file of pkgJsonFiles.scan('.')) {
    const pkgJson = await Bun.file(file).json();

    if (tag.startsWith(`${pkgJson.name}@`)) {
      pkg = {
        tagName: tag,
        path: file.replace(/\package\.json$/, ''),
        packageJson: pkgJson,
      };

      break;
    }
  }

  return pkg;
}

// Push git tag
async function pushTag({
  tagName,
  dryRun,
}: {
  dryRun?: boolean;
  tagName: string;
}) {
  if (dryRun) {
    log.log(`[DRY_RUN] - Pushing tag ${tagName}`);
    return;
  }

  try {
    await $`git push origin ${tagName}`.quiet();
  } catch (e) {
    throw new Error(`Error pushing tag ${tagName}: ${e}`);
  }
}

// Create GH release
async function createRelease({
  dryRun,
  token,
  tagName,
  changelog,
  prerelease = false,
}: {
  dryRun?: boolean;
  token?: string;
  tagName: string;
  changelog: string;
  prerelease?: boolean;
}): Promise<void> {
  if (dryRun) {
    log.log(`[DRY_RUN] - Creating release for ${tagName}:`);
    log.log(`[DRY_RUN] - Prerelease: ${prerelease}`);
    log.line();
    return;
  }

  try {
    const octokit = new Octokit({ auth: token });

    await octokit.rest.repos.createRelease({
      owner: 'algolia',
      repo: 'docsearch',
      name: tagName,
      tag_name: tagName,
      body: changelog,
      prerelease,
      make_latest: prerelease ? 'false' : 'true',
    });
  } catch (e) {
    throw new Error(`Error creating release for ${tagName}: ${e}`);
  }
}

async function getTagsForVersion(version: string) {
  const { stdout } = await $`git tag --list '*${version}'`.quiet();
  const tags = stdout.toString().trim().split('\n').filter(Boolean);

  return tags;
}

async function getPackages(tags: string[]) {
  const pkgs: Pkg[] = [];

  for (const t of tags) {
    const pkg = await getPkg(t);

    if (!pkg) {
      continue;
    }

    pkgs.push(pkg);
  }

  return pkgs;
}

async function runFlow({
  dryRun,
  version: wantedVersion,
}: {
  dryRun?: boolean;
  version?: string;
}) {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!dryRun && (!githubToken || githubToken.trim() === '')) {
    log.error('A `GITHUB_TOKEN` is required');
    exit(1);
  }

  const publishVersion = await getPublishVersion(wantedVersion);
  const tags = await getTagsForVersion(publishVersion);

  if (tags.length === 0) {
    log.info(
      `No tags found to publish version v${wantedVersion} with, exiting`
    );
    exit(0);
  }

  const pkgs = await getPackages(tags);

  if (pkgs.length === 0) {
    log.info(`No packages found to create releases for, exiting`);
    exit(0);
  }

  log.line();
  log.log(`🚀 Generating package releases for v${publishVersion}`);
  log.line();

  const publishedPackages: string[] = [];

  for (const pkg of pkgs) {
    log.section(pkg.packageJson.name);
    log.info(`Creating release for: ${pkg.packageJson.name}`);

    if (dryRun) {
      log.warn('DRY_RUN enabled - no actual changes will be published');
    }

    if (!pkg.path) {
      log.error(`No path found for ${pkg.tagName}`);
      continue;
    }

    try {
      const changelog = await Bun.file(
        resolve(pkg.path, CHANGELOG_NAME)
      ).text();

      const changelogEntry = getChangelogEntry(
        changelog,
        publishVersion ? publishVersion : pkg.packageJson.version
      );

      await pushTag({ tagName: pkg.tagName, dryRun });

      await createRelease({
        dryRun,
        token: githubToken,
        tagName: pkg.tagName,
        changelog: changelogEntry,
        prerelease: pkg.packageJson.version.includes('-'),
      });

      publishedPackages.push(pkg.packageJson.name);
    } catch (e) {
      log.error(Error.isError(e) ? e.message : String(e));
    }
    log.line();
  }

  if (!dryRun) {
    log.line();
  }

  if (publishedPackages.length === 0) {
    log.error('Failed to generate releases on GitHub');
    exit(1);
  }

  log.success('GitHub releases generated for the following packages:');
  publishedPackages.forEach((pkg) => {
    log.log(`   -  ${pkg}`);
  });
}

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    dryRun: {
      type: 'boolean',
      short: 'd',
    },
    version: {
      type: 'string',
      short: 'v',
    },
  },
  strict: true,
  allowPositionals: true,
});

runFlow(values);
