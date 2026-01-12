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
      items: ['what-is-docsearch', 'who-can-apply'],
    },
    {
      type: 'category',
      label: 'DocSearch v4',
      items: ['docsearch', 'composable-api', 'styling', 'api', 'examples', 'migrating-from-v3'],
    },
    {
      type: 'category',
      label: 'Algolia Ask AI',
      items: [
        'v4/askai',
        'v4/askai-api',
        'v4/askai-prompts',
        'v4/askai-whitelisted-domains',
        'v4/askai-models',
        'v4/askai-markdown-indexing',
        'v4/askai-errors',
        {
          type: 'link',
          label: 'Full Documentation',
          href: 'https://www.algolia.com/doc/guides/algolia-ai/askai',
        },
      ],
    },
    {
      type: 'category',
      label: 'Sidepanel',
      items: [
        'sidepanel/getting-started',
        'sidepanel/advanced-use-cases',
        'sidepanel/hybrid',
        'sidepanel/api-reference',
      ],
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
      items: ['how-does-it-work', 'required-configuration', 'boosting'],
    },
    {
      type: 'category',
      label: 'Miscellaneous',
      items: ['migrating-from-legacy'],
    },
  ],
};
