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
      items: ['what-is-docsearch', 'who-can-apply', 'migrating-from-legacy'],
    },
    {
      type: 'category',
      label: 'DocSearch v3',
      items: ['docsearch-v3', 'api', 'styling', 'migrating-from-v2'],
    },
    {
      type: 'category',
      label: 'Algolia Crawler',
      items: ['record-extractor', 'templates', 'manage-your-crawls'],
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
  ],
};
