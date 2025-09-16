import { DocSearchSidePanel, DocSearchSidePanelButton } from '@docsearch/sidepanel';
import React, { render } from 'preact/compat';

function getHTMLElement(
  value: HTMLElement | string,
  environment: SidePanelAddonConfig['environment'] = window,
): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}

interface SidePanelAddonConfig {
  container: HTMLElement | string;
  environment?: typeof window;
}

interface Addon {
  render: () => ReturnType<typeof render>;
}

export function sidepanelAddon(config: SidePanelAddonConfig): Addon {
  const containerElement = getHTMLElement(config.container, config.environment);

  return {
    render(): ReturnType<typeof render> {
      return render(
        <>
          <DocSearchSidePanelButton />
          <DocSearchSidePanel />
        </>,
        containerElement,
      );
    },
  };
}
