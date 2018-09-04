---
layout: two-columns
title: How do we build a DocSearch index?
---

In this section you will learn how we build a DocSearch index from your page.

### Everything starts from your page

<img src="./assets/build_index/how_do_we_build_docsearch_index_1.png" alt="1st step" class="mt-2"/>

_Note: We would rather avoid useless js rendering. All useful information should
be available without any client-side rendering. You can use `curl` in order to
have a better idea of how it would look without any client-side rendering._

### We extract the payload thanks to your set of `selectors`

<img src="./assets/build_index/how_do_we_build_docsearch_index_2.png" alt="2nd step" class="mt-2"/>

We will focus on the highlighted information depending on your selectors.

### We iterate though the HTML flow and build the payload

<img src="./assets/build_index/how_do_we_build_docsearch_index_3.png" alt="3rd step" class="mt-2"/>

This payload will be the only data extracted from your page.

### We iterate though the payload and start pushing records

<img src="./assets/build_index/how_do_we_build_docsearch_index_4.png" alt="4th step" class="mt-2"/>

We index the temporary record when we add an element to it (if
`min_indexed_level` is set to `0`)

### We pile up the elements based on the current temporary record

<img src="./assets/build_index/how_do_we_build_docsearch_index_5.png" alt="5th step" class="mt-2"/>

Base on the position within the flow, we nest elements as much as possble to
keep the contextual relevancy.

### We iterate until we match a `text` element

<img src="./assets/build_index/how_do_we_build_docsearch_index_6.png" alt="6th step" class="mt-2"/>

### We override the text element when we find a newer one

<img src="./assets/build_index/how_do_we_build_docsearch_index_7.png" alt="7th step" class="mt-2"/>

### We remove the stashed, deeper elements when we add a higher level

<img src="./assets/build_index/how_do_we_build_docsearch_index_7.png" alt="7th step" class="mt-2"/>

Contextual information and hierarchy must be updated once we encounter a new
level since it highlights a new sub-section not related to the previous one.

If you need any further information, please [do not hesitate, send us your
feedback][1].

[1]: mailto:docsearch@algolia.com
