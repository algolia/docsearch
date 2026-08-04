import React, { type JSX } from 'react';

import { AlgoliaLogo } from './AlgoliaLogo';
import type { DocSearchProps } from './DocSearch';

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
  poweredByText: string;
}>;

type FooterProps = Partial<{
  translations: FooterTranslations;
  isAskAiActive: boolean;
  footerAction: DocSearchProps['footerAction'];
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
  footerAction: FooterAction,
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
    poweredByText = 'Powered by',
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
        {FooterAction && (
          <div className="DocSearch-Footer-Action">
            <FooterAction />
          </div>
        )}
        <div className="DocSearch-Logo">
          <AlgoliaLogo translations={{ poweredByText }} />
        </div>
      </div>
    </>
  );
}
