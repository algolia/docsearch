/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { ThemeConfig } from '@docsearch/docusaurus-adapter';
import type { ThemeConfigValidationContext } from '@docusaurus/types';
import Joi from 'joi';
export declare const DEFAULT_CONFIG: {
    contextualSearch: true;
    searchParameters: {};
    searchPagePath: string;
};
export declare const Schema: Joi.ObjectSchema<ThemeConfig>;
export declare function validateThemeConfig({ validate, themeConfig: themeConfigInput, }: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig;
