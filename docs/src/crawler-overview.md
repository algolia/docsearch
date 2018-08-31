---
layout: two-columns
title: Crawler Overview
---

### How?

The DocSearch crawler is written in python and heavily based on the [Scrapy][1]
framework. It will crawl all pages of your website and extract content from the
HTML structure to populate an Algolia index.

It will automatically follow every internal link to make sure we are not missing
any content, and will use the semantics of your HTML structure to construct its
records. This means that `h1`...`h6` (`selectors`) titles will be used for the hierarchy, and
each `p` of text will be used as a potential result.

Those CSS selectors can be overwritten, and each website actually has its own
JSON configuration file that describe in more details how the crawling should
behave. You can find the complete list of options in [our documentation][2].

### When?

We automatically run each config every 24h. This is done from our own
infrastructure, meaning that you don't need to install anything on your side. We
run this service entirely free of charge, but we're asking that you keep the
"powered by Algolia" logo next to the search results.

That being said, if you'd like to run DocSearch on your own, [all the code is
open source][3] and even packaged as a Docker image. Download it, and run it
with your own credentials.

[1]: https://scrapy.org/
[2]: ./crawler-config.html
[3]: https://github.com/algolia/docsearch-scraper
