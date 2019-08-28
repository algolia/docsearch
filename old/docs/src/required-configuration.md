---
layout: two-columns
title: Required configuration
---

This section, [empowered by the details about how we build a DocSearch
index][1], gives you the best practices to optimize our crawl. Adopting this
following specification is required to let our crawler build the best experience
from your website. You will need to update your website and follow these rules.
Your documentation will match our generic configuration:

Note: If your website is generated thanks to one of our supported tool, you do
not need to change your website as it is already compliant with our
requirements.

## The generic configuration example

```json
{
  "index_name": "example",
  "start_urls": ["https://www.example.com/doc/"],
  "sitemap_urls": ["https://www.example.com/sitemap.xml"],
  "stop_urls": [],
  "selectors": {
    "lvl0": {
      "selector": ".DocSearch-lvl0",
      "global": true,
      "default_value": "Documentation"
    },
    "lvl1": {
      "selector": ".DocSearch-lvl1",
      "global": true,
      "default_value": "Chapter"
    },
    "lvl2": ".DocSearch-content .DocSearch-lvl2",
    "lvl3": ".DocSearch-content .DocSearch-lvl3",
    "lvl4": ".DocSearch-content .DocSearch-lvl4",
    "lvl5": ".DocSearch-content .DocSearch-lvl5",
    "lvl6": ".DocSearch-content .DocSearch-lvl6",
    "text": ".DocSearch-content p, .DocSearch-content li"
  },
  "custom_settings": {
    "attributesForFaceting": ["language", "version"]
  },
  "nb_hits": "OUTPUT OF THE CRAWL"
}
```

### Overview of a clear layout

A website implementing these good practises will look simple and crystal clear.
It can have this following aspect:

![Recommended layout for your page][2] {mt-2}

The biggest blue element will be you `DocSearch-content` container. More details
in the following guidelines.

### Use the right classes as [selectors][3]

You can add some specific static classes to help us find your content's role.
These classes can not involve any style changes. These dedicated classes will
help us to create a great learn as you type experience from your documentation.

- Add a static class `DocSearch-content` to the main container of your textual
  content. Most of the time, this tag `<main>` or an `<article>` HTML element.

- Every searchable `lvl` elements outside this main documentation container (for
  instance in a sidebar) must be `global` selectors. They will be globally
  pickup and injected to every records built from your page. Be careful, the
  level's value matter and every matching element must have an increasing level
  along the HTML flow. The level `X` (for `lvlX`) should appear after a level
  `Y` while `X>Y`.

- `lvlX` selectors should use the standard title tags like `h1`, `h2`, `h3`,
  etc. You can also use static class. Set a unique `id` or `name` attribute to
  these elements as detailed below.

- Every DOM elements matching the `lvlX` selectors must have a unique `id` or
  `name` attribute. This will help the redirection to directly scroll down to
  the exact place of the matching elements. These attributes defined the right
  anchor to use.

- Every textual element (selector `text`) must be wrapped in a tag `<p>` or
  `<li>`. This content must be atomic and split into small entities. Be careful
  to never nest one matching elements into another one, it will create
  duplicates.

- Stay consistent and do not forget that we need to have some regularity along
  the HTML flow [as presented here][1].

## Introduces global information as meta tags

Our crawler automatically extract information from our DocSearch specific meta
tags:

```html
<meta name="docsearch:language" content="en" />
<meta name="docsearch:version" content="1.0.0" />
```

The `content` value of the meta will be added to every records extracted from
the page. Given that the name is `docsearch:$NAME`, `$NAME` will be set as an
attribute in every records. Its value will be its related `content` value. You
can then transform these attributes as [`facetFilters`][4] to filter over them
from the UI. We will need to set `attributesForFaceting` of your Algolia index
exposed via the DocSearch `custom_settings` parameter.

```json
"custom_settings": {
    "attributesForFaceting": ["language", "version"]
  }
```

## Nice to have

- Your website should have [an updated sitemap][5]. This is key to let our
  crawler know what should be updated. Do not worry, we will still crawl your
  website and discover embedded hyperlinks to find your great content.

- Every pages needs to have their full context available. Using global element
  might help (see above).

- Make sure your documentation content is also available without JavaScript
  rendering on the client-side. If you absolutely need JavaScript turned on, you
  need to [set `js_render: true` in your configuration][6].

Any question ? [Send us an email][7].

[1]: ./how-do-we-build-an-index.html
[2]: ./assets/proper_layout.png
[3]: ./config-file.html
[4]: https://www.algolia.com/doc/guides/searching/filtering/#facet-filters
[5]: https://www.sitemaps.org/
[6]: ./config-file.html#js_render-optional
[7]: mailto:DocSearch@algolia.com
