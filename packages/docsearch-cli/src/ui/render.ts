/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import { CLI_NAME, CLI_VERSION } from '../constants.js';
import type { SetupResult } from '../setup/setup.js';

import { color, shade, symbols } from './theme.js';

function logoArc(lead: number, length: number): string {
  return `${' '.repeat(lead)}${':'.repeat(length)}`;
}

function logoBar(fill: number, gap: number, length: number): string {
  return `  ${'@'.repeat(fill)}${' '.repeat(gap)}${':'.repeat(length)}`;
}

const LOGO: string[] = [
  ':'.repeat(33),
  logoArc(32, 9),
  logoArc(37, 6),
  logoBar(21, 18, 4),
  logoArc(43, 5),
  logoArc(45, 4),
  logoBar(26, 19, 3),
  logoArc(48, 3),
  logoArc(49, 3),
  logoBar(29, 18, 4),
  logoArc(50, 3),
  logoArc(51, 3),
  logoBar(30, 19, 3),
  logoArc(51, 3),
  logoArc(51, 3),
  logoBar(30, 19, 3),
  logoArc(51, 3),
  logoArc(50, 3),
  logoBar(29, 18, 4),
  logoArc(49, 3),
  logoArc(48, 3),
  logoBar(26, 18, 4),
  logoArc(45, 4),
  logoArc(43, 4),
  logoBar(21, 18, 4),
  logoArc(37, 6),
  logoArc(31, 9),
  `  ${':'.repeat(32)}`,
];

const LOGO_TOP_LEVEL = 0.95;
const LOGO_BOTTOM_LEVEL = 0.34;

export function renderLogo(): string {
  const span = Math.max(1, LOGO.length - 1);
  const rows = LOGO.map((line, index) => {
    const level = LOGO_TOP_LEVEL - (index / span) * (LOGO_TOP_LEVEL - LOGO_BOTTOM_LEVEL);
    return shade(level)(line);
  });

  return `\n${rows.join('\n')}\n`;
}

export function renderBanner(): string {
  const title = color.bold(color.cyan('DocSearch'));
  const subtitle = color.dim('search public docs & set up the DocSearch MCP');

  return `\n${color.magenta(symbols.diamond)} ${title} ${color.dim(`v${CLI_VERSION}`)}\n  ${subtitle}\n`;
}

interface LandingCommand {
  args?: string;
  description: string;
  name: string;
}

const LANDING_COMMANDS: LandingCommand[] = [
  { description: 'Configure the DocSearch MCP for your AI agents', name: 'setup' },
  { args: '<library> <query>', description: "One-shot search across a library's docs", name: 'docs' },
  { args: '<library>', description: 'Find matching docsets for a product', name: 'resolve' },
  {
    args: '<docset-id[,docset-id...]> <query>',
    description: 'Search inside specific docsets',
    name: 'query',
  },
];

export function renderLanding(): string {
  const prefix = `${CLI_NAME} `;
  const plainLefts = LANDING_COMMANDS.map(
    (command) => `  $ ${prefix}${command.name}${command.args ? ` ${command.args}` : ''}`,
  );
  const column = Math.max(...plainLefts.map((left) => left.length)) + 3;

  const commandLines = LANDING_COMMANDS.map((command, index) => {
    const styledLeft = `  ${color.dim('$')} ${color.dim(prefix.trim())} ${color.green(command.name)}${
      command.args ? ` ${color.cyan(command.args)}` : ''
    }`;
    const padding = ' '.repeat(Math.max(2, column - plainLefts[index].length));
    return `${styledLeft}${padding}${command.description}`;
  });

  return [
    renderLogo(),
    color.dim('  The open documentation search for AI agents'),
    '',
    ...commandLines,
    '',
    `  ${color.dim('try:')} ${color.bold(`${CLI_NAME} docs Next.js`)} ${color.dim('"how do middleware matchers work"')}`,
    '',
    `  ${color.dim('Docs & MCP setup at')} ${color.underline(color.blue('https://docsearch.algolia.com/mcp'))}`,
    '',
  ].join('\n');
}

export function renderHelp(): string {
  const heading = (text: string): string => color.bold(color.yellow(text));
  const cmd = (text: string): string => color.green(text);
  const meta = (text: string): string => color.dim(text);

  return [
    renderBanner(),
    heading('Usage'),
    `  ${color.bold(CLI_NAME)} ${color.cyan('<command>')} ${meta('[options]')}`,
    '',
    heading('Commands'),
    `  ${cmd('setup')}                         Configure the DocSearch MCP for your AI agents`,
    `  ${cmd('docs')}    ${color.cyan('<library> <query>')}     One-shot search across a library's docs`,
    `  ${cmd('resolve')} ${color.cyan('<library>')}             Find matching docsets for a product`,
    `  ${cmd('query')}   ${color.cyan('<docset-id[,docset-id...]> <query>')}   Search inside specific docsets`,
    '',
    heading('Setup options'),
    `  ${color.green('--project')}                     Install at the detected repository root`,
    `  ${color.green('--global')}                      Install into user-level agent settings`,
    `  ${color.green('--all')}                         Configure every supported agent`,
    `  ${color.green('--cursor')}, ${color.green('--claude')}            Configure Cursor or Claude Code`,
    `  ${color.green('--codex')}, ${color.green('--opencode')}           Configure Codex or OpenCode`,
    `  ${color.green('--gemini')}                      Configure Gemini CLI`,
    `  ${color.green('--yes')}, ${color.green('-y')}                    Run setup non-interactively ${meta('(project + detected agents)')}`,
    '',
    heading('Query options'),
    `  ${color.green('--max-results')} ${color.cyan('<n>')}             Limit documentation results`,
    `  ${color.green('--max-docsets')} ${color.cyan('<n>')}            Limit docsets searched by ${cmd('docs')}`,
    `  ${color.green('--top-n')} ${color.cyan('<n>')}                   Limit docsets returned by ${cmd('resolve')}`,
    `  ${color.green('--json')}                        Print raw MCP results as JSON`,
    '',
    heading('Global options'),
    `  ${color.green('--endpoint')} ${color.cyan('<url>')}             Override the hosted DocSearch MCP endpoint`,
    `  ${color.green('--help')}, ${color.green('-h')}                   Show help`,
    '',
    heading('Examples'),
    `  ${meta('$')} ${CLI_NAME} setup`,
    `  ${meta('$')} ${CLI_NAME} setup ${color.green('--cursor --claude --project')}`,
    `  ${meta('$')} ${CLI_NAME} docs Next.js ${color.dim('"how do middleware matchers work"')}`,
    `  ${meta('$')} ${CLI_NAME} resolve ${color.dim('"Algolia InstantSearch React"')}`,
    `  ${meta('$')} ${CLI_NAME} query nextjs ${color.dim('"middleware matcher config"')} --json`,
    '',
  ].join('\n');
}

export function renderResultHeader(command: string, subject: string): string {
  return `\n${color.magenta(symbols.diamond)} ${color.bold(color.cyan(command))} ${color.dim(symbols.arrow)} ${color.bold(subject)}\n`;
}

export function renderError(message: string): string {
  return `${color.red(symbols.cross)} ${color.red(message)}\n`;
}

export function renderNotice(message: string): string {
  return `${color.yellow(symbols.info)} ${message}\n`;
}

export interface SetupSummaryMeta {
  endpoint: string;
  location?: string;
  scope: string;
}

export function renderSetupResults(results: SetupResult[], meta: SetupSummaryMeta): string {
  if (results.length === 0) {
    return renderNotice('No agents selected. Nothing was configured.');
  }

  const label = results.length === 1 ? 'agent' : 'agents';
  const lines: string[] = [
    `\n${color.green(symbols.tick)} ${color.bold(`Configured DocSearch MCP for ${results.length} ${label}`)}`,
    `  ${color.dim('scope')}    ${meta.scope}`,
    ...(meta.location ? [`  ${color.dim('root')}     ${meta.location}`] : []),
    `  ${color.dim('endpoint')} ${color.underline(meta.endpoint)}`,
    '',
  ];

  for (const result of results) {
    lines.push(`${color.magenta(symbols.diamond)} ${color.bold(result.agent)}`);
    lines.push(renderStep('MCP server', result.mcpStatus, result.mcpPath));
    lines.push(renderStep('Rule', result.ruleStatus, result.rulePath));
    lines.push(renderStep('Skill', result.skillStatus, result.skillPath));
    lines.push('');
  }

  lines.push(color.dim(`Restart your agent to load the new configuration.`));

  return `${lines.join('\n')}\n`;
}

function renderStep(name: string, status: string, path: string): string {
  const badge = status === 'updated' ? color.yellow(status) : color.green(status);
  return `  ${color.green(symbols.tick)} ${name} ${color.dim(symbols.bullet)} ${badge}\n    ${color.dim(path)}`;
}
