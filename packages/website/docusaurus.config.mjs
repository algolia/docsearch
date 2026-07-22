import { themes } from 'prism-react-renderer';

import myLoaders from './plugins/my-loaders.mjs';
import tailwindLoader from './plugins/tailwind-loader.mjs';

const SIGNUP_LINK =
  'https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch&utm_source=docsearch.algolia.com&utm_medium=referral&utm_campaign=docsearch&utm_content=apply';

// The MCP app is served at the same origin (/mcp) by hosting, not by
// Docusaurus. Linking to the absolute URL makes it an external link so the
// build's broken-link check doesn't flag a route Docusaurus doesn't own.
const MCP_URL = 'https://docsearch.algolia.com/mcp';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

// @ts-check
// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'DocSearch by Algolia',
  tagline:
    'The best search experience for docs, integrated in minutes, for free.',
  url: 'https://docsearch.algolia.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'Algolia',
  projectName: 'DocSearch',
  onBrokenLinks: 'warn',
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
          editUrl:
            'https://github.com/algolia/docsearch/edit/main/packages/website/',
          versions: {
            current: {
              label: 'Latest (v4.x)',
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
  plugins: [myLoaders, tailwindLoader, '@docsearch/docusaurus-adapter'],
  themeConfig:
    /** @type {import('@docsearch/docusaurus-adapter').ThemeConfig} */
    ({
      docsearch: {
        placeholder: 'Search or ask AI',
        appId: 'PMZUYBQDAK',
        apiKey: '24b09689d5b4223813d9b8e48563c8f6',
        indices: [{ name: 'docsearch' }],
        askAi: {
          assistantId: 'ccdec697-e3fe-465b-a1c3-657e7bf18aef',
        },
        sidePanel: true,
        contextualSearch: true,
        searchPage: { path: 'search' },
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
        // Brand lockup is rendered by the swizzled Navbar/Logo (MCP vibe);
        // no image `logo` config needed.
        items: [
          // left
          {
            label: 'Documentation',
            to: 'docs/what-is-docsearch',
            position: 'left',
          },
          {
            label: 'MCP',
            href: MCP_URL,
            target: '_self',
            position: 'left',
            className: 'navbar-mcp-link',
          },
          {
            label: 'Sign up',
            to: SIGNUP_LINK,
            position: 'left',
            className: 'navbar-cta',
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
          '🚀 Get Ask AI now! Turn your docs site search into an AI-powered assistant – faster answers, fewer tickets, better self-serve. <a target="_blank" rel="noopener noreferrer" href="https://dashboard.algolia.com/ask-ai">Get Started Now</a>',
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
        // Brand lockup rendered by the swizzled Footer (MCP vibe).
        copyright: `2015–${currentYear} — Built with <span style="color:var(--accent)">♥</span> by Algolia`,
      },
      image: 'img/og_image.png',
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
};
