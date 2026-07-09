# DocSearch CLI

Install the hosted [DocSearch MCP](https://docsearch.algolia.com/mcp) in your AI coding agents and search public developer documentation from the terminal.

## Run without installing

```sh
npx @docsearch/cli
```

Or install the `docsearch` command globally:

```sh
npm install --global @docsearch/cli
```

Requires Node.js 20 or later.

## Set up the DocSearch MCP

Run the interactive installer:

```sh
docsearch setup
```

The installer asks whether to configure the current project or your global agent settings, then lets you select any detected agents. It supports:

- Cursor
- Claude Code
- Codex
- OpenCode
- Gemini CLI

Skip the prompts with explicit flags:

```sh
docsearch setup --project --cursor --claude --yes
docsearch setup --global --all --yes
```

Project setup locates the repository root before writing configuration. Re-running setup is idempotent and preserves unrelated configuration.

## Search documentation

Use `docs` for most questions:

```sh
docsearch docs Next.js "how do middleware matchers work"
```

For explicit docset selection, resolve a product and then query its docset:

```sh
docsearch resolve "Algolia InstantSearch React"
docsearch query repo/algolia/instantsearch "configure the React search client"
```

Limit the returned results when needed:

```sh
docsearch docs Next.js "cache revalidation" --max-results 3 --max-docsets 2
docsearch resolve Next.js --top-n 3
```

Pass `--json` to write the raw MCP result as JSON:

```sh
docsearch docs Next.js "cache revalidation" --json
```

Machine-readable results are written to stdout. Progress and errors are written to stderr.

## Options

```text
--project             Install into the current repository
--global              Install into user-level agent settings
--all                 Configure every supported agent
--cursor              Configure Cursor
--claude              Configure Claude Code
--codex               Configure Codex
--opencode            Configure OpenCode
--gemini              Configure Gemini CLI
--yes, -y             Run setup non-interactively
--endpoint <url>      Override the hosted DocSearch MCP endpoint
--json                Print raw MCP results as JSON
```

Set [`NO_COLOR`](https://no-color.org/) to disable terminal colors.

## Development

From the DocSearch monorepo root:

```sh
bun install
bun run --filter @docsearch/cli build
bun run --filter @docsearch/cli test
```

## License

[MIT](https://github.com/algolia/docsearch/blob/v5/LICENSE)
