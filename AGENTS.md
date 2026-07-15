# AGENTS.md - DocSearch Development Guide

This document provides guidelines for AI agents working on the DocSearch codebase.

## Project Overview

DocSearch is an Algolia-powered search widget for documentation sites. It's a TypeScript/React monorepo using Bun workspaces.

### Packages

- `@docsearch/core` - Core logic and hooks
- `@docsearch/react` - React components
- `@docsearch/js` - Vanilla JavaScript wrapper
- `@docsearch/css` - Styles
- `@docsearch/modal` - Modal component
- `@docsearch/sidepanel` - Side panel React component
- `@docsearch/sidepanel-js` - Side panel vanilla JS wrapper
- `website` - Documentation site (Docusaurus)

## Build Commands

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Build specific package
bun run --filter @docsearch/react build

# Watch mode (all packages)
bun run watch
```

## Test Commands

```bash
# Run all unit tests
bun run test

# Run a single test file
bun run test --run packages/docsearch-react/src/__tests__/utils.test.ts

# Type checking
bun run test:types

# Bundle size check
bun run test:size
```

When running tests, prefer to run specific files with the `--run` flag to prevent running with watch mode.

## Lint Commands

```bash
# Run ESLint
bun run lint

# Run CSS linting
bun run lint:css
```

## E2E Testing (Playwright)

```bash
# Run Cypress tests
bun run pw:run

# Run with specific browser
bun run pw:run:chromium
bun run pw:run:firefox
bun run pw:run:webkit
```

## Code Style Guidelines

### Imports

Imported modules must be ordered alphabetically with newlines between groups:

1. Built-in modules
2. External dependencies
3. Parent directory imports
4. Sibling imports
5. Index imports

Internal `@/**/*` paths go before parent imports.

```typescript
// Correct order
import type { AutocompleteOptions } from '@algolia/autocomplete-core';
import React, { type JSX } from 'react';

import { DocSearchButton } from './DocSearchButton';
import type { DocSearchHit } from './types';
```

### TypeScript

- Use `type` imports for type-only imports: `import type { Foo } from './types'`
- Prefer interfaces for object shapes, types for unions/primitives
- Explicit return types on exported functions
- Avoid `any`; use `unknown` when type is truly unknown

```typescript
// Good
export type DocSearchHit = {
  objectID: string;
  content: string | null;
};

// Return type annotation
function createStorage<TItem>(key: string): StorageInterface<TItem> {
  // ...
}
```

### Naming Conventions

- **Components**: PascalCase (`DocSearchModal.tsx`)
- **Hooks**: camelCase with `use` prefix (`useDocSearchKeyboardEvents.ts`)
- **Utilities**: camelCase (`removeHighlightTags.ts`)
- **Types**: PascalCase (`InternalDocSearchHit`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_QUERY_SIZE`)
- **CSS classes**: `DocSearch-` prefix with PascalCase (`DocSearch-Modal`)

### React Components

- Use function components with explicit JSX return type
- Forward refs when needed using `React.forwardRef`
- Use `React.useCallback` for callbacks passed as props
- Use `React.useMemo` for expensive computations
- Prefer destructuring props in function signature

### React Component Structure

- `src/components/ui/` contains reusable rendering components.
- Prefer domain-light primitives in `src/components/ui/` when possible.
- Feature-scoped UI components may live in `src/components/ui/` when their feature scope is explicit in the filename, such as `RecentConversationsResults.tsx`.
- `src/components/` contains scoped composition components that own feature flow, branching, and state orchestration.
- Keep AI-specific behavior out of generic UI primitives. If a UI component is AI-specific, make that scope clear in its name.

```typescript
function DocSearchComponent(
  props: DocSearchProps,
  ref: React.ForwardedRef<DocSearchRef>
): JSX.Element {
  // ...
}

export const DocSearch = React.forwardRef(DocSearchComponent);
```

### Error Handling

- Use try-catch for async operations that may fail
- Check for specific error types when handling errors
- Fail silently for non-critical localStorage operations
- Throw descriptive errors for configuration issues

```typescript
try {
  window.localStorage.setItem(key, JSON.stringify(value));
} catch (error) {
  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    cleanupDocSearchStorage();
  }
  // Silently fail for other errors
}
```

### Formatting (Prettier)

- Single quotes for strings
- Trailing commas (ES5 style)
- No prose wrapping

### CSS (Stylelint)

- Selector pattern: `^DocSearch-[A-Za-z0-9-]*$`
- Max nesting depth: 2 (excluding pseudo-classes)
- Follow `stylelint-config-standard` and `stylelint-config-sass-guidelines`

## Commit Conventions

Follow conventional changelog format:

```
type(scope): description
```

Types: `fix`, `feat`, `refactor`, `docs`, `chore`

Examples:

- `fix(modal): increase default height`
- `feat(searchbox): add type input property`
- `chore(deps): update dependency rollup-plugin-babel to v3.0.7`

## Testing Patterns

Tests use Vitest with Testing Library:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, act, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

describe('ComponentName', () => {
  it('describes expected behavior', () => {
    // Arrange
    render(<Component />);

    // Act
    fireEvent.click(screen.getByText('Button'));

    // Assert
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

## File Structure

```
packages/
  docsearch-react/
    src/
      components/         # Scoped React composition components
        ui/               # Reusable rendering components and explicitly scoped UI pieces
      __tests__/          # Test files
      icons/              # Icon components
      types/              # Type definitions
      utils/              # Utility functions
      Sidepanel/          # Sidepanel subcomponents
      DocSearch.tsx       # Main component
      index.ts            # Public exports
```

## Key Dependencies

- `@algolia/autocomplete-core` - Autocomplete engine
- `algoliasearch` - Algolia search client
- `ai` / `@ai-sdk/react` - AI/streaming support
- `marked` - Markdown rendering
- `rollup` - Build bundling
- `vitest` - Test runner

## Cursor Cloud specific instructions

Toolchain is pinned in `.tool-versions`: Node `24.13.1` (managed via `fnm`) and Bun `1.3.10`. These are preinstalled in the Cloud VM and available on `PATH` in new shells; the startup update script only runs `bun install`.

Non-obvious caveats:

- The **Docusaurus website does not run under Bun on this branch**. Both `bun run website:build` and the dev server (`bun run website:start` / `website:test`) fail at plugin load with `ERR_PACKAGE_PATH_NOT_EXPORTED` (e.g. `entities/lib/decode.js`, from `docusaurus` → `cheerio`/`htmlparser2`) because of how Bun hoists transitive deps. Consequently, **`bun run build` (which ends with `website:build`) and Playwright E2E (`bun run pw:*`, which boots the website first) cannot complete as-is.** Build the libraries only with: `bun run --sequential build:stage:base build:stage:react build:stage:consumers build:stage:adapter`.
- **To run/demo the widget, use the React playground:** `bun run playground:start` serves at `http://localhost:5173` (Vite). `bun run playground-js:start` serves the vanilla-JS demo. These connect to Algolia's hosted index using public credentials baked into the demo, so **outbound internet is required** for live search results.
- Run unit tests non-interactively with `bun run test --run` (plain `bun run test` starts Vitest watch mode).
- `bun run lint:css` reports many pre-existing CSS lint violations in the repo; these are not environment problems.
