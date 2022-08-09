---
title: DocSearch program
---

If you're not finding the answer to your question on this website, this page will help you. If you're still unsure, don't hesitate to send [your question to us][1] directly.

For questions related to the DocSearch x Algolia Crawler, please see our [Crawler FAQ](/docs/crawler).

## What do I need to install on my side?

You just need to [implement DocSearch in your frontend](/docs/DocSearch-v3) with the credentials received by email when your application has been deployed.

DocSearch leverages the [Algolia Crawler](https://www.algolia.com/products/search-and-discovery/crawler/), which offers a web [interface](https://crawler.algolia.com/) to create, monitor, edit, start your Crawlers. If you have any questions regarding it, please see our [Crawler FAQ](/docs/crawler).

## How much does it cost?

It's free!

We know that paying for search infrastructure is a cost not all open source projects can afford. That's why we decided to keep DocSearch free for everyone. All we ask in exchange is that you keep the "Search by [Algolia][2]" logo displayed next to the search results.

If this is not possible for you, you're free to [open your own Algolia account](https://www.algolia.com/pricing) and run [DocSearch on your own][3] without this limitation. In that case, though, depending on the size of your documentation, you might need a paid account (free accounts can hold as much as 10k records).

## What data are you collecting?

We save the data we extract from your website markup, which we put in a custom JSON format instead of HTML. This is the data we put in the Algolia DocSearch index. The selectors in your config define what data to scrape.

As the website owner, we also give you access to your own Algolia application. This will let you see how your website is indexed in Algolia, detailed analytics about the anonymized searches in your website, team managements, and more!

## Where is my data hosted?

We host the DocSearch data on Algolia's servers, with replications around the globe. You can find more details about the actual [server specs here](https://www.algolia.com/doc/guides/infrastructure/servers/), and more complete information in our [privacy policy](https://www.algolia.com/policies/privacy).

## Can I use DocSearch on non-doc pages?

The free DocSearch we provide will **only** crawl open-source projects documentation pages or technical blogs. To use it on other parts of your website, you'll need to create your own Algolia account and either:

- Run the [DocSearch crawler][3] on your own
- Use one of our other [framework integrations or API clients](https://www.algolia.com/doc/api-client/getting-started/install/javascript/?client=javascript)

## Can you index code samples?

Yes, but we do not recommend it.

Code samples are a great way for humans to understand how people use a specific method. It often requires boilerplate code though, repeated across examples, which adds noise to the results.

## A documentation website I like does not use DocSearch. What can I do?

We'd love to help!

If one of your favorite tool documentation websites is missing DocSearch, we encourage you to file an issue in their repository explaining how DocSearch could help. Feel free to [send us an email][1] as well, and we'll provide all the help we can.

## How did we build this website?

We build this website with [Docusaurus v2](https://docusaurus.io/). We were helped by a great man who inspired us a lot, Endi. We want [to pay a tribute to this exceptional human being that will be always part of the DocSearch project](https://docusaurus.io/blog/2020/01/07/tribute-to-endi). Rest in peace mate!

## Can I share the `apiKey` in my repo?

The `apiKey` the DocSearch team provides is [a search-only key](https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key) and can be safely shared publicly. You can track it in your version control system (e.g. git). If you are running the scraper on your own, please make sure to create a search-only key and [do not share your Admin key](https://www.algolia.com/doc/guides/security/api-keys/#admin-api-key).

## Why is the email API key different in the dashboard?

Algolia apps come with a default search API key, which also allow you to list indices, settings and search on **every** indices of your app.

When your application is deployed, we provide a search **ONLY** API key, scoped to your production index, so you don't have to worry disclosing it in the frontend.

## Can I have multiple projects under the same Algolia application?

We recommend having a single Algolia application per project. Please [apply](/apply) if you'd like to use DocSearch in an other project of yours.

### Why ?

The information of the initially applied project is used everywhere when we deploy your app:

- The scope of your API keys
- The name of your Algolia application/Crawler
- The indices we generate
- The allowed domains of your Crawler

This allow us to easily scope issues when reaching out for support.

[1]: mailto:docsearch@algolia.com
[2]: https://www.algolia.com/
[3]: /docs/legacy/run-your-own
