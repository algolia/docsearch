const fs = require('fs');
const algoliaComponents = require('algolia-frontend-components');

const output = algoliaComponents.communityHeader({
  menu: {
    project: {
      label: 'DocSearch',
      url: '/docsearch/',
    },
  },
  sideMenu: [
    {
      name: 'Documentation',
      url: '/docsearch/documentation',
    },
    {
      name: 'About',
      url: '/docsearch/about',
    },
    {
      name: '',
      url: 'https://github.com/algolia/docsearch/',
      target: '_blank',
      image: "<img src='/docsearch/img/icon-github.svg'/>",
    },
  ],
  mobileMenu: [
    {
      name: 'Documentation',
      url: '/docsearch/documentation',
    },
    {
      name: 'About',
      url: '/docsearch/about',
    },
    {
      name: 'Github',
      url: 'https://github.com/algolia/docsearch/',
      target: '_blank',
      image: "<img src='/docsearch/img/icon-github.svg'/>",
    },
    {
      name: 'Discourse',
      url: 'https://discourse.algolia.com/c/docsearch',
      target: '_blank',
    },
  ],
});

const file = fs.readFileSync(
  'node_modules/algolia-frontend-components/dist/_communityHeader.js'
);

try {
  fs.writeFileSync('_includes/header.html', output, 'utf-8');
  fs.writeFileSync('js/communityHeader.js', file, 'utf-8');
} catch (e) {
  throw new Error('Failed to write header file');
}
