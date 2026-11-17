---
"@docsearch/docusaurus-adapter": patch
---

Fix transparent modal and unreadable dark mode colors in the Docusaurus adapter. Surfaces now use Infima's surface color, selected rows, keys and menus follow the theme, and secondary text meets contrast requirements in light mode. Core DocSearch CSS is now imported first so adapter overrides apply. Menu and popover variables can be overridden on `.DocSearch`.
