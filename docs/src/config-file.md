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

## ``index_name``

This is the name of the Algolia index where your records will be pushed. The
`apiKey` we will share with you will be restricted to work on this index.

When using the free DocSearch crawler, the `indexName` will always be the name
of the config. If you're running DocSearch yourself, you can of course use any
name you'd like.

```json
{
  "index_name": "example"
}
```

## `start_urls`

This array contains the list of urls that will be used to start crawling your
website. The crawler will recursively follow any links on those pages. It will
not follow links that are on another domain (unless they are allowed in
`allowed_domains`) and never follow links defined in `stop_urls`.

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

<<<<<<< HEAD
We mostly attribute it on our own regarding plenty of underlying factors. The `apiKey` that we provide is generated with a restriction on the `index_name`. Changing the `index_name` would require to ask for a new key. Thus if you want to **change the name**, please **submit a new configuration**, we will generate a new key accordingly.
### `start_urls` _Mandatory_
You can pass either a string or an array of urls. The crawler will go to each
page in order, following every link it finds on the page. It will only stop if
the domain is outside of the `allowed_domains` or if the link is blacklisted from the `stop_urls`.

Note that we currently do not follow *301* redirects.
=======
The beneficial side effect of using this syntax is that all records that will
then be extracted from crawling `http://www.example.com/docs/en/latest` will have
`lang: en` and `version: latest` added to it, allowing you to then filter based on
those values.

The following example shows how you can filter results matching specifics
language and version from the front-end

```js
docsearch({
  […],
  algoliaOptions: {
    'facetFilters': ["lang:en", "version:latest"]
  },
});
```
>>>>>>> Updating config doc

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

If you want to give more weight to some pages to boost their ranking in the
results, you can attribute a custom `page_rank` to specific urls. Pages with
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

<<<<<<< HEAD
### `start_urls.tags`

Tags will be apllied to every record from the matchin matched pages, i.e., its URL is matchin the `url`. These `tags` will [be processed as `attributesForFaceting`](https://www.algolia.com/doc/api-reference/api-parameters/attributesForFaceting/) . If you want further detail, [check the original documentation](https://www.algolia.com/doc/api-reference/api-parameters/facetFilters/).
We do recommend to use `tags` if you want [to refine the scope of your search](https://www.algolia.com/doc/guides/searching/faceting/#faceting-overview).
=======
Here, all documentation pages will use the selectors defined in
`selectors.default` while the page under `./concepts` will use
`selectors.concepts` and those under `./contributors` will use
`selectors.contributors`.
>>>>>>> Updating config doc

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

### `allowed_domains` _Optional_

You can pass an array of strings. This is the whitelist of
domains the crawler will browse. If a link targets a page that is not in the
whitelist, the crawler will not follow it.

### `min_indexed_level` _Optional_

The default value is `0`. By increasing it, you can chose to not index some
records if they don't have enough `lvlX` matching. For example, with
a `min_indexed_level: 2`, records that have at least `lvl0`, `lvl1` and
`lvl2` matching something will be indexed.

This is useful when your documentation has pages that share the same `lvl0` and
`lvl1` for example. In that case, you don't want to index all the shared
records, but want to keep the one matching content that is different across
pages.

### `scrape_start_urls` _Optional_

By default, the crawler will not extract content from the pages defined in
`starts_urls`.  If you have valuable content on your homepage, you should set
this to `true`.

```json
{
  "scrape_start_urls": true
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

## Using a sitemap

### `sitemap_urls` _Optional_

You can pass an array of urls pointing to your sitemap(s) files. If this value
is set, DocSearch will try to read urls from your sitemap(s) instead of
following every link of your `starts_urls`.

```json
{
  "sitemap_urls": [
    "http://www.example.com/docs/sitemap.xml"
  ],
}
```

### `sitemap_alternate_links` _Optional_

Sitemaps can contain _alternative links_ for urls. Those are other versions of
the same page, in a different language, or with a different url. By default
DocSearch will ignore those urls.

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

```
<url>
  <loc>http://www.example.com/docs/</loc>
  <xhtml:link rel="alternate" hreflang="de" href="http://www.example.com/de/"/>
</url>
```

























### `only_content_level` _Optional_

When `only_content_level` is set to `true`, we only index builded records which match the `text` selectors. Every other record will be skipped. This parameter is more flexible than `min_indexed_level`. Once `only_content_level` is used, `min_indexed_level` becomes pointless.

Default is `false`

### `js_render` _Optional_

The HTML code that we crawl is sometimes generated using Javascript. In those
cases, the `js_render` option must be set to `true`. It will enable our
internal proxy (Selenium) to render pages before crawling them.

We highly recommend avoiding client-side rendering. It mainly decreases [the performance of your website][3].

Default is `false`

### `js_wait` _Optional_

When `js_render` is set to `true`, the `js_wait` parameter lets you change the default waiting time (in seconds) to render the
webpage with the Selenium emulator.

Default is `0`s

### `use_anchors` _Optional_

The `use_anchors` needs to be set to True for a javascript doc when the hash is
used to route the query. Internally, this will disable the canonicalize feature that
is removing the hash from the url.

This parameter is optional and is set to `false` by default.

### `strip_chars` _Optional_

A list of characters to remove from the indexed text.

You can also override the default `strip_chars` per level

```json
"selectors": {
  "lvl0": {
    "selector": "#content article h1",
    "strip_chars": " .,;:"
  }
}
```

### `nb_hits` _Mandatory_

Each time the configuration is locally run, this attribute is set to the number of records indexed.

This attribute is used for purposed monitoring. We keep a track of its evolution in order to detect main changes.
Default is `0`.

### `custom_settings` _Optional_

This object is [any custom Algolia settings][4] you would like to pass to the index
settings. You will [look under the hood of algolia][5].

### `nb_hits_max` _Optional_

The number of maximum records allowed for the whole indexing. If the scrapping is bigger, it will fail.

This value is not meant to be set from anyone except DocSearch maintainer.

Default is `600 000` (arbitrary, might change)

## Possible issues

### Duplicated content

It could happen that the crawled website returned duplicated data. Most of the time, this is because the crawled pages got the same urls with two different schemes.

If we have URLs like `http://website.com/page` and `http://website.com/page/` (notice the second one ends with `/`), the scraper will consider them as different. This can be fixed by adding a regex to the `stop_urls` in the `config.json`:

```json
"stop_urls": [
  "/$"
]
```

In this attribute, you can also list the pages you want to skip:

```json
"stop_urls": [
  "http://website.com/page/"
]
```

### Anchors

The scraper will also consider pages with anchors as different pages. Make sure you remove any hash sign from the urls that you put in the stop & start URLs:

*Bad:*

```json
"stop_urls": [
  "http://website.com/page/#foo"
]
```

*Good:*

```json
"stop_urls": [
  "/$"
]
```

Or :

```json
"stop_urls": [
  "http://website.com/page/"
]
```


[1]: https://github.com/algolia/docsearch-configs/tree/master/configs
[2]: https://github.com/algolia/docsearch-configs/issues/83)
[3]: https://medium.com/walmartlabs/the-benefits-of-server-side-rendering-over-client-side-rendering-5d07ff2cefe8
[4]: https://www.algolia.com/doc/api-client/settings/#the-scope-of-settings-and-parameters
[5]: https://www.algolia.com/doc/
