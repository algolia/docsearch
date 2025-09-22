import { themes } from 'prism-react-renderer';

import myLoaders from './plugins/my-loaders.mjs';
import tailwindLoader from './plugins/tailwind-loader.mjs';

const SIGNUP_LINK = 'https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

// @ts-check
// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'DocSearch by Algolia',
  tagline: 'The best search experience for docs, integrated in minutes, for free.',
  url: 'https://docsearch.algolia.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'Algolia',
  projectName: 'DocSearch',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      useCssCascadeLayers: false,
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
              label: 'Stable (v4.x)',
            },
            v3: {
              label: 'Legacy (v3.x)',
            },
            legacy: {
              label: 'Legacy (v1.x - v2.x)',
            },
          },
          lastVersion: 'current',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  plugins: [myLoaders, tailwindLoader],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        placeholder: 'Search or ask AI',
        appId: 'PMZUYBQDAK',
        apiKey: '24b09689d5b4223813d9b8e48563c8f6',
        indexName: 'docsearch',
        askAi: {
          indexName: 'docsearch-markdown',
          assistantId: 'askAIDemo',
          apiKey: '24b09689d5b4223813d9b8e48563c8f6',
          appId: 'PMZUYBQDAK',
        },
        contextualSearch: true,
        translations: {
          button: {
            buttonText: 'Go on, give it a search...',
          },
          modal: {
            footer: {
              poweredByText: 'Powered by',
            },
          },
        },
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
            label: 'Documentation',
            to: 'docs/what-is-docsearch',
            position: 'left',
          },
          {
            label: 'Playground',
            to: 'https://community.algolia.com/docsearch-playground/',
            position: 'left',
          },
          {
            label: 'Sign up',
            to: SIGNUP_LINK,
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
      announcementBar: {
        id: 'announcement-bar',
        content:
          '🚀 Get AskAI now! Turn your docs site search into an AI-powered assistant – faster answers, fewer tickets, better self-serve. <a target="_blank" rel="noopener noreferrer" href="https://dashboard.algolia.com/ask-ai">Get Started Now</a>',
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
                to: 'docs/v3/docsearch',
              },
              {
                label: 'DocSearch v4 - Beta',
                to: 'docs/docsearch',
              },
            ],
          },
          {
            title: 'DocSearch',
            items: [
              {
                label: 'Sign up',
                to: SIGNUP_LINK,
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
          src: 'img/docsearch-x-algolia-logo-light-mode.png',
          srcDark: 'img/docsearch-x-algolia-logo-dark-mode.png',
          width: 200,
        },
        copyright: `2015-${currentYear} – Built with 💙 by Algolia`,
      },
      image: 'img/og_image.png',
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};
