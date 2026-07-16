/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import {
  DEFAULT_MCP_ENDPOINT,
  TOOL_QUERY_DOCS,
  TOOL_RESOLVE_DOCSET,
  TOOL_SEARCH_DOCS,
} from './constants.js';
import { UsageError } from './errors.js';
import type { SetupAgent, SetupScope } from './setup/agents.js';

export type QueryCommandName = 'docs' | 'query' | 'resolve';
export type CommandName = QueryCommandName | 'help' | 'setup' | 'version';

export interface ParsedArgs {
  options: Record<string, boolean | string>;
  positionals: string[];
}

export interface ToolRequest {
  endpoint: string;
  json: boolean;
  toolName: string;
  toolArguments: Record<string, unknown>;
}

export interface SetupRequest {
  all: boolean;
  agents: SetupAgent[];
  endpoint: string;
  scope?: SetupScope;
  yes: boolean;
}

const AGENT_FLAGS: Record<string, SetupAgent> = {
  '--claude': 'claude',
  '--codex': 'codex',
  '--cursor': 'cursor',
  '--gemini': 'gemini',
  '--opencode': 'opencode',
};

const BOOLEAN_OPTIONS = new Set([
  '--all',
  '--claude',
  '--codex',
  '--cursor',
  '--gemini',
  '--global',
  '--help',
  '--json',
  '--opencode',
  '--project',
  '--yes',
  '-h',
  '-y',
]);

const VALUE_OPTIONS = new Set([
  '--endpoint',
  '--max-docsets',
  '--max-results',
  '--top-n',
]);
const HELP_OPTIONS = new Set(['--help', '-h']);
const QUERY_COMMON_OPTIONS = new Set(['--endpoint', '--help', '--json', '-h']);
const SETUP_OPTIONS = new Set([
  '--all',
  '--claude',
  '--codex',
  '--cursor',
  '--endpoint',
  '--gemini',
  '--global',
  '--help',
  '--opencode',
  '--project',
  '--yes',
  '-h',
  '-y',
]);

export function parseArgs(argv: string[]): ParsedArgs {
  const options: Record<string, boolean | string> = {};
  const positionals: string[] = [];

  for (let idx = 0; idx < argv.length; idx++) {
    const token = argv[idx];
    const equalsIdx = token.startsWith('--') ? token.indexOf('=') : -1;
    const option = equalsIdx > 0 ? token.slice(0, equalsIdx) : token;
    const inlineValue = equalsIdx > 0 ? token.slice(equalsIdx + 1) : undefined;

    if (VALUE_OPTIONS.has(option)) {
      const value = inlineValue ?? argv[idx + 1];
      if (!value || value.startsWith('-')) {
        throw new UsageError(`Missing value for ${option}.`);
      }
      options[option] = value;
      if (inlineValue === undefined) {
        idx++;
      }
    } else if (BOOLEAN_OPTIONS.has(option)) {
      if (inlineValue !== undefined) {
        throw new UsageError(`${option} does not accept a value.`);
      }
      options[option] = true;
    } else if (option.startsWith('-')) {
      throw new UsageError(`Unknown option: ${option}.`);
    } else {
      positionals.push(token);
    }
  }

  return { options, positionals };
}

export function buildToolRequest(
  commandName: QueryCommandName,
  args: ParsedArgs
): ToolRequest {
  validateToolOptions(commandName, args.options);
  const endpoint = readEndpoint(args.options);
  const json = Boolean(args.options['--json']);
  const maxResults = readNumberOption(args.options, '--max-results');

  switch (commandName) {
    case 'docs': {
      const [library, ...queryParts] = args.positionals;
      const query = queryParts.join(' ').trim();
      if (!library || !query) {
        throw new UsageError(
          'Usage: docsearch docs <library> <query> [--json]'
        );
      }

      return {
        endpoint,
        json,
        toolName: TOOL_SEARCH_DOCS,
        toolArguments: removeUndefined({
          library,
          query,
          maxResults,
          maxDocsets: readNumberOption(args.options, '--max-docsets'),
        }),
      };
    }

    case 'resolve': {
      const query = args.positionals.join(' ').trim();
      if (!query) {
        throw new UsageError(
          'Usage: docsearch resolve <library-or-product> [--json]'
        );
      }

      return {
        endpoint,
        json,
        toolName: TOOL_RESOLVE_DOCSET,
        toolArguments: removeUndefined({
          query,
          topN: readNumberOption(args.options, '--top-n'),
        }),
      };
    }

    case 'query': {
      const [docsetId, ...queryParts] = args.positionals;
      const query = queryParts.join(' ').trim();
      if (!docsetId || !query) {
        throw new UsageError(
          'Usage: docsearch query <docset-id[,docset-id...]> <query> [--json]'
        );
      }

      const docsetIds = docsetId
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      if (docsetIds.length === 0) {
        throw new UsageError('At least one non-empty docset ID is required.');
      }

      return {
        endpoint,
        json,
        toolName: TOOL_QUERY_DOCS,
        toolArguments: removeUndefined({
          docsetIds,
          query,
          maxResults,
        }),
      };
    }

    default: {
      const exhaustive: never = commandName;
      return exhaustive;
    }
  }
}

export function buildSetupRequest(args: ParsedArgs): SetupRequest {
  validateOptions(args.options, SETUP_OPTIONS, 'setup');
  if (args.positionals.length > 0) {
    throw new UsageError(`Unexpected setup argument: ${args.positionals[0]}.`);
  }

  const agents = Object.entries(AGENT_FLAGS)
    .filter(([flag]) => Boolean(args.options[flag]))
    .map(([, agent]) => agent);

  if (args.options['--project'] && args.options['--global']) {
    throw new UsageError('Use either --project or --global, not both.');
  }

  return {
    agents: uniqueAgents(agents),
    all: Boolean(args.options['--all']),
    endpoint: readEndpoint(args.options),
    scope: resolveScopeFlag(args.options),
    yes: Boolean(args.options['--yes'] || args.options['-y']),
  };
}

function resolveScopeFlag(
  options: Record<string, boolean | string>
): SetupScope | undefined {
  if (options['--project']) {
    return 'project';
  }

  if (options['--global']) {
    return 'global';
  }

  return undefined;
}

function readStringOption(
  options: Record<string, boolean | string>,
  key: string
): string | undefined {
  const value = options[key];
  return typeof value === 'string' ? value : undefined;
}

function readEndpoint(options: Record<string, boolean | string>): string {
  const value = readStringOption(options, '--endpoint') ?? DEFAULT_MCP_ENDPOINT;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new UsageError(`--endpoint must be a valid HTTP(S) URL.`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new UsageError(`--endpoint must use HTTP or HTTPS.`);
  }
  return url.toString();
}

function readNumberOption(
  options: Record<string, boolean | string>,
  key: string
): number | undefined {
  const value = readStringOption(options, key);
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new UsageError(`${key} must be a positive integer.`);
  }

  return parsed;
}

function removeUndefined(
  values: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined)
  );
}

function uniqueAgents(agents: SetupAgent[]): SetupAgent[] {
  return [...new Set(agents)];
}

function validateToolOptions(
  commandName: QueryCommandName,
  options: Record<string, boolean | string>
): void {
  const allowed = new Set(QUERY_COMMON_OPTIONS);
  if (commandName === 'docs') {
    allowed.add('--max-docsets');
    allowed.add('--max-results');
  } else if (commandName === 'resolve') {
    allowed.add('--top-n');
  } else {
    allowed.add('--max-results');
  }
  validateOptions(options, allowed, commandName);
}

function validateOptions(
  options: Record<string, boolean | string>,
  allowed: ReadonlySet<string>,
  commandName: string
): void {
  for (const option of Object.keys(options)) {
    if (!allowed.has(option) && !HELP_OPTIONS.has(option)) {
      throw new UsageError(
        `${option} is not valid for the ${commandName} command.`
      );
    }
  }
}
