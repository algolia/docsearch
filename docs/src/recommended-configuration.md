---
layout: two-columns
title: Recommendation
---

This is great news to know that you want to integrate DocSearch in your website.
A good search experience is key to help your users discover your content.
Documentation is a huge part of your tool.

This section, [empowered by the details about how we build a DocSearch
index][1], gives you the best practices to optimize our crawl. It will enhance
your user's journey.

## Nice to have

- Your website should have [an updated sitemap][2]. This is key to let our
  crawler know what should be updated. Do not worry, we will still crawl your
  website and discover embedded hyperlinks to find your great content.

- Every pages needs to have their full context available. Using global element
  might help.

- Every `lvlx` DOM elements (matching the selectors defined in your
  configuration) must have a unique `id` or `name`. This will help the
  redirection to directly scroll down to the exact place of the matching
  elements. These attributes defined the right anchor to use.

- Make sure your documentation content is also available without JavaScript
  rendering on the client-side. If you absolutely need JavaScript turned on, you
  need to [set `js_render: true` in your config][3].

- Use the recommended selectors. See below:

### Recommended [selectors][4]

Your HTML can add some specific static classes with no styling. These classes
will not impact your content and will help us to create a great discovery
experience. Impatient to know how?, read the following element.

- Add a static `docSearch-content` class to the biggest and smaller element
  gathering your documentation. This element is the main container of your
  textual content. It is mostly a main or article element.

- Every elements outside this main documentation container (for instance in nav)
  should be `global`. They should be sorted according to their `lvl` along the
  HTML flow (`lvl0` appears before `lvl1`).

- Use the standard title tags like `h1`, `h2`, `h3` ... Do not forget to set a
  unique `id` or `name` attribute to these elements as previously described.

- Stay consistent and do not forget that we need to have some regularity along
  the HTML flow [as presented here][5].

### Overview of a clear layout

A website implementing these good practises will look simple and crystal clear.
It can have this following aspect:

![Recommended layout for your page][5] {mt-2}

The biggest blue element will be you `docSearch-content` container. Every
selectors outside this element will be `global`. Every selectors appear in the
same order than their `lvl` along the HTML flow.

### Introduces global information as meta tags

Our crawler automatically extract information from our DocSearch specific meta
taf:

```html
<meta name="docsearch:language" content="en">
<meta name="docsearch:version" content="1.0.0">
```

The `content` value of the meta will be added to every records extracted from
the page. Given that the name is `docsearch:$NAME`, `$NAME` will be set as a
attribute in each of them. Its value will be its related `content` value. You
can then transform them as [`facetFilters`][6] to filter over them. We will need
to use Algolia settings via the DocSearch `custom_settings` parameter and set
`attributesForFaceting` Algolia parameter.

Look at this example with our vuepress integration:

```json
"custom_settings": {
    "attributesForFaceting": [
      "lang"
    ]
  }
```

### The generic configuration example

```json
{
  "index_name": "perfect_docsearch_website",
  "start_urls": ["https://myperfectwebsite.io"],
  "sitemap_urls": ["https://myperfectwebsite.io/sitemap.xml"],
  "stop_urls": [],
  "selectors": {
    "lvl0": {
      "selector": ".header .active",
      "global": true,
      "default_value": "Documentation"
    },
    "lvl1": {
      "selector": "nav .active",
      "global": true,
      "default_value": "Chapter"
    },
    "lvl1": ".docSearch-content h1",
    "lvl2": ".docSearch-content h2",
    "lvl3": ".docSearch-content h3",
    "lvl4": ".docSearch-content h4",
    "text": ".docSearch-content p, .docSearch-content li"
  },
  "custom_settings": {
    "attributesForFaceting": ["language(meta)", "version(meta)", "tags"]
  },
  "nb_hits": "OUTPUT OF THE CRAWL"
}
```

Any question ? [Send us an email][7].

[1]: ./how-do-we-build-an-index.html
[2]: https://www.sitemaps.org/
[3]: ./config-file.html#js_render-optional
[4]: ./config-file.html
[5]: ./assets/proper_layout.png
[6]: https://www.algolia.com/doc/guides/searching/filtering/#facet-filters
[7]: mailto:docsearch@algolia.com
