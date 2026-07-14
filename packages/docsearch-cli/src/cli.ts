/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import {
  buildSetupRequest,
  buildToolRequest,
  parseArgs,
  type QueryCommandName,
  type SetupRequest,
} from './commands.js';
import { CLI_VERSION } from './constants.js';
import { UsageError } from './errors.js';
import { callDocSearchTool } from './mcp/client.js';
import { formatToolResult, getToolResultText } from './mcp/format.js';
import type { SetupAgent, SetupScope } from './setup/agents.js';
import { PromptCancelledError, promptAgents, promptScope } from './setup/prompt.js';
import { buildAgentChoices, createPathContext, detectAgents, findProjectRoot, setupDocSearch } from './setup/setup.js';
import { renderMarkdown } from './ui/markdown.js';
import {
  renderError,
  renderHelp,
  renderLanding,
  renderNotice,
  renderResultHeader,
  renderSetupResults,
} from './ui/render.js';
import { startSpinner } from './ui/spinner.js';

export async function runCli(argv: string[] = process.argv.slice(2)): Promise<number> {
  const [commandName, ...commandArgs] = argv;

  try {
    if (!commandName) {
      process.stdout.write(renderLanding());
      return 0;
    }

    if (commandName === 'help' || commandName === '--help' || commandName === '-h') {
      process.stdout.write(renderHelp());
      return 0;
    }

    if (commandName === 'version' || commandName === '--version' || commandName === '-v') {
      process.stdout.write(`${CLI_VERSION}\n`);
      return 0;
    }

    const parsedArgs = parseArgs(commandArgs);
    if (parsedArgs.options['--help'] || parsedArgs.options['-h']) {
      process.stdout.write(renderHelp());
      return 0;
    }

    if (commandName === 'setup') {
      return await runSetup(buildSetupRequest(parsedArgs));
    }

    if (isQueryCommand(commandName)) {
      return await runQuery(commandName, parsedArgs);
    }

    throw new UsageError(`Unknown command: ${commandName}.`);
  } catch (error) {
    if (error instanceof PromptCancelledError) {
      process.stderr.write(renderNotice('Setup cancelled. No changes were made.'));
      return error.exitCode;
    }

    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(renderError(message));
    if (error instanceof UsageError) {
      process.stderr.write(renderHelp());
    }
    return error instanceof UsageError ? 2 : 1;
  }
}

async function runSetup(request: SetupRequest): Promise<number> {
  const baseContext = createPathContext();
  const scope = await resolveScope(request);
  const cwd = scope === 'project' ? await findProjectRoot(baseContext.cwd, baseContext.homeDir) : baseContext.cwd;
  const context = { ...baseContext, cwd };
  const agents = await resolveSetupAgents(request, context, scope);

  if (agents.length === 0) {
    process.stdout.write(renderNotice('No agents selected. Re-run `docsearch setup` and pick at least one agent.'));
    return 0;
  }

  const results = await setupDocSearch({
    agents,
    cwd: context.cwd,
    endpoint: request.endpoint,
    env: context.env,
    homeDir: context.homeDir,
    scope,
  });

  process.stdout.write(
    renderSetupResults(results, {
      endpoint: request.endpoint,
      location: scope === 'project' ? context.cwd : undefined,
      scope,
    }),
  );
  return 0;
}

function resolveScope(request: SetupRequest): Promise<SetupScope> {
  if (request.scope) {
    return Promise.resolve(request.scope);
  }

  if (request.yes) {
    return Promise.resolve('project');
  }

  return promptScope();
}

async function resolveSetupAgents(
  request: SetupRequest,
  context: ReturnType<typeof createPathContext>,
  scope: SetupScope,
): Promise<SetupAgent[]> {
  if (request.all) {
    return buildAgentChoices(context, []).map((choice) => choice.name);
  }

  if (request.agents.length > 0) {
    return request.agents;
  }

  const detected = await detectAgents(scope, context);
  if (request.yes) {
    if (detected.length === 0) {
      throw new UsageError('No supported agents were detected. Pass an agent flag such as --cursor, or use --all.');
    }
    return detected;
  }

  return promptAgents(buildAgentChoices(context, detected));
}

async function runQuery(commandName: QueryCommandName, parsedArgs: ReturnType<typeof parseArgs>): Promise<number> {
  const request = buildToolRequest(commandName, parsedArgs);
  const subject = describeQuery(commandName, parsedArgs.positionals);

  if (request.json) {
    const result = await callDocSearchTool(request);
    process.stdout.write(formatToolResult(result, true));
    return result.isError === true ? 1 : 0;
  }

  const spinner = startSpinner(`Searching ${subject}…`);
  try {
    const result = await callDocSearchTool(request);
    if (result.isError === true) {
      throw new Error(getToolResultText(result) || 'DocSearch MCP returned an error.');
    }
    spinner.succeed(`Results for ${subject}`);
    process.stdout.write(renderResultHeader(commandName, subject));
    process.stdout.write(renderMarkdown(formatToolResult(result, false)));
    return 0;
  } catch (error) {
    spinner.fail(`Search failed for ${subject}`);
    throw error;
  }
}

function describeQuery(commandName: QueryCommandName, positionals: string[]): string {
  if (commandName === 'docs') {
    const [library] = positionals;
    return library ?? 'docs';
  }

  return positionals.join(' ').trim() || commandName;
}

function isQueryCommand(commandName: string): commandName is QueryCommandName {
  return commandName === 'docs' || commandName === 'resolve' || commandName === 'query';
}
