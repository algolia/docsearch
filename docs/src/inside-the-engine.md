---
layout: two-columns
title: Inside the engine
---

// TODO

## Building your index

Building records using the scraper is pretty intuitive. According to your settings,
we extract the payload of your webpage and index it, preserving your data's structure.
This is achieved in a simple way:
* We **read top down** your web page following your HTML flow and pick out your
matching elements according their **levels** (`selectors_level`)
* We create a record for each paragraph along with its hierarchical path.
This construction is based on their **time of appearance** along the flow.
* We **index** these records with the appropriate global settings (e.g. metadata, tags, etc.)

_**Note:** The above process performs sanity tests as it scrapes, in order to detect errors.
If indeed there are any serious warnings, it will abort and therefore not overwrite your current index.
These checks ensure that your dedicated index isn't flushed._



## How are my DocSearch records ranked?

DocSearch empowers the Algolia ranking strategy. The formula is completely
based on [the tie-breaking approach](https://www.algolia.com/doc/guides/ranking/ranking-formula/#tie-breaking-approach).

The special feature of DocSearch's ranking resides in [the custom ranking](https://www.algolia.com/doc/guides/ranking/custom-ranking/):

We have defined 3 main weight indicators for every record. These values are
ordered by importance following the tie-breaking approach:
1. `page_rank`: this value, equal to `0` by default, can be set from the
`start_urls` object. It can be customized in order to boost or restrain some
records depending on **their webpage's URL**. It will need to match a **specific
regular expression pattern**.

**Example:**
 ```json
{
   "index_name": "example",
    "start_urls": [
     {
      "url": "http://example.com/docs/api/v1\\.[0-9]",
      "page_rank": 1
     }
    ]
}
```
2. `level`: this value depends on the `level` of the record. A record's level is
its **deepest level attribute not null**. `text` records have a weight of 0.
3. `position`: This value is the position of the matching element within every
picked up element along the original HTML flow. The **sooner** the record appears,
the **higher** it will be ranked.

You can override the way these elements are impacting the search thanks to `custom_settings`.

 **Example:**

 ```json
"custom_settings": {
  "customRanking": [
  "asc(weight.position)",
    "desc(weight.page_rank)",
    "desc(weight.level)"
  ]
}
 ```
