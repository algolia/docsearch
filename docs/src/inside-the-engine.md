---
layout: two-columns
title: Inside the engine
---

This page will explain in more details how the crawler extracts content from your
page, and how it ranks it in the results.

## Crawling

Each crawl will begin its journey by the value of the `start_urls` you have in
your config. It will read those pages and recursively follow every link in those
pages until it has crawled all your website.

If it detects a `sitemap.xml`, it will use this link list instead of crawling
all pages.

## Extracting content

Then, for each page, it will read the HTML markup from top to bottom. It will
look for HTML elements matching your CSS `selectors`. It will specifically look
for elements matching your `text` selector (`<p>` by default). Each of those
matches will be later transformed into an Algolia record.

For each matching `text` element, the crawler will also keep in memory the
current hierarchy of headers (identified by the `lvl0` to `lvl5` selectors) that
it had to traverse to get to this text. This hierarchical information, as well
as some generic page metadata (such has the page url) are then pushed to
Algolia.

Note that the crawler performs sanity checks before pushing data to Algolia. For
example if you changed the markup of your website, the selectors might not match
anything. If we detect that something is wrong with your current crawl, we don't
overwrite your previous index.

## Ranking records

Algolia always returns the most relevant results first, using a [tie-breaking
approach][1]. DocSearch will first search for exact matches in your keywords then
fallback to partial matches. Those results will then be ordered based, once
again, on the page hierarchy, as extracted from the `selectors`.

The default strategy is to first look at the closest header of the matching
text. If a matching paragraph of text is under `Advanced Settings / API Options
/ verySpecificMethod()`, it will be ranked higher than if it is only found under
`Gettings Started > Installation`. The idea here is that if you have a match
under a very deep hierarchy, chances are that this match is very specific and
might be more interesting that something found in a very broad topic.

But this does not work in all cases as some documentations don't have deep
hierarchy. In that case, we use the paragraph position. The first paragraph of
the page will be ranked higher than the last one.

You also have a way to boost some pages directly in your config by using the
`page_rank` option. This accepts a numeric value, and all pages with
a `page_rank` of 5 will be returned before pages with a `page_rank` of 1.

If you want to get fancy, you could even overwrite the default
`customRanking` used by the index by using the `custom_settings` option of
your config.


[1]: https://www.algolia.com/doc/guides/ranking/ranking-formula/#tie-breaking-approach
[2]: https://www.algolia.com/doc/guides/ranking/ranking-formula/#tie-breaking-approach
[3]: https://www.algolia.com/doc/guides/ranking/custom-ranking/
