---
layout: two-columns
title: Config Files
---

For each DocSearch request we receive, we'll create a custom JSON config file
that will define how the crawler should behave. You can find all the configs in
[this repository][1].

A DocSearch looks like this:

```json
{
  "index_name": "example",
  "start_urls": [
    "https://www.example.com/docs"
  ],
  "selectors": {
    "lvl0": "#content header h1",
    "lvl1": "#content article h1",
    "lvl2": "#content section h3",
    "lvl3": "#content section h4",
    "lvl4": "#content section h5",
    "lvl5": "#content section h6",
    "text": "#content header p,#content section p,#content section ol"
  },
}
```

## `index_name`

This is the name of the Algolia index where your records will be pushed. The
`apiKey` we will share with you will be restricted to work on this index.

When using the free DocSearch crawler, the `indexName` will always be the name
of the config. If you're running DocSearch yourself, you can use any name you'd
like.

```json
{
  "index_name": "example"
}
```

## `start_urls`

This array contains the list of URLs that will be used to start crawling your
website. The crawler will recursively follow any links on those pages. It will
not follow links that are on another domain and never follow links defined in `stop_urls`.

```json
{
  "start_urls": [
    "https://www.example.com/docs"
  ]
}
```

### Using regular expressions

The `start_urls` option also allows for passing an object in place of a string,
to express more complex patterns. This object must contain a `url` key
containing the regular expression matching the url, as well as a `variables` key
that will be used to replace the named matches.

The following example will make it clearer:

```json
{
  "start_urls": [
     {
       "url": "http://www.example.com/docs/(?P<lang>.*?)/(?P<version>.*?)/",
       "variables": {
         "lang": ["en", "fr"],
         "version": ["latest", "3.3", "3.2"]
       }
     }
   ]
}
```

The beneficial side effect of using this syntax is that all records that will
then be extracted from crawling `http://www.example.com/docs/en/latest` will
have `lang: en` and `version: latest` added to it, allowing you to then filter
based on those values.

The following example shows how you can filter results matching specifics
language and version from the frontend

```js
docsearch({
  […],
  algoliaOptions: {
    'facetFilters': ["lang:en", "version:latest"]
  },
});
```

### Using custom tags

You can also apply custom tags to some pages without the need to use regular
expressions. In that case, add the list of tags to the `tags` key. Note
that those tags will be automatically added as facets in Algolia, allowing you
to filter based on their values as well.

```json
{
  "start_urls": [
    {
      "url": "http://www.example.com/docs/concepts/",
      "tags": ['concepts', 'terminology']
    }
 ]
}
```

```js
docsearch({
  […],
  algoliaOptions: {
    'facetFilters': ["tags:concepts"]
  },
});
```

### Using Page Rank

To give more weight to some pages to boost their ranking in the
results, you can attribute a custom `page_rank` to specific URLs. Pages with
highest `page_rank` will be returned before pages with a lower `page_rank`. Note
that you can pass any numeric value, including negative values.

```json
{
  "start_urls": [
    {
      "url": "http://www.example.com/docs/concepts/",
      "page_rank": 5,
    },
    {
      "url": "http://www.example.com/docs/contributors/",
      "page_rank": 1,
    }
  ]
}
```

In this example, results extracted from the _Concepts_ page will be ranked
higher than results extracted from the _Contributors_ page.

### Using custom selectors per page

If the markup of your website is so different from one page to another that you
can't have generic selectors, you can namespace your selectors and specify which
set of selectors should be applied to specific pages.

```json
{
  "start_urls": [
    "http://www.example.com/docs/",
    {
      "url": "http://www.example.com/docs/concepts/",
       "selectors_key": "concepts"
    },
    {
      "url": "http://www.example.com/docs/contributors/",
       "selectors_key": "contributors"
    }
  ]
   "selectors": {
     "default": {
       "lvl0": ".main h1",
       "lvl1": ".main h2",
       "lvl2": ".main h3",
       "lvl3": ".main h4",
       "lvl4": ".main h5",
       "text": ".main p"
      },
     "concepts": {
       "lvl0": ".header h2",
       "lvl1": ".main h1.title",
       "lvl2": ".main h2.title",
       "lvl3": ".main h3.title",
       "lvl4": ".main h5.title",
       "text": ".main p"
     },
     "contributors": {
       "lvl0": ".main h1",
       "lvl1": ".contributors .name",
       "lvl2": ".contributors .title",
       "text": ".contributors .description"
     }
   }
}
```

Here, all documentation pages will use the selectors defined in
`selectors.default` while the page under `./concepts` will use
`selectors.concepts` and those under `./contributors` will use
`selectors.contributors`.

## `selectors`

This object contains all the CSS selectors that will be used to create the
record hierarchy. It can contains up to 6 levels (`lvl0`, `lvl1`, `lvl2`,
`lvl3`, `lvl4`, `lvl5`) and `text`.

A default config would be to target the page `title` or `h1` as `lvl0`, the `h2`
as `lvl1` and `h3` as `lvl2` and  `p` as `text`, but this is highly dependent on
the markup.

The `text` key is mandatory, but we highly recommend setting also `lvl0`, `lvl1`
and `lvl2` to have a decent level of relevance.

```json
{
  "selectors": {
    "lvl0": "#content header h1",
    "lvl1": "#content article h1",
    "lvl2": "#content section h3",
    "lvl3": "#content section h4",
    "lvl4": "#content section h5",
    "lvl5": "#content section h6",
    "text": "#content header p,#content section p,#content section ol"
  },
}
```

Selectors can be passed as string, or as objects containing a `selector` key.
Other special keys can be set, as documented below.

```json
{
  "selectors": {
    "lvl0": {
      "selector": "#content header h1",
    }
  }
}
```

### Using global selectors

The default way of extracting content through selectors is to read the HTML
markup from top to bottom. This works well with semi-structured content, like
a hierarchy of headers. This breaks when relevant information is not part of the
same node flow. For example when the title is in a header or a sidebar.

For that reason, you can set a selector as global, meaning that it will match on
the whole page, and will be the same for all records extracted on this page.

```json
{
  "selectors": {
    "lvl0": {
      "selector": "#content header h1",
      "global": true
    }
  }
}
```

### Setting a default value

If your selector might not match a valid element on the page, you can define
a `default_value` to fallback to.

```json
{
  "selectors": {
    "lvl0": {
      "selector": "#content header h1",
      "default_value": "Documentation"
    }
  }
}
```

### Removing unnecessary characters

Some documentations add special characters to headings, like `#` or `›`. Those
characters have a stylistic value but no meaning and shouldn't be indexed in the
search results.

You can define a list of characters you want to exclude from the final indexed
value by setting the `strip_chars` key.

```json
{
  "selectors": {
    "lvl0": {
      "selector": "#content header h1",
      "strip_chars": "#›"
    }
  }
}
```

Note that you can also define `strip_chars` directly at the root of the config
and it will be applied to all selectors.

```json
{
  "strip_chars": "#›"
}
```

### Targeting elements using XPath instead of CSS

CSS selectors are a clear and concise way to target elements of a page, but they
have a limitations. For example, you cannot go _up_ the cascade with CSS.

If you need a more powerful selector mecanism, you can write your selectors
using XPath by setting `type: xpath`. You should also set `global: true` on the
same selector.

The following example will look for a `li.chapter.active.done` and then go up
two levels in the DOM until it found a `a`. The content of this `a` will then be
used as the value of the `lvl0` selector.

```json
{
  "selectors": {
    "lvl0": {
      "selector": "//li[@class=\"chapter active done\"]/../../a",
      "type": "xpath",
      "global": true
    }
  }
}
```

XPath selector can be hard to read. We highly encourage you to test them in your
browser first, making sure they match what you're expecting.

## Other options

### `custom_settings` _Optional_

This key can be used to overwrite your Algolia index settings. We don't
recommend changing it as the default settings are meant to work for all
websites.

One use case would be to configure the `separatorsToIndex` setting. By default
Algolia will consider all special character as a word separator. In some
contexts, like for method names, you might want `_`, `/` or `#` to keep their
meaning.

```json
{
  "custom_settings": {
    "separatorsToIndex": "_/"
  }
}
```

Check the [Algolia documentation][2] for more information on the settings.

### `min_indexed_level` _Optional_

The default value is `0`. By increasing it, you can chose to not index some
records if they don't have enough `lvlX` matching. For example, with
a `min_indexed_level: 2`, records that have at least `lvl0`, `lvl1` and
`lvl2` matching something will be indexed.

This is useful when your documentation has pages that share the same `lvl0` and
`lvl1` for example. In that case, you don't want to index all the shared
records, but want to keep the content different across pages.

```json
{
  "min_indexed_level": 2
}
```

### `nb_hits` _Special_

`nb_hits` automatically updated by DocSearch every time it runs your config. It
is set to the number of records that were extracted and indexed. We check this
key internally to keep track of any unintended spike or drop that could reveal
a misconfiguration.

You don't have to touch it, we're documenting it here in case you were
wondering what this was about.

### `only_content_level` _Optional_

When `only_content_level` is set to `true`, then the crawler won't create
records for the `lvlX` selectors.

If used, `min_indexed_level` is ignored.

```json
{
  "only_content_level": true
}
```

### `scrape_start_urls` _Optional_

By default, the crawler will extract content from the pages defined in
`start_urls`. If you do not have any valuable content on your `starts_urls` or
if it's a duplicate of another page, you should set this to `false`.

```json
{
  "scrape_start_urls": false
}
```

### `selectors_exclude` _Optional_

This expects an array of CSS selectors. Any element matching one of those
selectors will be removed from the page before any data is extracted from it.

This can be  used to remove a table of content, a sidebar or a footer, to
make other selectors easier to write.

```json
{
  "selectors_exclude": [
    ".footer",
    "ul.deprecated"
  ],
}
```

### `stop_urls` _Optional_

This an array of strings or regular expressions. Whenever the crawler is about
to visit a link, it will first check if the link matches something in the array.
If it does, it will not follow the link. This should be used to restrict pages
the crawler should visit.

Note that this is often used to avoid duplicate content, by adding
`http://www.example.com/docs/index.html` if you already have
`http://www.example.com/docs/` as a `start_urls`.

```json
{
  "stop_urls": [
    "https://www.example.com/docs/index.html",
    "license.html"
  ],
}
```

## Sitemaps

If your website has a `sitemap.xml` file, you can let DocSearch know and it will
use it to define which pages to crawl.

### `sitemap_urls` _Optional_

You can pass an array of URLs pointing to your sitemap(s) files. If this value
is set, DocSearch will try to read URLs from your sitemap(s) instead of
following every link of your `starts_urls`.

```json
{
  "sitemap_urls": [
    "http://www.example.com/docs/sitemap.xml"
  ],
}
```

### `sitemap_alternate_links` _Optional_

Sitemaps can contain _alternative links_ for URLs. Those are other versions of
the same page, in a different language, or with a different URL. By default
DocSearch will ignore those URLs.

Set this to `true` if you want those other version to be crawled as well.

```json
{
  "sitemap_urls": [
    "http://www.example.com/docs/sitemap.xml"
  ],
  "sitemap_alternate_links": true
}
```

With the above config and the `sitemap.xml` below, both
`http://www.example.com/docs/` and `http://www.example.com/docs/de/` will be
crawled.

```html
  <url>
    <loc>http://www.example.com/docs/</loc>
    <xhtml:link rel="alternate" hreflang="de" href="http://www.example.com/de/"/>
  </url>
```

## JavaScript rendering

By default DocSearch expect websites to have server-side rendering, meaning that
HTML source is returned directly by the server. If your content is generated by the
front-end, you have to tell DocSearch to emulate a browser through Selenium.

_As client-side crawling is way slower than server-side crawling, we highly
encourage you to update your website to enable server-side rendering._

### `js_render` _Optional_

Set this value to true if your website requires client-side rendering. This will
make DocSearch spawn a Selenium proxy to fetch all your web pages.

```json
{
  "js_render": true
}
```

### `js_wait` _Optional_

If your website is slow to load, you can use `js_wait` to tell DocSearch to wait
a specific amount of time (in seconds) for the page to load before extracting
its content.

Note that this option might have a large impact on the time required
to crawl your website and we would encourage you to enable server-side rendering
on your website instead.

This option has no impact if `js_render` is set to `false`.

```json
{
  "js_render": true,
  "js_wait": 2
}
```

### `use_anchors` _Optional_

Websites using client-side rendering often don't use full urls, but instead take
advantage of the URL hash (the part after the `#`).

If your website is using such urls, you should set `use_anchors` to `true` for
DocSearch to index all your content.

```json
{
  "js_render": true,
  "use_anchors": true
}
```

[1]: https://github.com/algolia/docsearch-configs/tree/master/configs

[2]: https://www.algolia.com/doc/api-reference/settings-api-parameters/
