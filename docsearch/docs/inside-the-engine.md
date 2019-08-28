---
id: engine
title: Inside the engine
---

This page will explain in more detail how the crawler extracts content from your
page every 24h, and how it ranks the results.

## Crawling

Each crawl will begin its journey by the value of the `start_urls` you have in
your config. It will read those pages and recursively extract and follow every
link in those pages until it has browsed every compliant page.

If you have explicitly defined a `sitemap.xml`, our crawler will scrape every
provided and compliant page. We do recommend using [a sitemap][1] since it
explicitly exposes URLs to crawl and avoid missing pages that aren't linked from
another one.

## Extracting content

Building records using the scraper is pretty intuitive. According to your
settings, we extract the payload of your web page and index it, preserving your
data's structure. It achieves this in a simple way:

- We **read top down** your web page following your HTML flow and pick out your
  matching elements according to their **levels** based on the `selectors_level`
  defined.
- We create a record for each paragraph along with its hierarchical path. This
  construction is based on their **time of appearance** along the flow.
- We **index** these records with the appropriate global settings (e.g.
  metadata, tags, etc.)

_**Note:** The above process performs sanity tests as it scrapes to detect
errors. If indeed there are any serious warnings, it will abort and hence not
overwrite your current index. These checks ensure that your dedicated index
isn't flushed._

You can [find more explanations in this dedicated section.][2]

## Ranking records

Algolia always returns the most relevant results first, using a [tie-breaking
approach][3]. DocSearch will first search for exact matches in your keywords
then fallback to partial matches. It sorts those results, once again, on the
page hierarchy, as extracted from the `selectors`.

The default strategy is to promote records having matching words in the highest
level first. Thus if two results have the same matching words, the one having
them in the highest level (lvl0) will be ranked higher. We also use the position
of the matching words. The sooner they appear within the HTML flow, the higher
the record will be ranked.

We base relevancy on several factors and customize it according to the Algolia
tie-breaking method.

You can boost pages depending on their URLs. You should use the `start_urls` and
its `page_rank` attributes. Its value is a numeric value (defaults to 0). The
higher the value is, the higher results from the matching pages will be ranked.
For example all pages with a `page_rank` of 5 will be returned before pages with
a `page_rank` of 1.

You could even change the relevancy strategy by [overwriting the default
`customRanking`][4] used by the index by using the `custom_settings` option of
your config.

[1]: https://www.sitemaps.org/
[2]: ./how-do-we-build-an-index.html
[3]:
  https://www.algolia.com/doc/guides/ranking/ranking-formula/#tie-breaking-approach
[4]: https://www.algolia.com/doc/guides/ranking/custom-ranking/
