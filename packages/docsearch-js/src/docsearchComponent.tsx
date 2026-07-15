import type { DocSearchProps as DocSearchComponentProps } from '@docsearch/react';
import { DocSearch, version } from '@docsearch/react';

import {
  createDocSearch,
  type DocSearchInstance,
  type DocSearchProps as CreateDocSearchProps,
} from './createDocSearch';

export type { DocSearchCallbacks, DocSearchInstance, TemplateHelpers } from './createDocSearch';
export type DocSearchProps = CreateDocSearchProps<DocSearchComponentProps>;

export const docsearch: (allProps: DocSearchProps) => DocSearchInstance = createDocSearch<DocSearchComponentProps>(
  DocSearch,
  version,
);
