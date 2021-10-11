---
title: Styling
---

:::info

The following content is for **[DocSearch v3][2]**. If you are using **[DocSearch v2][3]**, see the **[legacy][4]** documentation.

:::

:::caution

This documentation is in progress.

:::

## Introduction

DocSearch v3 comes with a theme package called `@docsearch/css`, which offers a sleek out of the box theme!

:::note

You don't need to install this package if you already have [`@docsearch/js`][1] or [`@docsearch/react`][1] installed!

:::

## Installation

```bash
yarn add @docsearch/css@alpha
# or
npm install @docsearch/css@alpha
```

If you don’t want to use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@docsearch/css@alpha"></script>
```

## Files

```
@docsearch/css
├── dist/style.css # all styles
├── dist/_variables.css # CSS variables
├── dist/button.css # CSS for the button
└── dist/modal.css # CSS for the modal
```

[1]: DocSearch-v3
[2]: https://github.com/algolia/docsearch/
[3]: https://github.com/algolia/docsearch/tree/master
[4]: /docs/legacy/dropdown
