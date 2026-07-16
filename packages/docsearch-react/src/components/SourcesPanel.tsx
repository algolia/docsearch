import React, { type JSX, useEffect } from 'react';

import { ContentIcon } from '../icons';
import type { ExtractedLink } from '../utils/ai';

import { Popover } from './ui/Popover';

interface SourcesProps {
  links: ExtractedLink[];
  titleText?: string;
}

export function SourcesPanel({
  links,
  titleText = 'Sources',
}: SourcesProps): JSX.Element | null {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [boundary, setBoundary] = React.useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const trigger = triggerRef.current;
    const scrollContainer =
      trigger?.closest<HTMLElement>('.DocSearch-Sidepanel-Content') ??
      trigger?.closest<HTMLElement>('.DocSearch-Dropdown') ??
      null;

    setBoundary(scrollContainer);

    if (!scrollContainer) {
      return undefined;
    }

    const handleScroll = (): void => {
      if (!triggerRef.current) {
        return;
      }

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      const isOutOfView =
        triggerRect.bottom <= containerRect.top ||
        triggerRect.top >= containerRect.bottom;

      if (isOutOfView) {
        setOpen(false);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  if (links.length === 0) {
    return null;
  }

  return (
    <Popover open={open} modal="trap-focus" onOpenChange={setOpen}>
      <Popover.Trigger
        ref={triggerRef}
        className="DocSearch-AskAiScreen-Sources-Action"
      >
        <span className="DocSearch-AskAiScreen-Sources-Action-icon">
          <ContentIcon />
        </span>
        <span className="DocSearch-AskAiScreen-Sources-Action-text">
          {links.length} sources
        </span>
      </Popover.Trigger>
      <Popover.Popup
        container={boundary}
        sideOffset={10}
        align="start"
        alignOffset={-16}
        collisionBoundary={boundary ?? 'clipping-ancestors'}
      >
        <Popover.Title>{titleText}</Popover.Title>
        <ul className="DocSearch-AskAiScreen-Sources">
          {links.map((l) => (
            <li key={l.url} className="DocSearch-AskAiScreen-Sources-source">
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                <ContentIcon />
                <span className="DocSearch-AskAiScreen-Sources-source-title">
                  {l.title || l.url}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Popover.Popup>
    </Popover>
  );
}
