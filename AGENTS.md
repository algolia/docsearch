# AGENTS.md - DocSearch Development Guide

This document provides guidelines for AI agents working on the DocSearch codebase.

## Project Overview

DocSearch is an Algolia-powered search widget for documentation sites. It's a TypeScript/React monorepo using Yarn workspaces with Lerna for orchestration.

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
yarn install

# Build all packages
yarn build

# Build specific package
yarn workspace @docsearch/react build

# Watch mode (all packages)
yarn watch

# Clean builds
yarn build:clean
```

## Test Commands

```bash
# Run all unit tests
yarn test

# Run a single test file
yarn test packages/docsearch-react/src/__tests__/utils.test.ts

# Run tests matching a pattern
yarn test --testNamePattern="extractLinksFromText"

# Run tests in watch mode
yarn test --watch

# Type checking
yarn test:types

# Bundle size check
yarn test:size
```

## Lint Commands

```bash
# Run ESLint
yarn lint

# Run CSS linting
yarn lint:css
```

## E2E Testing (Cypress)

```bash
# Run Cypress tests
yarn cy:run

# Run with specific browser
yarn cy:run:chrome
yarn cy:run:firefox
```

## Code Style Guidelines

### Imports

Imports must be ordered alphabetically with newlines between groups:

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
- Use `declare type` for exported type declarations
- Avoid `any`; use `unknown` when type is truly unknown

```typescript
// Good
export declare type DocSearchHit = {
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
