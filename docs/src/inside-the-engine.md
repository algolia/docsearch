---
layout: two-columns
title: Inside the engine
---

This page will explain in more detail how the crawler extracts content from your
page every 24h, and how it ranks the results.

## Crawling

Each crawl will begin its journey by the value of the `start_urls` you have in
your config. It will read those pages and recursively extract and follow every
link in those pages until it has browsed every compliant page.

If you have explicitly defined a `sitemap.xml`, our crawler will scrap every
provided and compliant page. We do recommend using [a sitemap][1] since it
clearly exposes URLs to crawl and avoid missing pages that aren't linked from
another one.

## Extracting content

Building records using the scraper is pretty intuitive. According to your
settings, we extract the payload of your web page and index it, preserving your
data's structure. This is achieved in a simple way:

- We **read top down** your web page following your HTML flow and pick out your
  matching elements according to their **levels** based on the `selectors_level`
  defined.
- We create a record for each paragraph along with its hierarchical path. This
  construction is based on their **time of appearance** along the flow.
- We **index** these records with the appropriate global settings (e.g.
  metadata, tags, etc.)

_**Note:** The above process performs sanity tests as it scrapes, in order to
detect errors. If indeed there are any serious warnings, it will abort and hence
not overwrite your current index. These checks ensure that your dedicated index
isn't flushed._

## Ranking records

Algolia always returns the most relevant results first, using a [tie-breaking
approach][2]. DocSearch will first search for exact matches in your keywords
then fallback to partial matches. Those results will then be ordered based, once
again, on the page hierarchy, as extracted from the `selectors`.

The default strategy is to promote records having matching words in the highest
level first. Thus if two results have the same matching words, the one having
them in the highest level (lvl0) will be ranked higher. We also use the
position of the matching words. The sooner they appear within the HTML flow, the
higher the record will be ranked.

The relevancy is based on several factors and can be customized according to the
Algolia tie-breaking method.

You can boost pages depending on their URLs. This is done from the `start_urls`
and its `page_rank` attributes. It is a numeric value (defaults to 0). The higher
it is, the higher results from the matching pages will be ranked. For example
all pages with a `page_rank` of 5 will be returned before pages with a
`page_rank` of 1.

You could even change the relevancy strategy by [overwriting the default
`customRanking`][3] used by the index by using the `custom_settings` option of
your config.

[1]: https://www.sitemaps.org/
[2]:
  https://www.algolia.com/doc/guides/ranking/ranking-formula/#tie-breaking-approach
[3]: https://www.algolia.com/doc/guides/ranking/custom-ranking/
