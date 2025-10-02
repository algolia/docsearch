import { useDocSearch } from '@docsearch/core';
import { DocSearchButton as Button, type DocSearchButtonProps as ButtonProps } from '@docsearch/react/button';
import type { JSX } from 'react';
import React from 'react';

export type DocSearchButtonProps = Omit<ButtonProps, 'keyboardShortcuts'>;

export function DocSearchButton(props: DocSearchButtonProps): JSX.Element {
  const { searchButtonRef, keyboardShortcuts, openModal } = useDocSearch();

  return (
    <Button
      ref={searchButtonRef}
      keyboardShortcuts={keyboardShortcuts}
      onClick={(evt) => {
        if (props.onClick) {
          props.onClick(evt);
        }
        openModal();
      }}
      {...props}
    />
  );
}
