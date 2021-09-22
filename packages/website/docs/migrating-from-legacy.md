---
title: Migrating from legacy
authors:
  - name: Clément Vannicatte
    title: Software Engineer @ Algolia
    url: https://github.com/shortcuts
---

## Introduction

With this new version of the [DocSearch UI][1], we wanted to go further and provide a better tooling for you to create and maintain your config file, and some extra Algolia features that you all have been requested for a long time!

## What's new?

### Scraper

The DocSearch infrastructure now leverages the [Algolia Crawler][2]. We've teamed up with our friends and created a new [DocSearch helper][4], that extracts records as we were previously doing with our beloved [DocSearch scraper][3]!

The best part, is that you no longer need to install any tooling on your side if you want to maintain or update your index!

We now provide [a web interface][7] that will allow you to:

- Start, schedule and monitor your crawls
- Edit your config file from our live editor
- Test your results directly with [DocSearch v3][1]

### Algolia application and credentials

We've received a lot of requests asking for:

- A way to manage team members
- Browse and see how Algolia records are indexed
- See and subscribe to other Algolia features

They are now all available, in **your own Algolia application**, for free :D

## Config file key mapping

Below are the keys that can be found in the [`legacy` DocSearch configs][14] and their translation to an [Algolia Crawler config][16]. More detailed documentation of the Algolia Crawler can be found on the [the official documentation][15]

| `legacy` | `current` | description |
| --- | --- | --- |
| `start_urls` | [`startUrls`][20] | Now accepts URLs only, see [`helpers.docsearch`][30] to handle custom variables |
| `page_rank` | [`pageRank`][31] | Can be added to the `recordProps` in [`helpers.docsearch`][30] |
| `js_render` | [`renderJavaScript`][21] | Unchanged |
| `js_wait` | [`renderJavascript.waitTime`][22] | See documentation of [`renderJavaScript`][21] |
| `index_name` | **remove**, see [`actions`][23] | Handled directly in the [`actions`][23] |
| `sitemap_urls` | [`sitemaps`][24] | Unchanged |
| `stop_urls` | [`exclusionPatterns`][25] | Supports [`micromatch`][27] |
| `selectors_exclude` | **removed** | Should be handled in the [`recordExtractor`][28] and [`helpers.docsearch`][29] |
| `custom_settings` | [`initialIndexSettings`][26] | Unchanged |
| `scrape_start_urls` | **removed** | Can be handled with [`exclusionPatterns`][25] |
| `strip_chars` | **removed** | `#` are removed automatically from anchor links, edge cases should be handled in the [`recordExtractor`][28] and [`helpers.docsearch`][29] |
| `conversation_id` | **removed** | Not needed anymore |
| `nb_hits` | **removed** | Not needed anymore |
| `sitemap_alternate_links` | **removed** | Not needed anymore |
| `stop_content` | **removed** | Should be handled in the [`recordExtractor`][28] and [`helpers.docsearch`][29] |

## FAQ

### Migration seems to have started, but I don't have received any emails

Due to the large number of indices DocSearch have, we need to migrate configs in small incremental batches.

If you don't have received a migration mail yet, don't worry, your turn will come!

### What do I need to do to migrate?

Nothing!

We handle all the migration on our side, [your existing config file][11] will be migrated to an [Algolia Crawler config][12], crawls will be started and scheduled for you, your Algolia application will be ready to go, and your Algolia index populated with your website content!

### What do I need to update to make the migration work?

We've tried to make the migration as seamless as possible for you, so **all you need to update is your frontend integration** with the new credentials you've received by mail, or directly from the [Algolia dashboard][13]!

### What should I do with my legacy config and credentials?

Your [legacy config][11] will be parsed to a [Crawler config][12], please use [the dedicated web interface][7] to make any changes if you already received your access!

Your credentials will remain available, but **once all the existing configs have been migrated, we will stop the daily crawl jobs**.

### Are the [`docsearch-scraper`][8] and [`docsearch-configs`][9] repository still maintained?

At the time you are reading this, the migration hasn't been completed, so yes.

**Once the migration has been completed:**

- The [`docsearch-scraper`][8] will be archived and not maintained in favor of our [Algolia Crawler][2], you'll still be able to use our [run your own][3] solution if you want!
- The [`docsearch-configs`][9] repository will be archived and and host **all** of [the existing and active **legacy** DocSearch config file][11], and [their parsed version][12]. You can have a preview [on this branch][10].

[1]: DocSearch-v3
[2]: https://www.algolia.com/products/search-and-discovery/crawler/
[3]: legacy/run-your-own
[4]: helpers.docsearch
[7]: https://crawler.algolia.com/
[8]: https://github.com/algolia/docsearch-scraper
[9]: https://github.com/algolia/docsearch-configs
[10]: https://github.com/algolia/docsearch-configs/tree/feat/crawler
[11]: https://github.com/algolia/docsearch-configs
[12]: https://github.com/algolia/docsearch-configs/tree/feat/crawler/crawler-configs
[13]: https://www.algolia.com/dashboard
[14]: /docs/legacy/config-file
[15]: https://www.algolia.com/doc/tools/crawler/getting-started/overview/
[16]: https://www.algolia.com/doc/tools/crawler/apis/configuration/
[20]: https://www.algolia.com/doc/tools/crawler/apis/configuration/start-urls/
[21]: https://www.algolia.com/doc/tools/crawler/apis/configuration/render-java-script/
[22]: https://www.algolia.com/doc/tools/crawler/apis/configuration/render-java-script/#parameter-param-waittime
[23]: https://www.algolia.com/doc/tools/crawler/apis/configuration/actions/#parameter-param-indexname
[24]: https://www.algolia.com/doc/tools/crawler/apis/configuration/sitemaps/
[25]: https://www.algolia.com/doc/tools/crawler/apis/configuration/exclusion-patterns/
[26]: https://www.algolia.com/doc/tools/crawler/apis/configuration/initial-index-settings/
[27]: https://github.com/micromatch/micromatch
[28]: https://www.algolia.com/doc/tools/crawler/apis/configuration/actions/#parameter-param-recordextractor
[29]: helpers.docsearch
[30]: helpers.docsearch#with-custom-variables
[31]: helpers.docsearch#pagerank
