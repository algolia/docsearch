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
  plugins: ['my-loaders'],
  themeConfig: {
    algolia: {
      apiKey: '25626fae796133dc1e734c6bcaaeac3c',
      indexName: 'docsearch',
      algoliaOptions: {}, // Optional, if provided by Algolia
    },
    navbar: {
      logo: {
        alt: 'DocSearch',
        src: 'img/docsearch-logo.svg',
      },
      links: [
        {to: 'docs/what-is-docsearch', label: 'Documentation', position: 'right'},
        {
          href: 'https://github.com/algolia/DocSearch',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/what-is-docsearch'
            },
            {
              label: 'DocSearch.js',
              to: 'docs/dropdown'
            },
            {
              label: 'FAQ',
              to: 'docs/faq'
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
              label:'Code licensed under MIT',
              to: 'https://github.com/algolia/docsearch/blob/master/LICENSE'
            },
            {
              label: 'GitHub',
              to: 'https://github.com/algolia/docsearch',
            },
            {
              label:'Issues',
              to: 'https://github.com/algolia/docsearch/issues'
            },
            {
              label:'Changelog',
              to: 'https://github.com/algolia/docsearch/blob/master/CHANGELOG.md'
            },
            {
              label:'Apply',
              to: 'apply'
            }
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/algolia',
            },
            {
              label:'Forum',
              to: ''
            },
            {
              label: 'Twitter',
              to: 'https://twitter.com/algolia',
            },
          ],
        },
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
        },
      },
    ],
  ],
};
