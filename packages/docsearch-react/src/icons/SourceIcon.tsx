import React, { type JSX } from 'react';

const LvlIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
};

export function SourceIcon(props: { type: string }): JSX.Element {
  switch (props.type) {
    case 'lvl1':
      return <LvlIcon />;
    case 'content':
      return <ContentIcon />;
    default:
      return <AnchorIcon />;
  }
}

function AnchorIcon(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

function ContentIcon(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M17 5H3h14zm0 5H3h14zm0 5H3h14z"
        stroke="currentColor"
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      />
    </svg>
  );
}
