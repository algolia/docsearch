import Admonition from '@theme/Admonition';
import React from 'react';

export default function AskAIDeprecationNotice() {
  return (
    <Admonition type="warning">
      Ask AI is being migrated into Algolia&apos;s{' '}
      <a href="https://www.algolia.com/doc/guides/algolia-ai/agent-studio" target="_blank" rel="noreferrer">
        Agent Studio
      </a>
      . You can migrate your assistant now and update DocSearch to use your Agent Studio agent ID. See the{' '}
      <a href="/docs/v4/migrating-askai-to-agent-studio">Ask AI → Agent Studio migration guide</a>.
    </Admonition>
  );
}
