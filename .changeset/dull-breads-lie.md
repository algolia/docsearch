---
"@docsearch/sidepanel-js": patch
"@docsearch/sidepanel": patch
"@docsearch/modal": patch
"@docsearch/react": patch
"@docsearch/core": patch
"@docsearch/js": patch
---

Fix a crash on Safari 14 when importing DocSearch bundles. Marked's lookbehind feature detection was being incorrectly optimized away by the build tool, causing it to always pick a regex pattern that Safari 14 can't parse. Upgraded tsdown/rolldown to pick up the upstream fix, and removed an unrelated lookbehind from the Ask AI link extractor for the same reason.
