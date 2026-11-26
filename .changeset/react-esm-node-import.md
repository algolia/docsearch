---
"@docsearch/react": patch
---

Bundle `@algolia/autocomplete-core` into the ESM build so `@docsearch/react` can be imported in Node.js and Vite SSR again. Its `main` entry is a UMD file, which Node can't named-import from.
