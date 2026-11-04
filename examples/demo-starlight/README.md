# DocSearch v5 Starlight Demo

Demo of `@docsearch/starlight-adapter` with DocSearch v5 keyword search and Starlight's theme. This demo uses ordinary page loads; the adapter also supports Astro client-side navigation. AI support is not included yet.

See the [adapter guide](../../adapters/docsearch-starlight/README.md) for configuration and supported options.

## Local Setup

Use Node.js **24.13.1** and Bun **1.3.10**, as pinned in the repository's `.tool-versions`. Run all commands below from the **DocSearch repository root**:

```sh
bun install
bun run build:stage:base
bun run build:stage:react
bun run build:stage:consumers
bun run build:pkg:starlight-adapter
bun run playground-starlight:start
```

Open the URL printed by the server, normally <http://localhost:4321>.

The demo already includes public search-only credentials in [astro.config.mjs](./astro.config.mjs). The hosted DocSearch index returns its own documents, not local demo pages, so result links may leave the demo. To use another index, change `appId`, `apiKey`, and `indices` in the `docsearch({...})` call.

Click the header search button or press `Cmd+K` / `Ctrl+K`, then try searching for `installation`. Escape closes the modal.

## Adapter Development

While the demo is running, watch adapter changes in a second terminal:

```sh
bun run watch:pkg:starlight-adapter
```

The watcher rebuilds the adapter, including its packaged Astro component. Restart the demo development server after plugin configuration changes.

Check both the library and Astro component:

```sh
bun --filter @docsearch/starlight-adapter typecheck
bun --filter @docsearch/starlight-adapter typecheck:astro
```

## Production Preview

Stop development before building and previewing:

```sh
bun run build:pkg:starlight-adapter
bun run playground-starlight:build
bun run playground-starlight:preview
```

Open the URL printed by preview. Repeat the build steps after adapter changes: watch mode alone does not rebuild the production site.

For foreground servers, stop with `Ctrl+C`. If using Astro's detached-server mode, run the corresponding stop command:

```sh
bun run --cwd examples/demo-starlight astro dev stop
bun run --cwd examples/demo-starlight astro preview stop
```
