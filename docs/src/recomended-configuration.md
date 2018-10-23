---
layout: two-columns
title: Recommended recommendation
---

This is great news to know that you want to integrate DocSearch in your website.
A good search experience is key to help your users discover your content.

This section, [empowered by the details regarding how we build a DocSearch
index][1], this section will give what is the requirements in order to have a
great experience.

## Recommendations

- My website should have [an updated sitemap][2]. This is key in order to let us
  know what should be updated. Do not worry, we will still crawl your website
  and discover embedded hyperlinks to find your great content.

- Every pages needs to have her full context available. Using [metadata is
  meaningful][3].

- Every `lvlx` DOM elements (matching your selectors) must have a unique `id` or
  `name`. This will help the redirection to directly scroll down to the exact
  place of the matching elements.

- Your website should not require some JavaScript rendering to generate the
  payload of your website (that-is-to-say your documentation). You can change
  [the `user_agent` parameter][4] in order to do so.

- Use the recommended selectors. See below:

### Recommended selectors

Your HTML can add some specific static classes with no styling. These classes
will not impact your content and will help us to create a great discovery
experience. Impatient to know how?, read the following element.

- Add a static `docSearch-content` class to the biggest and smaller element
  gathering your documentation. This element is the main container of your
  textual content. It is mostly a main or article element.

- Every elements outside this main documentation container (e.g. in nav) should
  be `global`. They should be sorted according to their `lvl` along the HTML
  flow (i.e. `lvl0` appears before `lvl1`).

- Use the standard title tags like `h1`, `h2`, `h3` ... Do not forget to set a
  unique `id` or `name` attribute to these elements as described previously.

- Stay consistent and do not follow that we need to have some regularity along
  the HTML flow [as presented here][1].

### Overview of a clear layout

A website implementing these good practises will look simple and crystal clear.
It can have this following aspect:

![Recommended layout for your page][5] {mt-2}

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

Any question ? [Send us an email][6].

[1]: ./how-do-we-build-an-index.html
[2]: https://www.sitemaps.org/
[3]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
[4]: ./config-file.html
[5]: ./assets/proper_layout.png
[6]: mailto:docsearch@algolia.com
