/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docsearch/react/modal';
declare module '@docsearch/react/style';
declare module '@docsearch/react/style/sidepanel';

declare module 'eta' {
  export const defaultConfig: Record<string, unknown>;

  export function compile(
    template: string,
    options?: Record<string, unknown>,
  ): (data: Record<string, unknown>, config: Record<string, unknown>) => string;
}
