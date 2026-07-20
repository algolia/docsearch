# Style guide

## Core principles

- Help users succeed with Algolia.
- Docs must stay correct, clear, complete, current.
- Missing rule: use [Google developer docs style guide](https://developers.google.com/style). API refs: use [API docs style guide](https://api-clients-automation.netlify.app/docs/add-a-new-api/api-documentation-guidelines).
- Write simple, consistent, concise. Explain what users need. No extra.
- ALWAYS lean on using standardized markdown templating.

## Voice and tone

- Write like teaching new teammate. Then cut fluff.
- Use contractions, short sentences, short paragraphs, imperative mood, active voice.
- Focus user goals, not feature internals.
- Give guidance + best practices. Samples should feel production-ready.
- No sarcasm, humor, emojis, double negatives, idioms, `easy`, `simply`, `quick`.
- Write accessible, global, inclusive docs.

## Version references

- When referencing installing a `v5` package, MUST use the caret (`^`) based versioning: `@^5.0.0-beta`
- When displaying install commands, ONLY include `@docsearch/*` packages, there's no need to include any other packages unless specified

## Pages

- Every page MUST have a title
- Every page MUST have a concise description describing at a high level the information that is on the page
- If you are about to explain a concept or property that is better explained on a different page, prefer to link to that current section on the other page instead

## Tabs

- Use Docusaurus theme `<Tabs />` and `<TabItem />` components when writing the following:
  - Code snippets: One tab for React/TSX based snippet, one tab for vanilla JS snippet
    - vanilla js -> label: 'JavaScript', value: 'js'
    - react -> label: 'React', value: 'react'
  - Install commands (npm/yarn/pnpm/bun) with each package manager being it's own tab
- Always give each tab a title
- "React" tab MUST always be the first one listed

**EXAMPLE**:

```tsx
<Tabs groupId="language" defaultValue="js">
  <TabItem value="js" label="JavaScript"></TabItem>
  <TabItem value="react" label="React"></TabItem>
</Tabs>
```

## Links

- Prefer to use shared links on pages

**EXAMPLE**:

```mdx
This is a test [Website][1]

[1]: https://example.com
```

## API References

- API reference pages should focus on detailing out the specification for the related package/domain
- If explaining exports/imports of a package, those definitions MUST appear at the bottom of the page
  - exports/imports here are the rare occassion where tables ARE THE PREFERRED DISPLAY TYPE
- Property definition as defined below is preferred over tables

**EXAMPLE PROPERTY DEFINITION**:

## `PROPERTY_NAME`

> `type <-- THIS IS A LITERAL STRING THAT SHOULD ALWAYS BE HERE: TYPE_PRIMITIVE|ROUGH_TYPE_DEFINITION_FROM_SOURCE` | **required** | **optional** | **experimental**

CONCISE DESCRIPTION OF THE PROPERTY

The different tags (required/optional/experimental) are optional on their own, but MUST be used correctly

## Tables

- AVOID tables as much as possible
- IF a table is required, or absolutely the best option for display, it MUST be contained to a MAX of 3 columns

## Package names

- When referencing @docsearch/sidepanel package, the component MUST be named `Sidepanel` (capital 'S')

## Code blocks

- A Codeblock should prefer to have a title to it, ideally a realtively similar filename (app.tsx, Search.tsx, load-docsearch.js)
