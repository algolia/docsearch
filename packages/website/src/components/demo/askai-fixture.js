// Ask AI mock for the homepage auto-demo.
//
// The autopilot runs against the real DocSearch widget, but we don't want to
// fire a real Agent Studio completion for every homepage visitor. So while the
// autopilot is driving, we intercept the completions request and replay a
// canned Server-Sent-Events stream in the exact `ai-sdk-5` UI-message-stream
// wire format the widget expects (verified against a real capture).
//
// The instant a real user takes over (`isAutopilotActive()` returns false),
// requests fall through to the untouched `window.fetch`, so their questions hit
// the real assistant.

// Matches the Agent Studio completions endpoint used by `getAgentStudioTransport`
// in `@docsearch/react` (`.../agent-studio/1/agents/<id>/completions`).
const COMPLETIONS_RE = /\/agent-studio\/1\/agents\/[^/]+\/completions/;

// Canned answers. We pick one based on the user's question so the demo reads as
// if the assistant actually understood the prompt.
const ANSWERS = [
  {
    match: /instal|setup|set up|add|start|docusaurus|react|vanilla/i,
    markdown: `To add DocSearch to your documentation site, pick the integration that matches your stack:

### React

\`\`\`bash
npm install @docsearch/react@4 @docsearch/css@4
\`\`\`

\`\`\`jsx
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';

<DocSearch appId="YOUR_APP_ID" indexName="YOUR_INDEX" apiKey="YOUR_SEARCH_KEY" />
\`\`\`

### Docusaurus (recommended)

\`\`\`bash
npm install @docsearch/docusaurus-adapter
\`\`\`

\`\`\`js
// docusaurus.config.js
plugins: ['@docsearch/docusaurus-adapter'],
themeConfig: {
  docsearch: {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_SEARCH_KEY',
    indexName: 'YOUR_INDEX',
  },
},
\`\`\`

That's it — the widget wires up \`Cmd\`+\`K\`, search-as-you-type, and Ask AI automatically. See the [Getting started guide](https://docsearch.algolia.com/docs/docsearch/) for the full walkthrough.`,
    suggestions: [
      'How do I get DocSearch API credentials?',
      'Can DocSearch work with static sites?',
      'How do I enable Ask AI?',
    ],
  },
  {
    match: /.*/,
    markdown: `DocSearch pairs Algolia's search engine with an **Ask AI** assistant that answers questions in natural language, grounded in your own documentation.

- **Instant search** — millisecond, typo-tolerant results as you type.
- **Ask AI** — conversational answers with citations back to your docs.
- **Side panel** — keep the conversation open next to the page you're reading.

It's **free for open-source and technical docs**. You can [apply here](https://docsearch.algolia.com/docs/docsearch-program/) or wire it up yourself with your Algolia credentials.`,
    suggestions: [
      'How much does DocSearch cost?',
      'What is the Ask AI side panel?',
      'How do I keep results up to date?',
    ],
  },
];

function pickAnswer(question) {
  const q = question || '';
  return ANSWERS.find((a) => a.match.test(q)) ?? ANSWERS[ANSWERS.length - 1];
}

// Split into streamable tokens while preserving whitespace, so the mock streams
// word-by-word like the real endpoint.
function tokenize(text) {
  return text.match(/\s+|\S+/g) ?? [text];
}

function extractQuestion(init) {
  try {
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null;
    const messages = body?.messages ?? [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message?.role === 'user') {
        const textPart = (message.parts ?? []).find((p) => p.type === 'text');
        if (textPart?.text) return textPart.text;
      }
    }
  } catch {
    // Ignore malformed bodies; fall back to the generic answer.
  }
  return '';
}

function sse(obj) {
  return `data: ${JSON.stringify(obj)}\n\n`;
}

function buildStream(question, { signal } = {}) {
  const { markdown, suggestions } = pickAnswer(question);
  const id = `demo_msg_${Math.random().toString(36).slice(2, 12)}`;
  const tokens = tokenize(markdown);
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let closed = false;
      const close = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      };

      if (signal) {
        if (signal.aborted) {
          close();
          return;
        }
        signal.addEventListener('abort', close, { once: true });
      }

      const send = (obj) => {
        if (closed) return;
        controller.enqueue(encoder.encode(sse(obj)));
      };
      const wait = (ms) =>
        new Promise((resolve) => {
          const timer = setTimeout(resolve, ms);
          signal?.addEventListener(
            'abort',
            () => {
              clearTimeout(timer);
              resolve();
            },
            { once: true },
          );
        });

      send({ type: 'start', messageId: id, messageMetadata: {} });
      send({ type: 'start-step' });
      send({ type: 'text-start', id });

      await wait(220);
      for (const token of tokens) {
        if (closed) return;
        send({ type: 'text-delta', id, delta: token });
        // Faster for whitespace, a touch slower for words → natural cadence.
        await wait(/\S/.test(token) ? 18 + Math.random() * 34 : 8);
      }

      send({ type: 'data-suggestions', data: { suggestions } });
      send({ type: 'text-end', id });
      send({ type: 'finish-step' });
      send({ type: 'finish' });
      if (!closed) controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      close();
    },
  });
}

function mockResponse(question, init) {
  const stream = buildStream(question, { signal: init?.signal });
  return new Response(stream, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
      'x-vercel-ai-ui-message-stream': 'v1',
    },
  });
}

/**
 * Patches `window.fetch` so Agent Studio completion requests are served from the
 * canned fixture while `isAutopilotActive()` is true. Returns a cleanup function
 * that restores the original `fetch`.
 *
 * @param {() => boolean} isAutopilotActive - Whether the demo autopilot is currently driving the UI.
 * @returns {() => void} Cleanup that restores the original `window.fetch`.
 */
export function installAskAiMock(isAutopilotActive) {
  if (typeof window === 'undefined') return () => {};

  const originalFetch = window.fetch.bind(window);

  window.fetch = function patchedFetch(input, init) {
    const url = typeof input === 'string' ? input : (input?.url ?? '');
    const isCompletions = COMPLETIONS_RE.test(url);

    if (isCompletions && isAutopilotActive()) {
      const question = extractQuestion(init);
      return Promise.resolve(mockResponse(question, init));
    }

    return originalFetch(input, init);
  };

  return () => {
    window.fetch = originalFetch;
  };
}
