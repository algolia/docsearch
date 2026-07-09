/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import { join } from 'node:path';

import { DOCSEARCH_MCP_SERVER_NAME } from '../constants.js';

export type SetupAgent = 'claude' | 'codex' | 'cursor' | 'gemini' | 'opencode';
export type SetupScope = 'global' | 'project';

export interface PathContext {
  cwd: string;
  env: NodeJS.ProcessEnv;
  homeDir: string;
}

export interface AgentConfig {
  detect: {
    globalPaths: string[];
    projectPaths: string[];
  };
  displayName: string;
  mcp: {
    configKey: string;
    globalPaths: string[];
    projectPaths: string[];
    buildEntry: (endpoint: string) => Record<string, unknown>;
  };
  name: SetupAgent;
  rule:
    | {
        dir: (scope: SetupScope) => string;
        filename: string;
        kind: 'file';
      }
    | {
        file: (scope: SetupScope) => string;
        kind: 'append';
      };
  skill: {
    dir: (scope: SetupScope) => string;
    name: string;
  };
}

export const ALL_AGENT_NAMES: SetupAgent[] = ['claude', 'cursor', 'codex', 'opencode', 'gemini'];

export function getAgent(name: SetupAgent, context: PathContext): AgentConfig {
  return agents(context)[name];
}

export function getAllAgents(context: PathContext): Record<SetupAgent, AgentConfig> {
  return agents(context);
}

function agents(context: PathContext): Record<SetupAgent, AgentConfig> {
  const claudeConfigDirectory = context.env.CLAUDE_CONFIG_DIR ?? join(context.homeDir, '.claude');
  const claudeGlobalMcpPath = context.env.CLAUDE_CONFIG_DIR
    ? join(claudeConfigDirectory, '.claude.json')
    : join(context.homeDir, '.claude.json');

  return {
    claude: {
      name: 'claude',
      displayName: 'Claude Code',
      mcp: {
        projectPaths: [join(context.cwd, '.mcp.json')],
        globalPaths: [claudeGlobalMcpPath],
        configKey: 'mcpServers',
        buildEntry: (endpoint) => ({ type: 'http', url: endpoint }),
      },
      rule: {
        kind: 'file',
        dir: (scope) =>
          scope === 'global' ? join(claudeConfigDirectory, 'rules') : join(context.cwd, '.claude', 'rules'),
        filename: `${DOCSEARCH_MCP_SERVER_NAME}.md`,
      },
      skill: {
        name: DOCSEARCH_MCP_SERVER_NAME,
        dir: (scope) =>
          scope === 'global' ? join(claudeConfigDirectory, 'skills') : join(context.cwd, '.claude', 'skills'),
      },
      detect: {
        projectPaths: [join(context.cwd, '.mcp.json'), join(context.cwd, '.claude')],
        globalPaths: [claudeConfigDirectory, claudeGlobalMcpPath],
      },
    },
    cursor: {
      name: 'cursor',
      displayName: 'Cursor',
      mcp: {
        projectPaths: [join(context.cwd, '.cursor', 'mcp.json')],
        globalPaths: [join(context.homeDir, '.cursor', 'mcp.json')],
        configKey: 'mcpServers',
        buildEntry: (endpoint) => ({ url: endpoint }),
      },
      rule: {
        kind: 'file',
        dir: (scope) =>
          scope === 'global' ? join(context.homeDir, '.cursor', 'rules') : join(context.cwd, '.cursor', 'rules'),
        filename: `${DOCSEARCH_MCP_SERVER_NAME}.mdc`,
      },
      skill: {
        name: DOCSEARCH_MCP_SERVER_NAME,
        dir: (scope) =>
          scope === 'global' ? join(context.homeDir, '.cursor', 'skills') : join(context.cwd, '.cursor', 'skills'),
      },
      detect: {
        projectPaths: [join(context.cwd, '.cursor')],
        globalPaths: [join(context.homeDir, '.cursor')],
      },
    },
    codex: {
      name: 'codex',
      displayName: 'Codex',
      mcp: {
        projectPaths: [join(context.cwd, '.codex', 'config.toml')],
        globalPaths: [join(context.homeDir, '.codex', 'config.toml')],
        configKey: 'mcp_servers',
        buildEntry: (endpoint) => ({ type: 'http', url: endpoint }),
      },
      rule: {
        kind: 'append',
        file: (scope) =>
          scope === 'global' ? join(context.homeDir, '.codex', 'AGENTS.md') : join(context.cwd, 'AGENTS.md'),
      },
      skill: {
        name: DOCSEARCH_MCP_SERVER_NAME,
        dir: (scope) =>
          scope === 'global' ? join(context.homeDir, '.agents', 'skills') : join(context.cwd, '.agents', 'skills'),
      },
      detect: {
        projectPaths: [join(context.cwd, '.codex')],
        globalPaths: [join(context.homeDir, '.codex')],
      },
    },
    opencode: {
      name: 'opencode',
      displayName: 'OpenCode',
      mcp: {
        projectPaths: [
          join(context.cwd, 'opencode.json'),
          join(context.cwd, 'opencode.jsonc'),
          join(context.cwd, '.opencode.json'),
          join(context.cwd, '.opencode.jsonc'),
        ],
        globalPaths: [
          join(context.homeDir, '.config', 'opencode', 'opencode.json'),
          join(context.homeDir, '.config', 'opencode', 'opencode.jsonc'),
          join(context.homeDir, '.config', 'opencode', '.opencode.json'),
          join(context.homeDir, '.config', 'opencode', '.opencode.jsonc'),
        ],
        configKey: 'mcp',
        buildEntry: (endpoint) => ({ type: 'remote', url: endpoint, enabled: true }),
      },
      rule: {
        kind: 'append',
        file: (scope) =>
          scope === 'global'
            ? join(context.homeDir, '.config', 'opencode', 'AGENTS.md')
            : join(context.cwd, 'AGENTS.md'),
      },
      skill: {
        name: DOCSEARCH_MCP_SERVER_NAME,
        dir: (scope) =>
          scope === 'global' ? join(context.homeDir, '.agents', 'skills') : join(context.cwd, '.agents', 'skills'),
      },
      detect: {
        projectPaths: [
          join(context.cwd, 'opencode.json'),
          join(context.cwd, 'opencode.jsonc'),
          join(context.cwd, '.opencode.json'),
          join(context.cwd, '.opencode.jsonc'),
        ],
        globalPaths: [join(context.homeDir, '.config', 'opencode')],
      },
    },
    gemini: {
      name: 'gemini',
      displayName: 'Gemini CLI',
      mcp: {
        projectPaths: [join(context.cwd, '.gemini', 'settings.json')],
        globalPaths: [join(context.homeDir, '.gemini', 'settings.json')],
        configKey: 'mcpServers',
        buildEntry: (endpoint) => ({ httpUrl: endpoint }),
      },
      rule: {
        kind: 'append',
        file: (scope) =>
          scope === 'global' ? join(context.homeDir, '.gemini', 'GEMINI.md') : join(context.cwd, 'GEMINI.md'),
      },
      skill: {
        name: DOCSEARCH_MCP_SERVER_NAME,
        dir: (scope) =>
          scope === 'global' ? join(context.homeDir, '.gemini', 'skills') : join(context.cwd, '.gemini', 'skills'),
      },
      detect: {
        projectPaths: [join(context.cwd, '.gemini')],
        globalPaths: [join(context.homeDir, '.gemini')],
      },
    },
  };
}
