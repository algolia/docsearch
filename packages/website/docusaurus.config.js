/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'DocSearch',
  tagline:
    'The best search experience for docs, integrated in minutes, for free',
  url: 'https://docsearch.algolia.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'Algolia',
  projectName: 'DocSearch',
  themes: ['@docusaurus/theme-live-codeblock'],
  plugins: ['my-loaders', 'tailwind-loader'], // loader required for .svg
  themeConfig: {
    algolia: {
      apiKey: '25626fae796133dc1e734c6bcaaeac3c',
      indexName: 'docsearch',
    },
    navbar: {
      logo: {
        alt: 'DocSearch',
        src: 'img/docsearch-logo.svg',
        srcDark: 'img/docsearch-logo-white.svg',
      },
      title: ' ',
      hideOnScroll: true,
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
        },
        {
          label: 'Documentation',
          to: 'docs/what-is-docsearch',
          position: 'right',
        },
        {
          label: 'Showcase',
          to: 'showcase',
          position: 'right',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/algolia/DocSearch',
          position: 'right',
        },
      ],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'supportus',
      content:
        '⭐️ If you like DocSearch, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/algolia/docsearch">GitHub</a>! ⭐️',
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/what-is-docsearch',
            },
            {
              label: 'FAQ',
              to: 'docs/faq',
            },
            {
              label: 'DocSearch.js',
              to: 'docs/dropdown',
            },
            {
              label: 'Run your own scraper',
              to: 'docs/run-your-own',
            },
            {
              label: 'Playground',
              to: 'playground',
            },
          ],
        },
        {
          title: 'DocSearch',
          items: [
            {
              label: 'Issues',
              to: 'https://github.com/algolia/docsearch/issues',
            },
            {
              label: 'Scraper',
              to: 'https://github.com/algolia/docsearch-scraper',
            },
            {
              label: 'Configurations',
              to: 'https://github.com/algolia/docsearch-configs',
            },
            {
              label: 'Privacy',
              to: 'https://www.algolia.com/policies/privacy/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Apply',
              to: 'apply',
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
        },
      ],
      logo: {
        alt: 'Algolia',
        src: 'img/algolia-logo.svg',
      },
      copyright: `DocSearch 2015-now • Designed and Built by Algolia`,
    },
    image: 'img/og_image.png',
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
