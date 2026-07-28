import { Check, Copy } from 'iconoir-react';
import React, { useState } from 'react';

const COMMAND = 'npx @docsearch/cli setup';

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[var(--term-border)] bg-[var(--term-bg)] py-2 pl-3.5 pr-2 text-[var(--term-fg)]">
      <code className="font-mono text-[12.5px] text-[var(--term-fg)] !border-none !px-2 !bg-none">
        {COMMAND}
      </code>
      <button
        type="button"
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-[var(--term-btn-border)] bg-[var(--term-btn-bg)] px-2.5 py-1 text-[12px] font-medium text-[var(--term-fg)] transition-colors hover:bg-[var(--term-btn-bg-hover)]"
        onClick={copy}
      >
        {copied ? (
          <Check width={14} height={14} />
        ) : (
          <Copy width={14} height={14} />
        )}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
