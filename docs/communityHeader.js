const fs = require('fs');
const algoliaComponents = require('algolia-frontend-components');

const output = algoliaComponents.communityHeader({
  menu: {
    project: {
      label: 'DocSearch',
      url: '/docsearch/',
    },
    community: {
      style: 'widelist',
      view: 'integrations',
      label: '',
      caret: '',
      dropdownItems: [
        {
          name: 'React InstantSearch',
          url: 'https://community.algolia.com/instantsearch.js/react',
          logo: 'InstantSearchReact',
          backgroundColor: 'linear-gradient(to bottom left, #2C5EE2 0%, #17204F 150%)',
        },
        {
          name: 'Vue InstantSearch',
          url: 'https://github.com/algolia/vue-instantsearch/',
          logo: 'http://res.cloudinary.com/hilnmyskv/image/upload/v1500619122/instantsearch-icon_white.svg',
          backgroundColor: 'linear-gradient(to right, #4DBA87, #2F9088)',
        },
        {
          name: 'InstantSearch Android',
          url: 'https://community.algolia.com/instantsearch-android/',
          logo: 'http://res.cloudinary.com/hilnmyskv/image/upload/v1500619122/instantsearch-icon_white.svg',
          backgroundColor: 'linear-gradient(112deg, #21c7d0, #2dde98)',
        },
        {
          name: 'instantsearch.js',
          url: 'https://community.algolia.com/instantsearch.js/',
          logo: 'http://res.cloudinary.com/hilnmyskv/image/upload/v1500619122/instantsearch-icon_black.svg',
          backgroundColor: '#fecf50',
        },
        {
          name: 'InstantSearch iOS',
          url: 'https://community.algolia.com/instantsearch-ios',
          logo: 'http://res.cloudinary.com/hilnmyskv/image/upload/v1500619122/instantsearch-icon_white.svg',
          backgroundColor: 'linear-gradient(to top left, #D8EE34, #02ADE6, #033DF1)',
        },
        {
          name: 'magento',
          url: 'https://community.algolia.com/magento/',
          logo: 'https://res.cloudinary.com/hilnmyskv/image/upload/v1477318624/magento-icon-white.svg',
          backgroundColor: 'linear-gradient(to bottom right, #ed9259, #e76d22)',
        },
      ],
    },
  },
  sideMenu: [
    {
      name: 'Documentation',
      url: '/docsearch/documentation',
    },
    {
      name: 'About',
      url: 'https://algolia.com/about',
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
      url: 'https://algolia.com/about',
    },
    {
      name: 'Github',
      url: 'https://github.com/algolia/docsearch/',
      target: '_blank',
      image: "<img src='/docsearch/img/icon-github.svg'/>",
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
