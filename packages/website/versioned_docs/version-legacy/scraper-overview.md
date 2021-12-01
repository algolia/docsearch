---
title: Scraper Overview
---

## How?

The DocSearch scraper is written in Python and heavily inspired by the [Scrapy][1] framework. It goes through all pages of your website and extracts content from the HTML structure to populate an Algolia index.

It automatically follows every internal link to make sure we are not missing any content, and uses the semantics of your HTML structure to construct its records. This means that `h1`,`h2`, etc., (`selectors`) titles are used as hierarchy, and each `p` is used as a potential result.

Those CSS selectors can be overwritten, and each website has its own JSON configuration file that describes in more detail how the scraper should behave. You can find the complete list of options in [the related section][2].

If you'd like to [run DocSearch on your own][3], all the code is open sourced and even packaged as a Docker image. Download it, and run it with your own credentials.

[1]: https://scrapy.org/
[2]: /docs/legacy/config-file
[3]: /docs/legacy/run-your-own
