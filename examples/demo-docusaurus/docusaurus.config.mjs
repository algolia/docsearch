// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DocSearch + Docusaurus',
  url: 'http://127.0.0.1:4323',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: { routeBasePath: '/' },
        blog: false,
        theme: {},
      }),
    ],
  ],
  plugins: ['@docsearch/docusaurus-adapter'],
  themeConfig: {
    navbar: { title: 'DocSearch + Docusaurus' },
    docsearch: {
      appId: 'PMZUYBQDAK',
      apiKey: '24b09689d5b4223813d9b8e48563c8f6',
      indices: [{ name: 'docsearch' }],
      askAi: { agentId: 'ccdec697-e3fe-465b-a1c3-657e7bf18aef' },
    },
  },
};

export default config;
