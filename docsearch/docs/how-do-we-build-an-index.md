---
id: index
title: How do we build a DocSearch index?
---

In this section you will learn how we build a DocSearch index from your page.

## Everything starts from your page

<img src="https://docsearch.algolia.com/img/build_index/how_do_we_build_docsearch_index_1.png" alt="1st step"/>

## We extract the payload thanks to your set of `selectors`

<img src="https://docsearch.algolia.com/img/build_index/how_do_we_build_docsearch_index_2.png" alt="2nd step"/>

We will focus on the highlighted information depending on your selectors.

## We iterate through the HTML flow and build the payload

<img src="https://docsearch.algolia.com/img/build_index/how_do_we_build_docsearch_index_3.png" alt="3rd step"/>

This payload will be the only data extracted from your page.

## We iterate through the payload and start pushing records

<img src="https://docsearch.algolia.com/img/build_index/how_do_we_build_docsearch_index_4.png" alt="4th step"/>

We index the temporary record when we add an element to it (if
`min_indexed_level` equals `0`)

## We pile up the elements based on the current temporary record

<img src="https://docsearch.algolia.com/img/build_index/how_do_we_build_docsearch_index_5.png" alt="5th step"/>

Base on the position within the flow, we nest elements as much as possible to
keep the context and incerease the relevancy.

## We iterate until we match a `text` element

<img src="https://docsearch.algolia.com/img/build_index/how_do_we_build_docsearch_index_6.png" alt="6th step"/>

## We override the text element when we find a newer one

<img src="https://docsearch.algolia.com/img/build_index/how_do_we_build_docsearch_index_7.png" alt="7th step"/>

## We remove the stashed, deeper elements when we add a higher level

<img src="https://docsearch.algolia.com/img/build_index/how_do_we_build_docsearch_index_8.png" alt="8th step"/>

Contextual information and hierarchy must be updated once we encounter a new
level. We are doing that because it highlights a new sub-section not related to
the previous one.

If you need any further information, please [do not hesitate, send us your
feedback][1].

[1]: mailto:docsearch@algolia.com
