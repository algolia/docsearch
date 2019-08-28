---
layout: two-columns
title: Config Files
---

For each DocSearch request we receive, we create a custom JSON configuration
file that defines how the crawler should behave. You can find all the configs in
[this repository][1].

A DocSearch looks like this:

```json
{
  "index_name": "example",
  "start_urls": ["https://www.example.com/docs"],
  "selectors": {
    "lvl0": "#content header h1",
    "lvl1": "#content article h1",
    "lvl2": "#content section h3",
    "lvl3": "#content section h4",
    "lvl4": "#content section h5",
    "lvl5": "#content section h6",
    "text": "#content header p,#content section p,#content section ol"
  }
}
```

## `index_name`

This is the name of the Algolia index where your records will be pushed. The
`apiKey` we will share with you is restricted to work with this index.

When using the free DocSearch crawler, the `indexName` will always be the name
of the configuration file. If you're running DocSearch yourself, you can use any
name you'd like.

```json
{
  "index_name": "example"
}
```

When the DocSearch scraper runs, it builds a temporary index. Once scraping is
complete, it moves that index to the name specified by `index_name` (replacing
the existing index).

By default, the name of the temporary index is the value of `index_name` +
_\_tmp_.

To use a different name, set the `INDEX_NAME_TMP` environment variable to a
different value. This variable can be set in the .env file alongside
`APPLICATION_ID` and `API_KEY`.

## `start_urls`

This array contains the list of URLs that will be used to start crawling your
website. The crawler will recursively follow any links (`<a>` tags) from those
pages. It will not follow links that are on another domain and never follow
links matching `stop_urls`.

```json
{
  "start_urls": ["https://www.example.com/docs"]
}
```

### `selectors_key`, tailor your selectors

You can define finer sets of selectors depending on the URL. You need to use the
parameter `selectors_key` from your `start_urls`.

```json
{
  "start_urls": [
    {
      "url": "http://www.example.com/docs/faq/",
      "selectors_key": "faq"
    },
    {
      "url": "http://www.example.com/docs/"
    }
  ],
  […],
  "selectors": {
    "default": {
      "lvl0": ".docs h1",
      "lvl1": ".docs h2",
      "lvl2": ".docs h3",
      "lvl3": ".docs h4",
      "lvl4": ".docs h5",
      "text": ".docs p, .docs li"
    },
    "faq": {
      "lvl0": ".faq h1",
      "lvl1": ".faq h2",
      "lvl2": ".faq h3",
      "lvl3": ".faq h4",
      "lvl4": ".faq h5",
      "text": ".faq p, .faq li"
    }
  }
}
```

To find the right subset to use based on the URL, the scraper iterates over
these `start_urls` items. Only the first one to match is applied.

Considering the URL `http://www.example.com/en/api/` with the configuration:

```json
{
  "start_urls": [
    {
      "url": "http://www.example.com/doc/",
      "selectors_key": "doc"
    },
    {
      "url": "http://www.example.com/doc/faq/",
      "selectors_key": "faq"
    },
   […],
  ]
}
```

Only the set of selectors related to `doc` will be applied to the URL. The
correct configuration should be built the other way around (as primarily
described).

If one `start_urls` item has no `selectors_key` defined, the `default` set will
be used. Do not forget to set this fallback set of selectors.

### Using regular expressions

The `start_urls` and `stop_urls` options also enable you to use regular
expressions to express more complex patterns. This object must at least contain
a `url` key targeting a reachable page.

You can also define a `variables` key that will be injected into your specific
URL pattern. The following example makes this variable feature clearer:

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

The beneficial side effect of using this syntax is that every record extracted
from pages matching `http://www.example.com/docs/en/latest` will have attributes
`lang: en` and `version: latest`. It enables you to filter on [these
`facetFilters`][2].

The following example shows how the UI filters results matching a specific
language and version.

```js
docsearch({
  […],
  algoliaOptions: {
    'facetFilters': ["lang:en", "version:latest"]
  },
  […],
});
```

### Using custom tags

You can also apply custom tags to some pages without the need to use regular
expressions. In that case, add the list of tags to the `tags` key. Note that
those tags will be automatically added as facets in Algolia, allowing you to
filter based on their values as well.

```json
{
  "start_urls": [
    {
      "url": "http://www.example.com/docs/concepts/",
      "tags": ["concepts", "terminology"]
    }
  ]
}
```

From the JS snippet:

```js
docsearch({
  […],
  algoliaOptions: {
    'facetFilters': ["tags:concepts"]
  },
});
```

### Using Page Rank

To give more weight to some pages. This parameter helps to boost records built
from the page. Pages with highest `page_rank` will be returned before pages with
a lower `page_rank`. Note that you can pass any numeric value, including
negative values.

```json
{
  "start_urls": [
    {
      "url": "http://www.example.com/docs/concepts/",
      "page_rank": 5
    },
    {
      "url": "http://www.example.com/docs/contributors/",
      "page_rank": 1
    }
  ]
}
```

In this example, records built from the _Concepts_ page will be ranked higher
than results extracted from the _Contributors_ page.

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
  ],
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
record hierarchy. It can contain up to 6 levels (`lvl0`, `lvl1`, `lvl2`, `lvl3`,
`lvl4`, `lvl5`) and `text`.

A default config would be to target the page `title` or `h1` as `lvl0`, the `h2`
as `lvl1`, `h3` as `lvl2`, and `p` as `text`, but this is highly dependent on
the markup.

The `text` key is mandatory, but we highly recommend setting also `lvl0`, `lvl1`
and `lvl2` to have a decent depth of relevance.

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
  }
}
```

Selectors can be passed as strings, or as objects containing a `selector` key.
Other special keys can be set, as documented below.

```json
{
  "selectors": {
    "lvl0": {
      "selector": "#content header h1"
    }
  }
}
```

### Using global selectors

The default way of extracting content through selectors is to read the HTML
markup from top to bottom. This works well with semi-structured content, like a
hierarchy of headers. This breaks when the relevant information is not part of
the same flow. For example when the title is not part of a header or sidebar.

For that reason, you can set a selector as global, meaning that it will match on
the whole page and will be the same for all records extracted from this page.

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

We do not recommend `text` selectors to be global.

### Setting a default value

If a selector doesn't match a valid element on the page, you can define a
`default_value` as a fallback.

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

Some documentation adds special characters to headings, like `#` or `›`. Those
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

Note that you can also define `strip_chars` directly at the root of the
configuration and it will be applied to all selectors.

```json
{
  "strip_chars": "#›"
}
```

### Targeting elements using XPath instead of CSS

CSS selectors are a clear and concise way to target elements of a page, but they
have a limitations. For example, you cannot go up the cascade with CSS.

If you need a more powerful selector mechanism, you can write your selectors
using XPath by setting `type: xpath`.

The following example will look for a `li.chapter.active.done` and then go up
two levels in the DOM until it finds a `a`. The content of this `a` will then be
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

### `custom_settings` _Optional_

This key can be used to overwrite your Algolia index settings. We don't
recommend changing it as the default settings are meant to work for all
websites.

### `custom_settings.separatorsToIndex`_Optional_

One use case would be to configure the `separatorsToIndex` setting. By default
Algolia will consider all special characters as a word separator. In some
contexts, like for method names, you might want `_`, `/` or `#` to keep their
meaning.

```json
{
  "custom_settings": {
    "separatorsToIndex": "_/"
  }
}
```

Check the [Algolia documentation][3] for more information about the Algolia
settings.

### `custom_settings.synonyms` _Optional_

`custom_settings` can include a synonyms key that is an array of synonyms. This
array includes up to 20 elements. Each element is an array of one-word synonyms
which can be used interchangeably.

For example:

```json
"custom_settings": {
    "synonyms": [
      [
        "js",
        "javascript"
      ],
      [
        "es6",
        "ECMAScript6",
        "ECMAScript2015"
      ]
    ]
  },
```

_Note that you can use [advanced synonym thanks to Algolia][4]. Our scraper only
supports regular one-word synonyms._

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

This can be used to remove a table of content, a sidebar, or a footer, to make
other selectors easier to write.

```json
{
  "selectors_exclude": [".footer", "ul.deprecated"]
}
```

### `stop_urls` _Optional_

This is an array of strings or regular expressions. Whenever the crawler is
about to visit a link, it will first check if the link matches something in the
array. If it does, it will not follow the link. This should be used to restrict
pages the crawler should visit.

Note that this is often used to avoid duplicate content, by adding
`http://www.example.com/docs/index.html` if you already have
`http://www.example.com/docs/` as a `start_urls`.

```json
{
  "stop_urls": ["https://www.example.com/docs/index.html", "license.html"]
}
```

### `min_indexed_level` _Optional_

The default value is `0`. By increasing it, you can choose not to index some
records if they don't have enough `lvlX` matching. For example, with a
`min_indexed_level: 2`, the scraper indexes temporary records having at least
`lvl0`, `lvl1` and `lvl2` set. You can [find out more details about this
strategy in this section][5].

This is useful when your documentation has pages that share the same `lvl0` and
`lvl1` for example. In that case, you don't want to index all the shared
records, but want to keep the content different across pages.

```json
{
  "min_indexed_level": 2
}
```

### `only_content_level` _Optional_

When `only_content_level` is set to `true`, then the crawler won't create
records for the `lvlX` selectors.

If used, `min_indexed_level` is ignored.

```json
{
  "only_content_level": true
}
```

### `nb_hits` _Special_

The number of records that were extracted and indexed by DocSearch. We check
this key internally to keep track of any unintended spike or drop that could
reveal a misconfiguration.

`nb_hits` is updated automatically each time you run DocSearch on your config.
If the term is a tty, DocSearch will prompt you before updating the field. To
avoid being prompted, set the `UPDATE_NB_HITS` environment variable to `true`
(to enable) or `false` (to disable). This variable can be set in the .env file
alongside `APPLICATION_ID` and `API_KEY`.

You don't have to edit this field. We're documenting it here in case you were
wondering what it's all about.

## Sitemaps

If your website has a `sitemap.xml` file, you can let DocSearch know and it will
use it to define which pages to crawl.

### `sitemap_urls` _Optional_

You can pass an array of URLs pointing to your sitemap(s) files. If this value
is set, DocSearch will try to read URLs from your sitemap(s) instead of
following every link of your `starts_urls`.

```json
{
  "sitemap_urls": ["http://www.example.com/docs/sitemap.xml"]
}
```

You must explicitly defined this parameter, our scraper doesn't follow
`robots.txt`

### `sitemap_alternate_links` _Optional_

Sitemaps can contain _alternative links_ for URLs. Those are other versions of
the same page, in a different language, or with a different URL. By default
DocSearch will ignore those URLs.

Set this to `true` if you want those other versions to be crawled as well.

```json
{
  "sitemap_urls": ["http://www.example.com/docs/sitemap.xml"],
  "sitemap_alternate_links": true
}
```

With the above configuration and the `sitemap.xml` below, both
`http://www.example.com/docs/` and `http://www.example.com/docs/de/` will be
crawled.

```xml
  <url>
    <loc>http://www.example.com/docs/</loc>
    <xhtml:link rel="alternate" hreflang="de" href="http://www.example.com/de/"/>
  </url>
```

## JavaScript rendering

By default DocSearch expects websites to have server-side rendering, meaning
that HTML source is returned directly by the server. If your content is
generated by the front-end, you have to tell DocSearch to emulate a browser
through Selenium.

_As client-side crawl is way slower than server-side crawl, we highly encourage
you to update your website to enable server-side rendering._

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

Note that this option might have a large impact on the time required to crawl
your website and we would encourage you to enable server-side rendering on your
website instead.

This option has no impact if `js_render` is set to `false`.

```json
{
  "js_render": true,
  "js_wait": 2
}
```

### `use_anchors` _Optional_

Websites using client-side rendering often don't use full URLs, but instead take
advantage of the URL hash (the part after the `#`).

If your website is using such URLs, you should set `use_anchors` to `true` for
DocSearch to index all your content.

```json
{
  "js_render": true,
  "use_anchors": true
}
```

### `user_agent` _Optional_

You can override the user agent used to crawl your website. By default, this
value is:

      Algolia DocSearch Crawler

However, if the crawl of your website requires a browser emulation (i.e.
`js_render=true`), our `user_agent` is:

    Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/71.0.3578.98 Safari/537.36

To override it, from the configuration:

```json
{
  "user_agent": "Custom Bot"
}
```

[1]: https://github.com/algolia/docsearch-configs/tree/master/configs
[2]: https://www.algolia.com/doc/api-reference/api-parameters/facetFilters/
[3]: https://www.algolia.com/doc/api-reference/settings-api-parameters/
[4]:
  https://www.algolia.com/doc/guides/managing-results/optimize-search-results/adding-synonyms/#the-different-types-of-synonyms
[5]: https://www.algolia.com/doc/api-reference/settings-api-parameters/
