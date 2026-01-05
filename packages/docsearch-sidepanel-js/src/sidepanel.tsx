import type { InitialAskAiMessage } from '@docsearch/core';
import type { DocSearchRef, DocSearchSidepanelProps } from '@docsearch/react/sidepanel';
import { DocSearchSidepanel } from '@docsearch/react/sidepanel';
import { render, createElement, unmountComponentAtNode, createRef } from 'preact/compat';

/**
 * Instance returned by sidepanel() for programmatic control.
 */
export interface SidepanelInstance {
  /** Returns true once the component is mounted and ready. */
  readonly isReady: boolean;
  /** Returns true if the sidepanel is currently open. */
  readonly isOpen: boolean;
  /** Opens the sidepanel. */
  open(): void;
  /** Closes the sidepanel. */
  close(): void;
  /** Opens the sidepanel with an initial message. */
  openWithMessage(initialMessage?: InitialAskAiMessage): void;
  /** Unmounts the Sidepanel component and cleans up. */
  destroy(): void;
}

/**
 * Lifecycle callbacks for the Sidepanel instance.
 */
export interface SidepanelCallbacks {
  /** Called once Sidepanel is mounted and ready for interaction. */
  onReady?: () => void;
  /** Called when the sidepanel opens. */
  onOpen?: () => void;
  /** Called when the sidepanel closes. */
  onClose?: () => void;
}

export type SidepanelProps = DocSearchSidepanelProps &
  SidepanelCallbacks & {
    container: HTMLElement | string;
    environment?: typeof window;
  };

function getHTMLElement(value: HTMLElement | string, env: typeof window | undefined): HTMLElement {
  if (typeof value !== 'string') return value;
  if (!env) throw new Error('Cannot resolve a selector without a browser environment.');
  const el = env.document.querySelector<HTMLElement>(value);
  if (!el) throw new Error(`Container selector did not match any element: "${value}"`);
  return el;
}

export function sidepanel(props: SidepanelProps): SidepanelInstance {
  const { container, environment, onReady, onOpen, onClose, ...sidepanelProps } = props;
  const containerEl = getHTMLElement(container, environment || (typeof window !== 'undefined' ? window : undefined));
  const ref = createRef<DocSearchRef>();
  let isReady = false;

  // Map sidepanel-specific callbacks to core callbacks
  const componentProps = {
    ...sidepanelProps,
    ref,
    onReady: (): void => {
      isReady = true;
      onReady?.();
    },
    onSidepanelOpen: onOpen,
    onSidepanelClose: onClose,
  };

  render(createElement(DocSearchSidepanel, componentProps), containerEl);

  return {
    open(): void {
      ref.current?.openSidepanel();
    },
    close(): void {
      ref.current?.close();
    },
    openWithMessage(initialMessage?: InitialAskAiMessage): void {
      ref.current?.openSidepanel(initialMessage);
    },
    get isReady(): boolean {
      return isReady;
    },
    get isOpen(): boolean {
      return ref.current?.isSidepanelOpen ?? false;
    },
    destroy(): void {
      unmountComponentAtNode(containerEl);
      isReady = false;
    },
  };
}
