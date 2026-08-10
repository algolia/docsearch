// oxlint-disable no-console
import { resolve } from 'node:path';
import { exit } from 'node:process';

import { Octokit } from '@octokit/rest';
import { $, Glob } from 'bun';

const CHANGELOG_NAME = 'CHANGELOG.md';
const RELEASE_NOTES_NAME = 'RELEASE_NOTES.md';

const DRY_RUN = true;
const PUBLISH_VERSION = process.env.PUBLISH_VERSION;

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

async function getPublishVersion() {
  if (PUBLISH_VERSION && PUBLISH_VERSION.trim().length > 0) {
    return PUBLISH_VERSION;
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
async function pushTag(tagName: string) {
  if (DRY_RUN) {
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
  token,
  tagName,
  changelog,
  prerelease = false,
}: {
  token?: string;
  tagName: string;
  changelog: string;
  prerelease?: boolean;
}): Promise<void> {
  if (DRY_RUN) {
    log.log(`[DRY_RUN] - Creating release for ${tagName}:`);
    log.log(`             - Prerelease: ${prerelease}`);
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

async function runFlow() {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!DRY_RUN && (!githubToken || githubToken.trim() === '')) {
    log.error('A `GITHUB_TOKEN` is required');
    exit(1);
  }

  const version = await getPublishVersion();
  const tags = await getTagsForVersion(version);

  if (tags.length === 0) {
    log.info(`No tags found to publish version v${version} with, exiting`);
    exit(0);
  }

  const pkgs = await getPackages(tags);

  if (pkgs.length === 0) {
    log.info(`No packages found to create releases for, exiting`);
    exit(0);
  }

  log.line();
  log.log(`🚀 Generating package releases for v${version}`);
  log.line();

  const publishedPackages: string[] = [];

  for (const pkg of pkgs) {
    log.section(pkg.packageJson.name);
    log.info(`Creating release for: ${pkg.packageJson.name}`);

    if (DRY_RUN) {
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
        PUBLISH_VERSION ? PUBLISH_VERSION : pkg.packageJson.version
      );

      await Bun.write(resolve(pkg.path, RELEASE_NOTES_NAME), changelogEntry);

      // await pushTag(pkg.tagName);

      // await createRelease({
      //   token: githubToken,
      //   tagName: pkg.tagName,
      //   changelog: changelogEntry,
      //   prerelease: pkg.packageJson.version.includes('-'),
      // });

      publishedPackages.push(pkg.packageJson.name);
    } catch (e) {
      log.error(Error.isError(e) ? e.message : String(e));
    }
    log.line();
  }

  if (!DRY_RUN) {
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

runFlow();
