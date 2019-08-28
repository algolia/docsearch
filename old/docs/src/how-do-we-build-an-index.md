---
layout: two-columns
title: How do we build a DocSearch index?
---

In this section you will learn how we build a DocSearch index from your page.

## Everything starts from your page

![1st step][2] {mt-2}

## We extract the payload thanks to your set of `selectors`

![2nd step][3] {mt-2}

We will focus on the highlighted information depending on your selectors.

## We iterate through the HTML flow and build the payload

![3rd step][4] {mt-2}

This payload will be the only data extracted from your page.

## We iterate through the payload and start pushing records

![4th step][5] {mt-2}

We index the temporary record when we add an element to it (if
`min_indexed_level` equals `0`)

## We pile up the elements based on the current temporary record

![5th step][6] {mt-2}

Base on the position within the flow, we nest elements as much as possible to
keep the context and incerease the relevancy.

## We iterate until we match a `text` element

![6th step][7] {mt-2}

## We override the text element when we find a newer one

![7th step][8] {mt-2}

## We remove the stashed, deeper elements when we add a higher level

![8th step][9] {mt-2}

Contextual information and hierarchy must be updated once we encounter a new
level. We are doing that because it highlights a new sub-section not related to
the previous one.

If you need any further information, please [do not hesitate, send us your
feedback][1].

[1]: mailto:docsearch@algolia.com
[2]: ./assets/build_index/how_do_we_build_docsearch_index_1.png
[3]: ./assets/build_index/how_do_we_build_docsearch_index_2.png
[4]: ./assets/build_index/how_do_we_build_docsearch_index_3.png
[5]: ./assets/build_index/how_do_we_build_docsearch_index_4.png
[6]: ./assets/build_index/how_do_we_build_docsearch_index_5.png
[7]: ./assets/build_index/how_do_we_build_docsearch_index_6.png
[8]: ./assets/build_index/how_do_we_build_docsearch_index_7.png
[9]: ./assets/build_index/how_do_we_build_docsearch_index_8.png
