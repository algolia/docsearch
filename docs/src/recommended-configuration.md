---
layout: two-columns
title: Recommended configuration
---

This is great news to know that you want to integrate DocSearch in your website.
A good search experience is key to help your users discover your content.

This section, [empowered by the details about how we build a DocSearch
index][1], gives you the best practices to optimize our crawl. It will enhance
your user's journey.

## Recommendations

- Your website should have [an updated sitemap][2]. This is key to let us know
  what should be updated. Do not worry, we will still crawl your website and
  discover embedded hyperlinks to find your great content.

- Every pages needs to have their full context available. Using global element
  might help.

- Every `lvlx` DOM elements (matching the selectors defined in your
  configuration) must have a unique `id` or `name`. This will help the
  redirection to directly scroll down to the exact place of the matching
  elements.

- Make sure your documentation content is available even without JavaScript
  rendering on the client-side. If you absolutely need JavaScript turned on, you
  need to [set js_render: true in your config][4].

- Use the recommended selectors. See below:

### Recommended selectors

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

- Stay consistent and do not follow that we need to have some regularity along
  the HTML flow [as presented here][5].

### Overview of a clear layout

A website implementing these good practises will look simple and crystal clear.
It can have this following aspect:

![Recommended layout for your page][6] {mt-2}

The biggest blue element will be you `docSearch-content` container. Every
selectors outside this element will be `global`. Every selectors appear in the
same order than their `lvl` along the HTML flow.

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
[4]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
[5]: ./config-file.html
[6]: ./assets/proper_layout.png
[7]: mailto:docsearch@algolia.com
