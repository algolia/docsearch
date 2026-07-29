import React, { type JSX } from 'react';

import { DocSearchByAlgolia } from './components/DocSearchByAlgolia';
import { DocsMCPAction } from './components/DocsMCPAction';

export type FooterTranslations = Partial<{
  selectText: string;
  submitQuestionText: string;
  selectKeyAriaLabel: string;
  navigateText: string;
  navigateUpKeyAriaLabel: string;
  navigateDownKeyAriaLabel: string;
  closeText: string;
  backToSearchText: string;
  closeKeyAriaLabel: string;
  /**
   * Text displayed for the add Docs MCP CTA.
   *
   * @default 'Add Docs MCP'
   */
  addDocsMCPText: string;
  /**
   * Aria label for the DocSearch by Algolia lockup.
   *
   * @default 'DocSearch by Algolia'
   */
  byAlgoliaAriaLabel: string;
}>;

type FooterProps = Partial<{
  translations: FooterTranslations;
  isAskAiActive: boolean;
  hideMCPCallout: boolean;
}>;

interface CommandIconProps {
  children: React.ReactNode;
  ariaLabel: string;
}

function CommandIcon(props: CommandIconProps): JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      aria-label={props.ariaLabel}
      viewBox="0 0 24 24"
      role="img"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      >
        {props.children}
      </g>
    </svg>
  );
}

export function Footer({
  translations = {},
  isAskAiActive = false,
  hideMCPCallout = false,
}: FooterProps): JSX.Element {
  const {
    selectText = 'Select',
    selectKeyAriaLabel = 'Enter key',
    submitQuestionText = 'Submit question',
    navigateText = 'Navigate',
    navigateUpKeyAriaLabel = 'Arrow up',
    navigateDownKeyAriaLabel = 'Arrow down',
    closeText = 'Close',
    backToSearchText = 'Back to search',
    closeKeyAriaLabel = 'Escape key',
    addDocsMCPText = 'Add Docs MCP',
    byAlgoliaAriaLabel = 'DocSearch by Algolia',
  } = translations;

  return (
    <>
      <ul className="DocSearch-Commands">
        <li>
          <kbd className="DocSearch-Commands-Key">
            <CommandIcon ariaLabel={navigateDownKeyAriaLabel}>
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </CommandIcon>
          </kbd>
          <kbd className="DocSearch-Commands-Key">
            <CommandIcon ariaLabel={navigateUpKeyAriaLabel}>
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </CommandIcon>
          </kbd>
          <span className="DocSearch-Label">{navigateText}</span>
        </li>
        <li>
          <kbd className="DocSearch-Commands-Key">
            <CommandIcon ariaLabel={selectKeyAriaLabel}>
              <polyline points="9 10 4 15 9 20" />
              <path d="M20 4v7a4 4 0 0 1-4 4H4" />
            </CommandIcon>
          </kbd>
          <span className="DocSearch-Label">
            {isAskAiActive ? submitQuestionText : selectText}
          </span>
        </li>
        <li>
          <kbd className="DocSearch-Commands-Key">
            <span className="DocSearch-Escape-Key">ESC</span>
          </kbd>
          <span className="DocSearch-Label" aria-label={closeKeyAriaLabel}>
            {isAskAiActive ? backToSearchText : closeText}
          </span>
        </li>
      </ul>
      <div className="DocSearch-Footer-Actions">
        {!hideMCPCallout && (
          <div className="DocSearch-DocsMCPAction">
            <DocsMCPAction addDocsMCPText={addDocsMCPText} />
          </div>
        )}
        <DocSearchByAlgolia byAlgoliaAriaLabel={byAlgoliaAriaLabel} />
      </div>
    </>
  );
}
