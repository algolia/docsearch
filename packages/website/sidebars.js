/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation.
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 */

export default {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['what-is-docsearch', 'who-can-apply', 'migrating-from-v4', 'v5-breaking-changes'],
    },
    {
      type: 'category',
      label: 'Packages',
      items: [
        'packages/overview',
        {
          type: 'category',
          label: '@docsearch/js',
          items: ['packages/js/getting-started', 'packages/js/api-reference'],
        },
        {
          type: 'category',
          label: '@docsearch/react',
          items: ['packages/react/getting-started', 'packages/react/api-reference', 'packages/react/examples'],
        },
        {
          type: 'category',
          label: '@docsearch/modal',
          items: ['packages/modal/overview', 'packages/modal/api'],
        },
        {
          type: 'category',
          label: '@docsearch/sidepanel',
          items: [
            'packages/sidepanel/getting-started',
            'packages/sidepanel/advanced-use-cases',
            'packages/sidepanel/api',
          ],
        },
        {
          type: 'category',
          label: '@docsearch/sidepanel-js',
          items: ['packages/sidepanel-js/getting-started', 'packages/sidepanel-js/api'],
        },
        {
          type: 'category',
          label: '@docsearch/css',
          items: ['packages/css/styling', 'packages/css/bundle-exports'],
        },
        {
          type: 'category',
          label: '@docsearch/core',
          items: ['packages/core/overview', 'packages/core/api'],
        },
        {
          type: 'category',
          label: '@docsearch/docusaurus-adapter',
          items: [
            'packages/docusaurus-adapter/getting-started',
            'packages/docusaurus-adapter/configuration-reference',
            'packages/docusaurus-adapter/migrating-from-v4',
          ],
        },
        'composable-api',
        'hybrid-mode',
      ],
    },
    {
      type: 'category',
      label: 'Agent Studio',
      items: [
        'agent-studio/getting-started',
        'agent-studio/dynamic-indices',
        'agent-studio/tools',
        'agent-studio/memory',
        'agent-studio/prompt-suggestions',
        'agent-studio/feedback',
      ],
    },
    {
      type: 'category',
      label: 'MCP',
      items: ['mcp/overview', 'mcp/installation', 'mcp/usage'],
    },
    {
      type: 'category',
      label: 'Algolia Crawler',
      items: ['create-crawler', 'record-extractor', 'templates', 'crawler-configuration-visual', 'manage-your-crawls'],
    },
    {
      type: 'category',
      label: 'Requirements, tips, FAQ',
      items: [
        {
          type: 'category',
          label: 'FAQ',
          items: ['crawler', 'docsearch-program'],
        },
        {
          type: 'doc',
          id: 'tips',
        },
        {
          type: 'doc',
          id: 'integrations',
        },
      ],
    },
    {
      type: 'category',
      label: 'Under the hood',
      items: ['how-does-it-work', 'required-configuration'],
    },
    {
      type: 'category',
      label: 'Miscellaneous',
      items: ['migrating-from-legacy'],
    },
  ],
};
