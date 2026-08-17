---
"@docsearch/react": patch
---

Fix Ask AI conversations breaking after stopping a stream mid-tool-call. Incomplete tool parts (`input-streaming`/`input-available`) are now pruned before resending, so the dangling `tool_use` no longer causes the provider to reject every subsequent question.
