import useBaseUrl from '@docusaurus/useBaseUrl';
import { Code2 } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useCallback, useState } from 'react';

import { track } from '@site/src/lib/segment';

const ENDPOINT = 'https://mcp.algolia.com/1/docsearch/mcp';

const CLI_SETUP_PREFIX = 'npx @docsearch/cli setup';

// Clients with a matching `docsearch setup` agent flag (see packages/docsearch-cli).
const CLI_SUPPORTED_CLIENTS = new Set(['cursor', 'claude', 'codex', 'opencode']);

// Base64 of {"url":"https://mcp.algolia.com/1/docsearch/mcp"} for the Cursor install link.
const CURSOR_DEEPLINK =
  'https://cursor.com/en-US/install-mcp?name=algolia-docsearch&config=eyJ1cmwiOiJodHRwczovL21jcC5hbGdvbGlhLmNvbS8xL2RvY3NlYXJjaC9tY3AifQ%3D%3D';

const SPRING = { type: 'spring', stiffness: 800, damping: 38, mass: 0.35 };

const CLIENTS = [
  {
    id: 'cursor',
    name: 'Cursor',
    blurb: 'Plugin · 1-click · manual',
    logo: 'cursor.svg',
    logoDark: 'cursor_dark.svg',
    plugin: [
      { kind: 'installButton', href: CURSOR_DEEPLINK, label: 'Install in Cursor' },
      { kind: 'text', content: 'Install the Cursor plugin package from the DocSearch repository:' },
      { kind: 'code', caption: 'Plugin package', code: 'mcp/plugins/docsearch/cursor/algolia-docsearch' },
      {
        kind: 'text',
        content:
          'It ships the MCP server, a rule, and a skill that teach Cursor when and how to call the DocSearch tools.',
      },
    ],
    manual: [
      { kind: 'installButton', href: CURSOR_DEEPLINK, label: 'Install in Cursor' },
      { kind: 'text', content: 'Or add it to ~/.cursor/mcp.json (global) or .cursor/mcp.json (project):' },
      {
        kind: 'code',
        caption: '~/.cursor/mcp.json',
        code: `{
  "mcpServers": {
    "algolia-docsearch": {
      "url": "${ENDPOINT}"
    }
  }
}`,
      },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    blurb: 'Code & Desktop',
    logo: 'claude.svg',
    plugin: [
      { kind: 'subhead', content: 'Claude Code' },
      { kind: 'text', content: 'Add the marketplace and install the plugin from inside Claude Code:' },
      {
        kind: 'code',
        caption: 'In Claude Code',
        code: `/plugin marketplace add algolia/docsearch
/plugin install algolia-docsearch@algolia-docsearch-marketplace`,
      },
      {
        kind: 'text',
        content:
          'The plugin adds the MCP server, a skill, and the /algolia-docsearch:docs command. Plugins are a Claude Code feature — Claude Desktop connects via a custom connector (see Manual).',
      },
    ],
    manual: [
      { kind: 'subhead', content: 'Claude Code' },
      { kind: 'text', content: 'Add the remote server with the Claude Code CLI:' },
      {
        kind: 'code',
        caption: 'Terminal',
        code: `claude mcp add --scope user --transport http algolia-docsearch ${ENDPOINT}`,
      },
      { kind: 'subhead', content: 'Claude Desktop' },
      {
        kind: 'steps',
        items: ['Open Settings → Connectors.', 'Click Add custom connector.', 'Enter the name and URL, then save.'],
      },
      {
        kind: 'code',
        caption: 'Connector',
        code: `Name: Algolia DocSearch
URL: ${ENDPOINT}`,
      },
    ],
  },
  {
    id: 'codex',
    name: 'Codex',
    blurb: 'CLI · config.toml',
    logo: 'codex.svg',
    logoDark: 'codex_dark.svg',
    manual: [
      { kind: 'text', content: 'Add the remote MCP server with the Codex CLI:' },
      {
        kind: 'code',
        caption: 'Terminal',
        code: `codex mcp add algolia-docsearch --url ${ENDPOINT}`,
      },
      {
        kind: 'text',
        content: 'Or add the same URL under [mcp_servers.algolia-docsearch] in ~/.codex/config.toml.',
      },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    blurb: 'Custom connector',
    logo: 'chatgpt.svg',
    logoDark: 'chatgpt_dark.svg',
    manual: [
      {
        kind: 'steps',
        items: [
          'Open Settings -> Connectors.',
          'Enable Developer Mode if your workspace requires it.',
          'Create a custom connector named Algolia DocSearch.',
          'Paste the MCP endpoint shown above as the server URL and choose No Auth.',
        ],
      },
      { kind: 'note', content: 'Custom connector availability depends on your ChatGPT plan and workspace settings.' },
    ],
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    blurb: 'Remote MCP',
    logo: 'opencode.svg',
    logoDark: 'opencode_dark.svg',
    manual: [
      { kind: 'text', content: 'Add a remote MCP entry to your OpenCode config:' },
      {
        kind: 'code',
        caption: 'opencode.json',
        code: `{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "algolia-docsearch": {
      "type": "remote",
      "url": "${ENDPOINT}",
      "enabled": true
    }
  }
}`,
      },
    ],
  },
  {
    id: 'pi',
    name: 'Pi',
    blurb: 'Extension required',
    logo: 'pi.svg',
    manual: [
      {
        kind: 'text',
        content:
          'Pi does not include MCP support by default. Install an MCP extension or adapter first, then add the DocSearch server:',
      },
      {
        kind: 'code',
        caption: 'Terminal',
        code: 'pi install npm:pi-mcp-adapter',
      },
      {
        kind: 'code',
        caption: '.mcp.json',
        code: `{
  "mcpServers": {
    "algolia-docsearch": {
      "url": "${ENDPOINT}"
    }
  }
}`,
      },
    ],
  },
  {
    id: 'vscode',
    name: 'VS Code',
    blurb: 'Copilot agent',
    logo: 'vscode.svg',
    manual: [
      {
        kind: 'text',
        content:
          'Add a remote server in .vscode/mcp.json (workspace) or your user config. VS Code uses the servers key.',
      },
      {
        kind: 'code',
        caption: '.vscode/mcp.json',
        code: `{
  "servers": {
    "algolia-docsearch": {
      "type": "http",
      "url": "${ENDPOINT}"
    }
  }
}`,
      },
      { kind: 'note', content: 'DocSearch tools become available in Copilot Chat agent mode.' },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    blurb: 'Cascade',
    logo: 'windsurf.svg',
    logoDark: 'windsurf_dark.svg',
    manual: [
      {
        kind: 'text',
        content: 'Edit ~/.codeium/windsurf/mcp_config.json. Windsurf uses serverUrl for remote servers.',
      },
      {
        kind: 'code',
        caption: 'mcp_config.json',
        code: `{
  "mcpServers": {
    "algolia-docsearch": {
      "serverUrl": "${ENDPOINT}"
    }
  }
}`,
      },
      { kind: 'note', content: 'Restart Windsurf after saving.' },
    ],
  },
  {
    id: 'zed',
    name: 'Zed',
    blurb: 'Context server',
    logo: 'zed.svg',
    logoDark: 'zed_dark.svg',
    manual: [
      { kind: 'text', content: 'Add a context server in settings.json. Zed uses the context_servers key.' },
      {
        kind: 'code',
        caption: 'settings.json',
        code: `{
  "context_servers": {
    "algolia-docsearch": {
      "url": "${ENDPOINT}"
    }
  }
}`,
      },
    ],
  },
  {
    id: 'conductor',
    name: 'Conductor',
    blurb: 'Agent host config',
    logo: 'conductor.svg',
    logoDark: 'conductor_dark.svg',
    manual: [
      {
        kind: 'text',
        content:
          'Conductor loads MCP servers from the selected agent host. Configure DocSearch in Claude Code, Codex, or Cursor, then start a Conductor session with that host.',
      },
      {
        kind: 'note',
        content:
          'There is no separate Conductor MCP config for normal Claude Code, Codex, or Cursor Composer sessions.',
      },
    ],
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    blurb: 'Google agent',
    logo: 'antigravity.svg',
    manual: [
      { kind: 'text', content: 'Open Manage MCP Servers -> View raw config, then add:' },
      {
        kind: 'code',
        caption: '~/.gemini/config/mcp_config.json',
        code: `{
  "mcpServers": {
    "algolia-docsearch": {
      "serverUrl": "${ENDPOINT}"
    }
  }
}`,
      },
      { kind: 'note', content: 'Save and refresh the Installed MCP Servers list.' },
    ],
  },
  {
    id: 'other',
    name: 'Other clients',
    blurb: 'Any MCP host',
    icon: 'code',
    manual: [
      {
        kind: 'text',
        content: 'Most clients that support remote HTTP MCP servers accept this shape. Keep the name and URL:',
      },
      {
        kind: 'code',
        caption: 'MCP config',
        code: `{
  "mcpServers": {
    "algolia-docsearch": {
      "type": "http",
      "url": "${ENDPOINT}"
    }
  }
}`,
      },
      {
        kind: 'note',
        content:
          'If your client uses a different key (servers, context_servers) or field (serverUrl), follow its MCP docs.',
      },
    ],
  },
];

function CopyButton({ value, onCopied, className = '' }) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(value).then(() => {
      onCopied?.();
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [value, onCopied]);

  return (
    <motion.button
      type="button"
      aria-label="Copy to clipboard"
      whileTap={{ scale: 0.9 }}
      transition={SPRING}
      className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium ring-1 transition-colors ${
        copied
          ? 'bg-blue-600 text-white ring-blue-600'
          : 'bg-white/80 text-neutral-600 ring-neutral-300 hover:bg-white dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-600 dark:hover:bg-neutral-700'
      } ${className}`}
      onClick={onCopy}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'copied' : 'copy'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.08 }}
          className="inline-block"
        >
          {copied ? 'Copied' : 'Copy'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function CodeCard({ caption, code, onCopied }) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-neutral-200 dark:ring-neutral-700">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800/60">
        <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{caption}</span>
        <CopyButton value={code} onCopied={onCopied} />
      </div>
      <pre className="m-0 overflow-x-auto bg-neutral-900 p-4 text-[13px] leading-relaxed text-neutral-100">
        <code className="bg-transparent! p-0! text-inherit!">{code}</code>
      </pre>
    </div>
  );
}

function CursorInstallButton({ href, label, onClick }) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING}
      className="inline-flex w-fit no-underline!"
    >
      <img
        src="https://cursor.com/deeplink/mcp-install-dark.svg"
        alt={label}
        height="32"
        className="block dark:hidden"
      />
      <img
        src="https://cursor.com/deeplink/mcp-install-light.svg"
        alt={label}
        height="32"
        className="hidden dark:block"
      />
    </motion.a>
  );
}

function getBlockKey(block) {
  switch (block.kind) {
    case 'code':
      return `${block.kind}-${block.caption}`;
    case 'text':
    case 'note':
    case 'subhead':
      return `${block.kind}-${block.content}`;
    case 'installButton':
    case 'button':
      return `${block.kind}-${block.label}-${block.href}`;
    case 'steps':
      return `${block.kind}-${block.items.join('|')}`;
    default:
      return block.kind;
  }
}

function Block({ block, client, mode }) {
  switch (block.kind) {
    case 'subhead':
      return (
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs font-semibold tracking-wide text-neutral-700 uppercase dark:text-neutral-200">
            {block.content}
          </span>
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        </div>
      );
    case 'text':
      return <p className="my-0 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{block.content}</p>;
    case 'note':
      return (
        <p className="my-0 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900 ring-1 ring-blue-100 dark:bg-blue-950/40 dark:text-blue-200 dark:ring-blue-900/60">
          {block.content}
        </p>
      );
    case 'code':
      return (
        <CodeCard
          caption={block.caption}
          code={block.code}
          onCopied={() => track('Install Config Copied', { client, mode, caption: block.caption })}
        />
      );
    case 'steps':
      return (
        <ol className="my-0 flex list-none flex-col gap-2 pl-0">
          {block.items.map((item, idx) => (
            <li key={item} className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
                {idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'button':
      return (
        <motion.a
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={SPRING}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white! no-underline! transition-colors hover:bg-blue-700"
        >
          {block.label}
        </motion.a>
      );
    case 'installButton':
      return (
        <CursorInstallButton
          href={block.href}
          label={block.label}
          onClick={() => track('Install Button Clicked', { client, mode })}
        />
      );
    default:
      return null;
  }
}

function CliQuickInstall({ client, reduce }) {
  const flag = ` --${client.id}`;
  const command = `${CLI_SETUP_PREFIX}${flag}`;

  return (
    <div className="border-t border-neutral-200 px-6 py-5 dark:border-neutral-700">
      <div className="mb-2.5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <span className="text-xs font-semibold tracking-wide text-neutral-700 uppercase dark:text-neutral-200">
          One-command install
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={client.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="text-xs text-neutral-400 dark:text-neutral-500"
          >
            {`Adds the server, rules, and skills to ${client.name}`}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl bg-neutral-900 py-2.5 pr-2.5 pl-4 ring-1 ring-neutral-800 dark:ring-neutral-700">
        <pre className="m-0 flex-1 overflow-x-auto bg-transparent! p-0! font-mono text-[13px] leading-relaxed">
          <code className="bg-transparent! p-0! text-neutral-100">
            <span aria-hidden={true} className="select-none text-blue-400">
              ${' '}
            </span>
            {CLI_SETUP_PREFIX}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={client.id}
                initial={{ opacity: 0, y: reduce ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                transition={{ duration: 0.1 }}
                className="inline-block whitespace-pre"
              >
                {flag}
              </motion.span>
            </AnimatePresence>
          </code>
        </pre>
        <CopyButton
          value={command}
          onCopied={() => track('Install Command Copied', { client: client.id, command })}
        />
      </div>
    </div>
  );
}

function ClientLogo({ client, size = 'h-7 w-7' }) {
  const single = useBaseUrl(`/img/mcp-clients/${client.icon ?? client.logo}`);
  const dark = useBaseUrl(`/img/mcp-clients/${client.logoDark ?? client.logo}`);
  const hasDark = Boolean(client.logoDark);

  if (client.icon === 'code') {
    return (
      <span
        className={`${size} flex items-center justify-center rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200`}
      >
        <Code2 aria-label={`${client.name} icon`} className="h-[70%] w-[70%]" />
      </span>
    );
  }

  if (!hasDark) {
    return <img src={single} alt={`${client.name} logo`} className={`${size} object-contain`} />;
  }

  return (
    <>
      <img src={single} alt={`${client.name} logo`} className={`${size} object-contain block dark:hidden`} />
      <img aria-hidden={true} src={dark} alt="" className={`${size} object-contain hidden dark:block`} />
    </>
  );
}

export default function MCPInstall() {
  const [selectedId, setSelectedId] = useState(CLIENTS[0].id);
  const [mode, setMode] = useState('plugin');
  const reduce = useReducedMotion();

  const selected = CLIENTS.find((client) => client.id === selectedId) ?? CLIENTS[0];
  const hasPlugin = Array.isArray(selected.plugin);
  const activeMode = hasPlugin ? mode : 'manual';
  const blocks = activeMode === 'plugin' ? selected.plugin : selected.manual;

  const rise = reduce ? 0 : 10;
  const cardRise = reduce ? 0 : 8;

  function selectClient(id) {
    setSelectedId(id);
    setMode('plugin');
  }

  return (
    <motion.div
      id="tailwind"
      className="not-prose my-8 font-[Inter]"
      initial={{ opacity: 0, y: rise }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className="overflow-hidden rounded-2xl ring-1 ring-neutral-200 dark:ring-neutral-700">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-neutral-200 bg-gradient-to-b from-blue-50 to-white px-6 py-5 dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-[Sora] !mb-0 text-xl font-semibold whitespace-nowrap text-neutral-900 dark:text-white">
                Connect DocSearch MCP
              </p>
              <p className="my-0 text-sm text-neutral-500 dark:text-neutral-400">
                Pick your client to get the install steps
              </p>
            </div>
          </div>
        </div>

        {/* Client picker */}
        <motion.div
          className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.018, delayChildren: 0.02 } } }}
        >
          {CLIENTS.map((client) => {
            const isActive = client.id === selectedId;
            return (
              <motion.button
                key={client.id}
                type="button"
                variants={{ hidden: { opacity: 0, y: cardRise }, show: { opacity: 1, y: 0 } }}
                whileHover={reduce ? undefined : { y: -3 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING}
                className="group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl px-3 py-4 text-center ring-1 ring-neutral-200 transition-colors hover:ring-neutral-300 dark:ring-neutral-700 dark:hover:ring-neutral-600"
                onClick={() => selectClient(client.id)}
              >
                {isActive && (
                  <motion.span
                    layoutId="mcp-active-card"
                    className="absolute inset-0 rounded-xl bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-950/40"
                    transition={SPRING}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-2">
                  <ClientLogo client={client} />
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-100">{client.name}</span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Fastest path: one CLI command, flag follows the selected client */}
        <AnimatePresence initial={false}>
          {CLI_SUPPORTED_CLIENTS.has(selected.id) && (
            <motion.div
              key="cli-quick-install"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <CliQuickInstall client={selected} reduce={reduce} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail panel */}
        <div className="border-t border-neutral-200 px-6 py-5 dark:border-neutral-700">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, x: reduce ? 0 : -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduce ? 0 : 6 }}
                transition={{ duration: 0.1 }}
                className="flex items-center gap-3"
              >
                <ClientLogo client={selected} size="h-6 w-6" />
                <span className="font-[Sora] text-sm font-semibold text-neutral-900 dark:text-white">
                  {selected.name}
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">{selected.blurb}</span>
              </motion.div>
            </AnimatePresence>

            {hasPlugin && (
              <div className="inline-flex rounded-lg bg-neutral-100 p-1 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
                {['plugin', 'manual'].map((value) => {
                  const isActive = activeMode === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`relative cursor-pointer rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                        isActive
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                      }`}
                      onClick={() => setMode(value)}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mcp-mode-pill"
                          className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-neutral-900"
                          transition={SPRING}
                        />
                      )}
                      <span className="relative z-10">{value}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedId}-${activeMode}`}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: { opacity: 0, y: reduce ? 0 : 6 },
                show: { opacity: 1, y: 0, transition: { duration: 0.13, staggerChildren: 0.02 } },
                exit: { opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.08 } },
              }}
              className="flex flex-col gap-3"
            >
              {blocks.map((block) => (
                <motion.div
                  key={`${selectedId}-${activeMode}-${getBlockKey(block)}`}
                  variants={{ hidden: { opacity: 0, y: reduce ? 0 : 4 }, show: { opacity: 1, y: 0 } }}
                >
                  <Block block={block} client={selectedId} mode={activeMode} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
