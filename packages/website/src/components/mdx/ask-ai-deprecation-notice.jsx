import Admonition from '@theme/Admonition';
import React from 'react';

export default function AskAIDeprecationNotice() {
  return (
    <Admonition type="warning">
      Ask AI is now part of{' '}
      <a href="https://www.algolia.com/doc/guides/algolia-ai/agent-studio" target="_blank" rel="noreferrer">
        Agent Studio
      </a>{' '}
      and isn&apos;t available as a standalone feature for new applications. Use these docs for existing Ask AI
      implementations. To move an existing assistant, see{' '}
      <a href="/docs/v4/migrating-askai-to-agent-studio">Migrate Ask AI to Agent Studio</a>.
    </Admonition>
  );
}
