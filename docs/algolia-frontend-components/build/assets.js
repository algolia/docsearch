
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const IMG_DIR = path.resolve(__dirname, './../images');

let assets = {}

if(!process.browser && !process.env.webpack) {
  assets = {
    algoliaLogo : fs.readFileSync(IMG_DIR + '/algolia-logo-darkbg.svg', 'utf8').toString(),
    communityLogo : fs.readFileSync(IMG_DIR + '/algolia-community-dark.svg', 'utf8').toString(),
    searchIcon : fs.readFileSync(IMG_DIR + '/search-icon.svg', 'utf8').toString(),
    searchCloseIcon : fs.readFileSync(IMG_DIR + '/search-close-icon.svg', 'utf8').toString(),
    iconSeparator : fs.readFileSync(IMG_DIR + '/icon-separator.svg', 'utf8').toString(),
    InstantSearchReact : fs.readFileSync(IMG_DIR + '/react-instantsearch.svg', 'utf8').toString(),
    instantSearchAndroid : fs.readFileSync(IMG_DIR + '/instantsearch-android.svg', 'utf8').toString(),
    shopify : fs.readFileSync(IMG_DIR + '/shopify.svg', 'utf8').toString(),
    wordpress : fs.readFileSync(IMG_DIR + '/wordpress.svg', 'utf8').toString()
  }
} else if(process.env.webpack){
  assets = {
    algoliaLogo : fs.readFileSync(IMG_DIR + '/algolia-logo-darkbg.svg', 'utf8').toString(),
    communityLogo : fs.readFileSync(IMG_DIR + '/algolia-community-dark.svg', 'utf8').toString(),
    searchIcon : fs.readFileSync(IMG_DIR + '/search-icon.svg', 'utf8').toString(),
    searchCloseIcon : fs.readFileSync(IMG_DIR + '/search-close-icon.svg', 'utf8').toString(),
    iconSeparator : fs.readFileSync(IMG_DIR + '/icon-separator.svg', 'utf8').toString(),
    InstantSearchReact : fs.readFileSync(IMG_DIR + '/react-instantsearch.svg', 'utf8').toString(),
    instantSearchAndroid : fs.readFileSync(IMG_DIR + '/instantsearch-android.svg', 'utf8').toString(),
    shopify : fs.readFileSync(IMG_DIR + '/shopify.svg', 'utf8').toString(),
    wordpress : fs.readFileSync(IMG_DIR + '/wordpress.svg', 'utf8').toString()
  }
} else if(process.env.NODE) {
  assets = {
    algoliaLogo : fs.readFileSync(IMG_DIR + '/algolia-logo-darkbg.svg', 'utf8').toString(),
    communityLogo : fs.readFileSync(IMG_DIR + '/algolia-community-dark.svg', 'utf8').toString(),
    searchIcon : fs.readFileSync(IMG_DIR + '/search-icon.svg', 'utf8').toString(),
    searchCloseIcon : fs.readFileSync(IMG_DIR + '/search-close-icon.svg', 'utf8').toString(),
    iconSeparator : fs.readFileSync(IMG_DIR + '/icon-separator.svg', 'utf8').toString(),
    InstantSearchReact : fs.readFileSync(IMG_DIR + '/react-instantsearch.svg', 'utf8').toString(),
    instantSearchAndroid : fs.readFileSync(IMG_DIR + '/instantsearch-android.svg', 'utf8').toString(),
    shopify : fs.readFileSync(IMG_DIR + '/shopify.svg', 'utf8').toString(),
    wordpress : fs.readFileSync(IMG_DIR + '/wordpress.svg', 'utf8').toString()
  }
}

module.exports = assets;
