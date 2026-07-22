import type { DocSearchAIProps as DocSearchComponentProps } from '@docsearch/react/docsearchAi';
import { DocSearchAI } from '@docsearch/react/docsearchAi';
import { version } from '@docsearch/react/version';

import {
  createDocSearch,
  type DocSearchInstance,
  type DocSearchProps as CreateDocSearchProps,
} from './createDocSearch';

export type {
  DocSearchCallbacks,
  DocSearchInstance,
  TemplateHelpers,
} from './createDocSearch';
export type DocSearchAIProps = CreateDocSearchProps<DocSearchComponentProps>;

export const docsearchAi: (allProps: DocSearchAIProps) => DocSearchInstance =
  createDocSearch<DocSearchComponentProps>(DocSearchAI, version);
