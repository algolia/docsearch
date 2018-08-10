---
layout: two-columns
title: Customize autocomplete styles
---

// TODO

## Attribution

We're happy to provide DocSearch free of charge for your site, and you're
welcome to customize that experience in a way that works for you; all we ask is
that Algolia be attributed within the search context. For example, in the
default implementation, we place a small "Search by Algolia" logo in the
corner. If you prefer to roll your own UX, you'll need to make sure that this
logo is included in your implementation as well.

## Default styling

The default colorscheme is white and gray:

![Default colorscheme](https://community.algolia.com/docsearch/assets/images/default-colorscheme.png)

To update the colors to suit your website, you just need to override a few
colors. Here is an example of a CSS file that you can use as a basis to
set white and purple colors.

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
/* Highlighted search terms in the main category headers */
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

## Advanced styling

If you want to do heavy changes to the way results are displayed, you might find
it easier to directly edit the `scss` files in this repository.

[`_variables.scss`](https://github.com/algolia/docsearch/blob/master/src/styles/_variables.scss)
contains all the color, breakpoints and size definitions while
[`main.scss`](https://github.com/algolia/docsearch/blob/master/src/styles/main.scss)
holds the structure of the display.

You can regenerate the whole final `css` file from those `scss` files by running
`npm run build:css`. The resulting files will be found in `./dist/cdn/`.

All you have to do now is change the `link` tag that was loading the default
styling from our CDN, to one that is loading your newly compiled file.
