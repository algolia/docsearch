/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import path from 'path';

import type { ThemeConfig } from '@docsearch/docusaurus-adapter';
import type { HtmlTags, LoadContext } from '@docusaurus/types';
import { defaultConfig, compile } from 'eta';
import fs from 'fs-extra';

import { getDocSearchConfig } from './getDocSearchConfig';
import openSearchTemplate from './templates/opensearch';
import { normalizeUrl } from './utils';

let compiledOpenSearchTemplate: ReturnType<typeof compile> | null = null;

function getCompiledOpenSearchTemplate(): ReturnType<typeof compile> {
  if (!compiledOpenSearchTemplate) {
    compiledOpenSearchTemplate = compile(openSearchTemplate.trim());
  }

  return compiledOpenSearchTemplate;
}

function renderOpenSearchTemplate(data: {
  title: string;
  siteUrl: string;
  searchUrl: string;
  faviconUrl: string | null;
}) {
  const compiled = getCompiledOpenSearchTemplate();
  return compiled(data, defaultConfig);
}

const OPEN_SEARCH_FILENAME = 'opensearch.xml';

export function shouldCreateOpenSearchFile({
  context,
}: {
  context: LoadContext;
}): boolean {
  const {
    siteConfig: {
      themeConfig,
      future: { experimental_router: router },
    },
  } = context;
  const { searchPage } = getDocSearchConfig(themeConfig as ThemeConfig);
  const searchPagePath = searchPage === false ? false : searchPage.path;

  return Boolean(searchPagePath) && router !== 'hash';
}

function createOpenSearchFileContent({
  context,
  searchPagePath,
}: {
  context: LoadContext;
  searchPagePath: string;
}): string {
  const {
    baseUrl,
    siteConfig: { title, url, favicon },
  } = context;

  const siteUrl = normalizeUrl([url, baseUrl]);

  return renderOpenSearchTemplate({
    title,
    siteUrl,
    searchUrl: normalizeUrl([siteUrl, searchPagePath]),
    faviconUrl: favicon ? normalizeUrl([siteUrl, favicon]) : null,
  });
}

export async function createOpenSearchFile({
  context,
}: {
  context: LoadContext;
}): Promise<void> {
  const {
    outDir,
    siteConfig: { themeConfig },
  } = context;
  const { searchPage } = getDocSearchConfig(themeConfig as ThemeConfig);
  const searchPagePath = searchPage === false ? false : searchPage.path;
  if (!searchPagePath) {
    throw new Error('no searchPage.path provided in themeConfig.docsearch');
  }
  const fileContent = createOpenSearchFileContent({ context, searchPagePath });
  try {
    await fs.writeFile(path.join(outDir, OPEN_SEARCH_FILENAME), fileContent);
  } catch (err) {
    const error = new Error('Generating OpenSearch file failed.');
    (error as Error & { cause?: unknown }).cause = err;
    throw error;
  }
}

export function createOpenSearchHeadTags({
  context,
}: {
  context: LoadContext;
}): HtmlTags {
  const {
    baseUrl,
    siteConfig: { title },
  } = context;
  return {
    tagName: 'link',
    attributes: {
      rel: 'search',
      type: 'application/opensearchdescription+xml',
      title,
      href: normalizeUrl([baseUrl, OPEN_SEARCH_FILENAME]),
    },
  };
}
