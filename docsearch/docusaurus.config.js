/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'DocSearch',
  tagline: 'The best search experience for docs, integrates in minutes, for free',
  url: 'https://docsearch.netlify.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'Algolia',
  projectName: 'DocSearch',
  themes: ['@docusaurus/theme-search-algolia'],
  plugins: ['my-loaders'], // loader required for .svg
  themeConfig: {
    algolia: {
      apiKey: '25626fae796133dc1e734c6bcaaeac3c',
      indexName: 'docsearch',
      algoliaOptions: {}, // Optional, if provided by Algolia
    },
    navbar: {
      logo: {
        alt: 'DocSearch',
        src: {
          light: 'img/docsearch-logo.svg',
          dark: 'img/docsearch-logo-white.svg',
        }
      },
      links: [
        {
          label: 'Documentation',
          to: 'docs/what-is-docsearch',
          position: 'right'},
        {
          label: 'GitHub',
          href: 'https://github.com/algolia/DocSearch',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/what-is-docsearch'
            },
            {
              label: 'FAQ',
              to: 'docs/faq'
            },
            {
              label: 'DocSearch.js',
              to: 'docs/dropdown'
            },
            {
              label: 'Run your own scraper',
              to: 'docs/run-your-own'
            },
          ]
        },
        {
          title: 'DocSearch',
          items: [
            {
              label:'Issues',
              to: 'https://github.com/algolia/docsearch/issues'
            },
            {
              label:'Scraper',
              to: 'https://github.com/algolia/docsearch-scraper'
            },
            {
              label:'Configurations',
              to: 'https://github.com/algolia/docsearch-configs'
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label:'Apply',
              to: 'apply'
            },
            {
              label: 'Forum',
              href: 'https://discourse.algolia.com/tags/docsearch',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/tXdr5mP',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/algolia/docsearch',
            },
            {
              label: 'Twitter',
              to: 'https://twitter.com/docsearch_',
            },
            {
              label: 'Algolia Blog',
              to: 'https://blog.algolia.com/',
            },
          ],
        }
      ],
      logo: {
        alt: 'Algolia',
        src: 'img/algolia-logo.svg',
      },
      copyright: `DocSearch 2015-now • Designed and Built by Algolia`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
          customCss: require.resolve('./src/css/fragments.css'),
        },
      },
    ],
  ],
};
