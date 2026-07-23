import { Check, Copy } from 'iconoir-react';
import React, { useEffect, useState } from 'react';

const INSTALL_PREFIX = 'npx @docsearch/cli setup ';
const AGENTS = ['--cursor', '--claude', '--codex', '--opencode', '--gemini'];
const LONGEST_AGENT = AGENTS.reduce((a, b) => (b.length > a.length ? b : a));
const AGENT_ROTATE_MS = 2000;

export function InstallCommand() {
  const [agentIndex, setAgentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setAgentIndex((i) => (i + 1) % AGENTS.length);
    }, AGENT_ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const agent = AGENTS[agentIndex];
  const command = `${INSTALL_PREFIX}${agent}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[var(--term-border)] bg-[var(--term-bg)] py-2 pl-3.5 pr-2 text-[var(--term-fg)]">
      <code className="font-mono text-[12.5px] text-[var(--term-fg-muted)]">
        {INSTALL_PREFIX}
        <span className="relative inline-block whitespace-pre align-baseline">
          <span aria-hidden={true} className="invisible">
            {LONGEST_AGENT}
          </span>
          <span
            key={agent}
            className="absolute left-0 top-0 text-[var(--term-fg)] animate-[fade-in_var(--dur-sm)_var(--ease-out-quart)]"
          >
            {agent}
          </span>
        </span>
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
