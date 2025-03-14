---
title: Required configuration
---

This section, [empowered by the details about how we build a DocSearch index][1], gives you the best practices to optimize our crawl. Adopting this following specification is required to let our crawler build the best experience from your website. You will need to update your website and follow these rules.

Note: If your website is generated thanks to one of our supported tools, you do not need to change your website as it is already compliant with our requirements.

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

A website implementing these best practices will look simple and crystal clear. It can have this following aspect:

<img src="https://docsearch.algolia.com/img/assets/recommended-layout.png" alt="Recommended layout for your page"/>

The main blue element will be your `.DocSearch-content` container. More details in the following guidelines.

### Use the right classes as [selectors][2]

You can add some specific static classes to help us find your content role. These classes can not involve any style changes. These dedicated classes will help us to create a great learn-as-you-type experience from your documentation.

- Add a static class `DocSearch-content` to the main container of your textual content. Most of the time, this tag is a `<main>` or an `<article>` HTML element.

- Every searchable `lvl` element outside this main documentation container (for instance in a sidebar) must be a `global` selector. They will be globally picked up and injected to every record built from your page. Be careful, the level value matters and every matching element must have an increasing level along the HTML flow. A level `X` (for `lvlX`) should appear after a level `Y` while `X > Y`.

- `lvlX` selectors should use the standard title tags like `h1`, `h2`, `h3`, etc. You can also use static classes. Set a unique `id` or `name` attribute to these elements as detailed below.

- Every DOM elements matching the `lvlX` selectors must have a unique `id` or `name` attribute. This will help the redirection to directly scroll down to the exact place of the matching elements. These attributes define the right anchor to use.

- Every textual element (selector `text`) must be wrapped in a `<p>` or `<li>` tag. This content must be atomic and split into small entities. Be careful to never nest one matching element into another one as it will create duplicates.

- Stay consistent and do not forget that we need to have some consistency along the HTML flow [as presented here][1].

## Introduce global information as meta tags

Our crawler automatically extracts information from our DocSearch specific meta tags:

```html
<meta name="docsearch:language" content="en" />
<meta name="docsearch:version" content="1.0.0" />
```

The crawl adds the `content` value of these `meta` tags to all records extracted from the page. The meta tags `name` must follow the `docsearch:$NAME` pattern. `$NAME` is the name of the attribute set to all records.

You can then [transform these attributes as `facetFilters`][3] to filter over them from the UI. You will need to set the setting `attributesForFaceting` of the Algolia index. You need to submit a PR on your associated configuration via [the DocSearch `custom_settings` setting][4].

```json
"custom_settings": {
  "attributesForFaceting": ["language", "version"]
}
```

It enables you to filter on the value of these meta tags. The following example shows how to update the JavaScript snippet to retrieve records from these pages.

```js
docsearch({
  […],
  algoliaOptions: {
    'facetFilters': ["language:en", "version:1.0.0"]
  },
  […],
});
```

The `docsearch:version` meta tag can be a set [of comma-separated tokens][5], each of which is a version relevant to the page. These tokens must be compliant with [the SemVer specification][6] or only contain alphanumeric characters (e.g. `latest`, `next`, etc.). As facet filters, these version tokens are case-insensitive.

For example, all records extracted from a page with the following meta tag:

```html
<meta name="docsearch:version" content="2.0.0-alpha.62,latest" />
```

The `version` attribute of these records will be :

```json
version:["2.0.0-alpha.62" , "latest"]
```

## Nice to have

- Your website should have [an updated sitemap][7]. This is key to let our crawler know what should be updated. Do not worry, we will still crawl your website and discover embedded hyperlinks to find your great content.

- Every page needs to have their full context available. Using global elements might help (see above).

- Make sure your documentation content is also available without JavaScript rendering on the client-side. If you absolutely need JavaScript turned on, you need to [set `js_render: true` in your configuration][8].

Any questions? Connect with us on [Discord][9] or let our [support][10] team know.

[1]: /docs/legacy/how-do-we-build-an-index
[2]: /docs/legacy/config-file#selectors
[3]: https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/
[4]: /docs/legacy/config-file#custom_settings-optional
[5]: https://html.spec.whatwg.org/dev/common-microsyntaxes.html#comma-separated-tokens
[6]: https://semver.org/
[7]: https://www.sitemaps.org/
[8]: /docs/legacy/config-file#js_render-optional
[9]: https://alg.li/discord
[10]: https://support.algolia.com/
