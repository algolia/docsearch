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
# Run oxlint
bun run lint --format=agent

# Perform oxfmt formatting
bun run fmt

# Lint CSS
bun run lint:css
```

## E2E Testing (Playwright)

```bash
# Run all Playwright tests
bun run pw:run

# Run with specific browser
bun run pw:run:chromium
bun run pw:run:firefox
bun run pw:run:webkit
```

Only the `chromium` project is currently enabled in `playwright.config.ts`; `firefox` and `webkit` will not run until those projects are uncommented, even though their `pw:run:*` scripts exist.

Playwright auto-starts the Docusaurus site (`bun run website:test`) on `http://localhost:3000` and reuses an already-running server locally (not in CI). Tests hit the live Algolia index for the docs site, so outbound network access is required.

### Accessibility Tests (axe + Playwright)

- **When to run:** For changes to widget markup, styles, keyboard handling, focus management, or ARIA attributes. Add or extend coverage when introducing new interactive behavior.
- **Where tests live:**
  - `e2e/a11y.test.ts` - dedicated axe scans (modal smoke test, modal search results, sidepanel smoke test)
  - `e2e/fixtures.ts` - shared fixtures, page-ready helpers, and the `gatherA11yViolations` / `axe()` helper (WCAG 2.0/2.1/2.2 A & AA tags)
  - `e2e/search.spec.ts` - keyboard, focus, and ARIA state assertions (shortcuts, arrow navigation, `aria-activedescendant`, `aria-selected`)

```bash
# Install the Chromium browser binary (first run only)
bunx playwright install chromium

# Build workspace packages before running e2e
bun run build

# Run the dedicated accessibility scans
bun run pw:run e2e/a11y.test.ts --project=chromium

# Run accessibility scans plus keyboard/focus/ARIA regression tests
bun run pw:run e2e/a11y.test.ts e2e/search.spec.ts --project=chromium

# Run a single accessibility test by name
bun run pw:run e2e/a11y.test.ts --project=chromium --grep 'Modal Search results'
```

- **Test-authoring pattern:** Reuse the shared `axe()` fixture instead of instantiating `AxeBuilder` directly, wait for the target UI state (modal focused, sidepanel open, results rendered) before scanning, scope `.include()` to the relevant container, and attach `scanResults.violations` via `testInfo.attach` for debugging.
- **Interpreting results:** Existing tests assert a maximum violation-node count per scan (currently 6/24/4), not zero violations. `gatherA11yViolations` flattens `violations[].nodes`, so the count reflects affected elements, not unique rules. Passing means staying within the existing budget — it is not a full accessibility certification, and automated axe checks don't replace manual keyboard traversal and screen-reader verification. Don't raise a threshold or add `.exclude()`/`disableRules()` just to make a failing test pass; investigate the regression, fix it, and only adjust the budget with an explicit justification.

## Code Style Guidelines

### TypeScript

- Use `type` imports for type-only imports: `import type { Foo } from './types'`
- Prefer interfaces for object shapes, types for unions/primitives
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
- **CSS classes**: `DocSearch-` prefix

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

### Formatting (oxfmt)

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

- **To run/demo the widget, use the React playground:** `bun run playground:start` serves at `http://localhost:5173` (Vite). `bun run playground-js:start` serves the vanilla-JS demo. These connect to Algolia's hosted index using public credentials baked into the demo, so **outbound internet is required** for live search results.
- Run unit tests non-interactively with `bun run test --run` (plain `bun run test` starts Vitest watch mode).
- `bun run lint:css` reports many pre-existing CSS lint violations in the repo; these are not environment problems.

## Documentation

- When writing or working on the documentation website (`packages/website`), MUST adhere to the writing guidelines in @packages/website/WRITING_GUIDE.md
