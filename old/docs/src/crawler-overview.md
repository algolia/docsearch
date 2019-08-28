---
layout: two-columns
title: Scraper Overview
---

## How?

The DocSearch scraper is written in python and heavily based on the [Scrapy][1]
framework. It will go through all pages of your website and extract content from
the HTML structure to populate an Algolia index.

It will automatically follow every internal link to make sure we are not
missing any content, and will use the semantics of your HTML structure to
construct its records. This means that `h1`,`h2`, etc., (`selectors`) titles
will be used for the hierarchy, and each `p` of text will be used as a potential
result.

Those CSS selectors can be overwritten, and each website actually has its own
JSON configuration file that describes in more detail how the scraper should
behave. You can find the complete list of options in [the related section][2].

## When?

We automatically run each config every 24h. This is done from our own
infrastructure, meaning that you don't need to install anything on your side. We
run this service entirely free of charge, but we're asking that you keep the
"powered by Algolia" logo next to the search results.

That being said, if you'd like to [run DocSearch on your own][3], all the code
is open source and even packaged as a Docker image. Download it, and run it with
your own credentials.

[1]: https://scrapy.org/
[2]: ./config-file.html
[3]: ./run-your-own.html
