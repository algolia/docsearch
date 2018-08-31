---
layout: two-columns
title: How do we build a DocSearch index?
---

In this section you will learn how do we build a DocSearch index from your page.

### Everything start from your page

<img src="./assets/how_do_we_build_docsearch_index_1.png" alt="1st step" class="mt-2"/>

_Note: We would rather avoid useless js rendering. Every used information should
be avaible without any client-side rendering. You can use `curl` in order to
have a better idea of how does it look._

### We extract the payload thank to your set of `selectors`

<img src="./assets/how_do_we_build_docsearch_index_2.png" alt="2nd step" class="mt-2"/>

We will only focus on the information highlted thank to your selectors.

### We iterate though the HTML flow and build the payload

<img src="./assets/how_do_we_build_docsearch_index_3.png" alt="3rd step" class="mt-2"/>

This payload will be the only considered data from your page.

### We iterate though the payload and start pushing record

<img src="./assets/how_do_we_build_docsearch_index_4.png" alt="4th step" class="mt-2"/>
 
We index the temporary record at every time we agregate an element int it (if
`min_indexed_level` is set to `0` ).

### We pile them up based on the current temporary record

<img src="./assets/how_do_we_build_docsearch_index_5.png" alt="5th step" class="mt-2"/>

Base on the position withitn the flow, we nest elements as much as possble to
keep the contextual relevancy.

### We iterate until we match a `text` element

<img src="./assets/how_do_we_build_docsearch_index_6.png" alt="6th step" class="mt-2"/>

### We override text element when we find a newer one

<img src="./assets/how_do_we_build_docsearch_index_7.png" alt="7th step" class="mt-2"/>

### We flush deeper element than the newest one

<img src="./assets/how_do_we_build_docsearch_index_7.png" alt="7th step" class="mt-2"/>

Contextual information and hierarchy must be updated once we encouter a new
level since it highlights a new sub section not related to the previous one.

If you need any further onformation, please [do not hesitate and send us your
feedback][1].

[1]: mailto:docsearch@algolia.com
