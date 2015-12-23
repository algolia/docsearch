---
layout: page
title: Documentation
permalink: /documentation/
---

## Introduction

We're scratching our own itch here. As developers, we spend a lot of time reading documentation, and it isn't always easy to find the information we need.

Not blaming anyone here. Building a good search for a documentation is a complex challenge. We happen to have a lot of experience doing that, and we want to share it with the world. For free.

Just submit the form on the [website](https://community.algolia.com/docsearch/) and we'll get back to you with what you need to integrate your new search into your website.

 1. We'll crawl your documentation pages,
 2. We'll configure your search experience,
 3. You'll need to add a bit of JavaScript and CSS code to your website.

## Setup

Once we've crawled your documentation website we'll send you the credentials you need to add the following code snippet to your website:

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/docsearch.js/0/docsearch.min.css" />
<script type="text/javascript" src="//cdn.jsdelivr.net/docsearch.js/0/docsearch.min.js"></script>
<script type="text/javascript">
docsearch({
  apiKey: '<API_KEY>',
  indexName: '<INDEX_NAME>',
  inputSelector: '<YOUR_INPUT_DOM_SELECTOR>'
});
</script>
```

## Customization

The default colorscheme is blue and gray:

![Default colorscheme](https://community.algolia.com/docsearch/img/default-colorscheme.png)

To update the colors to suit your website, you just need to override a few
colors. Here is an example of a CSS file that you can use as a basis and that
sets white and purples colors.

```css
/* Bottom border of each suggestion */
.algolia-docsearch-suggestion {
  border-bottom-color: #3A3DD1;
}
/* Main category headers */
.algolia-docsearch-suggestion--category-header {
  background-color: #4B54DE;
}
/* Highlighted search terms */
.algolia-docsearch-suggestion--highlight {
  color: #3A33D1;
}
/* Highligted search terms in the main category headers */
.algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--highlight  {
  background-color: #4D47D5;
}
/* Currently selected suggestion */
.aa-cursor .algolia-docsearch-suggestion--content {
  color: #272296;
}
.aa-cursor .algolia-docsearch-suggestion {
  background: #EBEBFB;
}

/* For bigger screens, when displaying results in two columns */
@media (min-width: 768px) {
  /* Bottom border of each suggestion */
  .algolia-docsearch-suggestion {
    border-bottom-color: #7671df;
  }
  /* Left column, with secondary category header */
  .algolia-docsearch-suggestion--subcategory-column {
    border-right-color: #7671df;
    background-color: #F2F2FF;
    color: #4E4726;
  }
}
```

Advanced users can also clone the repository, edit the [_variables.scss](https://github.com/algolia/docsearch/blob/master/src/styles/_variables.scss) file and re-build the CSS file using `npm run build:css`.

