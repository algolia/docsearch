# DocSearch v5 Starlight Demo

Local demo of the workspace package `@docsearch/starlight-adapter`. The current baseline replaces Starlight's Pagefind search with DocSearch v5 keyword search, with responsive header styling and localized button labels. 

TODO: AI support and Astro client-navigation lifecycle handling are not implemented yet.

## Local Setup

Use Node.js **24.13.1** and Bun **1.3.10**, as pinned in the repository's `.tool-versions`. Run all commands below from the **DocSearch repository root**:

```sh
bun install
bun run build:stage:base
bun run build:stage:react
bun run build:stage:consumers
bun run build:pkg:starlight-adapter
bun run playground-starlight:build
bun run playground-starlight:preview
```

Optional adapter checks:

```sh
bun --filter @docsearch/starlight-adapter typecheck
bun --filter @docsearch/starlight-adapter typecheck:astro
```

Open the URL printed by preview, normally <http://localhost:4321>. 

The demo already includes public search-only credentials in [astro.config.mjs](./astro.config.mjs). It queries the hosted DocSearch index, so result links may leave the demo. To use another index, change `appId`, `apiKey`, and `indices` in the `docsearch({...})` call.

Click the header search button or press `Cmd+K` / `Ctrl+K`, then try searching for `installation`. Escape closes the modal.

This is a work-in-progress integration. Use ordinary full-page navigation for now; client-side navigation cleanup/remounting, optional AI, automated adapter tests, and release validation are follow-up work.

## References

### Starlight

- [Getting started](https://starlight.astro.build/getting-started/): demo scaffolding.
- [Plugin API](https://starlight.astro.build/reference/plugins/): `config:setup`, `addIntegration`, and configuration updates.
- [Search component override](https://starlight.astro.build/reference/overrides/#search): replacing the header search component.
- [Site search](https://starlight.astro.build/guides/site-search/): Pagefind and alternative search integrations.
- [Official DocSearch plugin entry point](https://github.com/withastro/starlight/blob/main/packages/docsearch/src/index.ts): plugin registration, virtual configuration, and override conflict handling.
- [Official DocSearch component](https://github.com/withastro/starlight/blob/main/packages/docsearch/src/DocSearch.astro): Astro component structure, header styling, and localized labels.
- [Official plugin configuration schema](https://github.com/withastro/starlight/blob/main/packages/docsearch/src/config.ts): reference for future runtime validation, not implemented yet.
- [Official plugin package exports](https://github.com/withastro/starlight/blob/main/packages/docsearch/package.json): exporting the Astro component.

### Astro

- [Astro integration setup hook](https://docs.astro.build/en/reference/integrations-reference/#astroconfigsetup): registering the Vite plugin.
- [Astro browser scripts](https://docs.astro.build/en/guides/client-side-scripts/#script-processing): processed scripts and browser imports.
- [Astro ambient declarations](https://docs.astro.build/en/guides/typescript/#using-imports): typing the virtual configuration module.
- [Astro type checking](https://docs.astro.build/en/guides/typescript/#type-checking): checking Astro components separately from library compilation.
