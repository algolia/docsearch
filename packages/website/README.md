[![DocSearch][1]][2]

The easiest way to add search to your documentation. For free.

[![Netlify Status][3]][4]

DocSearch will crawl your documentation website, push its content to an Algolia
index, and allow you to add a dropdown search menu for your users to find
relevant content in no time.

Check out our [website][2] for a complete explanation and documentation.

[![Bootstrap demo][5]][2]

## Related projects

DocSearch gathers 4 repositories:

- [algolia/docsearch][6] contains the `docsearch.js` code source.
- [algolia/docsearch-configs][7] contains the JSON files representing all the
  configs for all the documentations DocSearch is powering
- [algolia/docsearch-scraper][8] contains the crawler we use to extract data
  from your documentation. The code is open source and you can run it from a
  Docker image
- [algolia/docsearch-website][9] contains the documentation website built
  [thanks to docusaurus 2][10]

## Website

### Installation

1. `yarn install` in the root of this repository (one level above this
   directory).
1. In this directory, do `yarn start`.
1. A browser window will open up, pointing to the docs.

### Deployment

Netlify handles the deployment of this website. If you are part of the DocSearch
core team. [Access the Netlify Dashboard][11].

[1]: ./static/img/docsearch-logo.svg
[2]: https://docsearch.algolia.com/
[3]:
  https://api.netlify.com/api/v1/badges/30eacc09-d4b2-4a53-879b-04d40aaea454/deploy-status
[4]: https://app.netlify.com/sites/docsearch/deploys
[5]: ./static/img/demos/example-bootstrap.gif
[6]: https://github.com/algolia/docsearch
[7]: https://github.com/algolia/docsearch-configs
[8]: https://github.com/algolia/docsearch-scraper
[9]: https://github.com/algolia/docsearch-website
[10]: https://v2.docusaurus.io/
[11]: https://app.netlify.com/sites/docsearch/overview
