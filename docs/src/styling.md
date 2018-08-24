---
layout: two-columns
title: Styling DocSearch
---

DocSearch default colorscheme comes in a grey theme with blue highlight.

![Default colorscheme][1]

This theme works well with most websites, but we encourage you to style it to
your own theme. This can be achieved by overriding the CSS classes used by the
default theme.

The following annotated example will help you style each part:

```css
/* Main dropdown wrapper */
.algolia-autocomplete .ds-dropdown-menu {
  width: 500px;
}

/* Main category (eg. Getting Started) */
.algolia-autocomplete .algolia-docsearch-suggestion--category-header {
  color: darkgray;
  border: 1px solid gray;
}

/* Category (eg. Downloads) */
.algolia-autocomplete .algolia-docsearch-suggestion--subcategory-column {
  color: gray;
}

/* Title (eg. Bootstrap CDN) */
.algolia-autocomplete .algolia-docsearch-suggestion--title {
  font-weight: bold;
  color: black;
}

/* Description description (eg. Bootstrap currently works...) */
.algolia-autocomplete .algolia-docsearch-suggestion--text {
  font-size: .8rem;
  color: gray;
}

/* Highlighted text */
.algolia-autocomplete .algolia-docsearch-suggestion--highlight {
  color: blue;
}
```

## Attribution

We're happy to provide DocSearch free of charge for any documentation website,
and you're encouraged to style it to fit your own theming. All we ask is that
you keep the `search by Algolia` logo and link next to your search results.

The logo is automatically added in the dropdown with the default styling. It's
OK to hide it through CSS, as long as you re-add it somewhere else on your page
close to the search input or search results. It's our way to let more people
know about what do, and how they could also have from fast and relevant search
on their website.

If you're using your own [paid Algolia account][2] and [run the crawler
yourself][3], you don't have to keep the logo.

## Debugging

To inspect the dropdown markup with your browser tools, you should
add `debug: true` to your `docsearch` call to prevent it from closing on
inspection.

```javascript
docsearch({
  […],
  debug: true
});
```

## Other considerations

Selected suggestion are wrapped in a `.ds-cursor` class. This means
that you can use `.ds-cursor .algolia-docsearch-suggestion--content` to style
the selected suggestion for example.

On small screens, DocSearch reverts to a single column layout, while the
two-column layout shown in the screenshot is used on larger screens. You can
media queries (for example `@media (min-width: 768px) {}`) to target one or the
other display.

## Advanced styling

To more heavily style the results, feel free to have a look at the
[SCSS source code][4].
`_variables.scss` contains all the default theming, sizing and breakpoints.

You can generate your own CSS file by cloning the repository and running `yarn
run build:css`. The resulting file will be generated in `./dist/cdn`, and should
be used instead of the default one.

[1]: ./assets/default-colorscheme.png

[2]: https://www.algolia.com/pricing

[3]: ./crawler-overview.html

[4]: https://github.com/algolia/docsearch/tree/master/src/styles
