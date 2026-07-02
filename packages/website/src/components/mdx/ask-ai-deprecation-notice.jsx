import Admonition from '@theme/Admonition';
import React from 'react';

export default function AskAIDeprecationNotice() {
  return (
    <Admonition type="warning">
      Ask AI is being migrated from a standalone DocSearch feature into Algolia's{' '}
      <a href="https://www.algolia.com/doc/guides/algolia-ai/agent-studio" target="_blank" rel="noreferrer">
        Agent Studio
      </a>
      . DocSearch v5 will fully support Agent Studio and transition to using it. A more detailed migration guide will be
      published before the DocSearch v5 release.
    </Admonition>
  );
}
