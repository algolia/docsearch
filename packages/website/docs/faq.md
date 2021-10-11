---
title: FAQ
---

If you're not finding the answer to your question on this website, this page will help you. If you're still unsure, don't hesitate to send [your question to us][1] directly.

You can also read our [Crawler FAQ][17], to understand how it behaves:

- [One of my pages was not crawled][15]
- [Why are my pages skipped?][16]

## How often will you crawl my website?

Crawls are scheduled on a random time to happen once a week, you are also able to trigger new ones directly from [the Crawler interface][2]

## What do I need to install on my side?

Nothing.

DocSearch leverages the [Algolia Crawler][3], which offers an [interface][2] to create, monitor, edit, start your Crawlers.

## How much does it cost?

Nothing.

We know that paying for search infrastructure is a cost not all open source projects can afford. That's why we decided to keep DocSearch free for everyone. All we ask in exchange is that you keep the "Search by [Algolia][4]" logo displayed next to the search results.

If this is not possible for you, you're free to [open your own Algolia account][5] and run [DocSearch on your own][6] without this limitation. In that case, though, depending on the size of your documentation, you might need a paid account (free accounts can hold as much as 10k records).

## What data are you collecting?

We save the data we extract from your website markup, which we put in a custom JSON format instead of HTML. This is the data we put in the Algolia DocSearch index. The selectors in your config define what data to scrape.

As the website owner, we also give you access to your own Algolia application. This will let you see how your website is indexed in Algolia, detailed analytics about the anonymized searches in your website, team managements, and more!

## Where is my data hosted?

We host the DocSearch data on Algolia's servers, with replications around the globe. You can find more details about the actual [server specs here][7], and more complete information in our [privacy policy][8].

## Can I use DocSearch on non-doc pages?

The free DocSearch we provide will **only** crawl open-source projects documentation pages or technical blogs. To use it on other parts of your website, you'll need to create your own Algolia account and either:

- Run the [DocSearch crawler][6] on your own
- Use one of our other [framework integrations or API clients][9]

## Can you index code samples?

Yes, but we do not recommend it.

Code samples are a great way for humans to understand how people use a specific method. It often requires boilerplate code though, repeated across examples, which adds noise to the results.

## Why do I have duplicate content in my results?

This can happen when you have more than one URL pointing to the same content, for example with `./docs`, `./docs/` and `./docs/index.html`.

We recommend configuring canonical URLs on your website, you can read more on the ["Consolidate duplicate URLs" guide by Google](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls) and use our [`ignoreCanonicalTo`](https://www.algolia.com/doc/tools/crawler/apis/configuration/ignore-canonical-to/) option directly in your crawler config.

Ultimately, it is possible to set set the [`exclusionPatterns`][10] to all the patterns you want to exclude.

## A documentation website I like does not use DocSearch. What can I do?

We'd love to help!

If one of your favorite tool documentation websites is missing DocSearch, we encourage you to file an issue in their repository explaining how DocSearch could help. Feel free to [send us an email][1] as well, and we'll provide all the help we can.

## How did we build this website?

We build this website with [Docusaurus v2][11]. We were helped by a great man who inspired us a lot, Endi. We want [to pay a tribute to this exceptional human being that will be always part of the DocSearch project][12]. Rest in peace mate!

## Can I share the `apiKey` in my repo?

The `apiKey` the DocSearch team provides is [a search-only key][13] and can be safely shared publicly. You can track it in your version control system (e.g. git). If you are running the scraper on your own, please make sure to create a search-only key and [do not share your Admin key][14].

[1]: mailto:docsearch@algolia.com
[2]: https://crawler.algolia.com/
[3]: https://www.algolia.com/products/search-and-discovery/crawler/
[4]: https://www.algolia.com/
[5]: https://www.algolia.com/pricing
[6]: /docs/legacy/run-your-own
[7]: https://www.algolia.com/doc/guides/infrastructure/servers/
[8]: https://www.algolia.com/policies/privacy
[9]: https://www.algolia.com/doc/api-client/getting-started/install/javascript/?client=javascript
[10]: https://www.algolia.com/doc/tools/crawler/apis/configuration/exclusion-patterns/
[11]: https://docusaurus.io/
[12]: https://docusaurus.io/blog/2020/01/07/tribute-to-endi
[13]: https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key
[14]: https://www.algolia.com/doc/guides/security/api-keys/#admin-api-key
[15]: https://www.algolia.com/doc/tools/crawler/troubleshooting/faq/#one-of-my-pages-was-not-crawled
[16]: https://www.algolia.com/doc/tools/crawler/troubleshooting/faq/#when-are-pages-skipped-or-ignored
[17]: https://www.algolia.com/doc/tools/crawler/troubleshooting/faq
