import { themes } from 'prism-react-renderer';

import myLoaders from './plugins/my-loaders.mjs';
import tailwindLoader from './plugins/tailwind-loader.mjs';

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
export default {
  title: 'DocSearch by Algolia',
  tagline: 'The best search experience for docs, integrated in minutes, for free.',
  url: 'https://docsearch.algolia.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'Algolia',
  projectName: 'DocSearch',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      useCssCascadeLayers: true,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          sidebarPath: 'sidebars.js',
          editUrl: 'https://github.com/algolia/docsearch/edit/main/packages/website/',
          versions: {
            current: {
              label: 'current',
            },
          },
          lastVersion: 'current',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [myLoaders, tailwindLoader],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: 'R2IYF7ETH7',
        apiKey: '599cec31baffa4868cae4e79f180729b',
        askAi: 'askAIDemo',
        indexName: 'docsearch',
        contextualSearch: true,
      },
      metadata: [
        {
          name: 'google-site-verification',
          content: '23yIHmCD_xnJb_6e3s-w7M29Kydahk-d86ObMWOrvRg',
        },
      ],
      navbar: {
        hideOnScroll: true,
        logo: {
          alt: 'DocSearch x Algolia',
          src: 'img/docsearch-x-algolia-logo-light-mode.png',
          srcDark: 'img/docsearch-x-algolia-logo-dark-mode.png',
          className: 'docsearch-nav-logo',
        },
        items: [
          // left
          {
            label: 'Docs',
            to: 'docs/what-is-docsearch',
            position: 'left',
          },
          {
            label: 'Apply',
            to: 'apply',
            position: 'left',
          },
          // right
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/algolia/docsearch',
            position: 'right',
            className: 'header-github-link',
          },
        ],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
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
                to: 'docs/docsearch-program',
              },
              {
                label: 'DocSearch v3',
                to: 'docs/docsearch-v3',
              },
              {
                label: 'DocSearch v4 - Beta',
                to: 'docs/docsearch-v4',
              },
            ],
          },
          {
            title: 'DocSearch',
            items: [
              {
                label: 'Apply',
                to: 'apply',
              },
              {
                label: 'Issues',
                to: 'https://github.com/algolia/docsearch/issues',
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
                label: 'Discord',
                to: 'https://discord.com/invite/W7kYfh7FKQ',
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
                to: 'https://algolia.com/blog/',
              },
            ],
          },
        ],
        logo: {
          alt: 'Algolia',
          src: 'img/Algolia-logo-blue.svg',
          srcDark: 'img/Algolia-logo-white.svg',
          width: 200,
        },
        copyright: 'DocSearch 2015-now • Designed and built by Algolia',
      },
      image: 'img/og_image.png',
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};
