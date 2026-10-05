---
"@docsearch/react": patch
---

Fix Ask AI resending the conversation after server-executed tool calls (search, memory), which Agent Studio rejected with "Conversation must end with a user message or resolved tool results". Automatic sends now only happen after client-executed tools (`onToolCall`) complete.
