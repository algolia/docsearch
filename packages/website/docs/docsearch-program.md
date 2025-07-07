---
title: DocSearch program
---

If you're not finding the answer to your question on this website, this page will help you. If you're still unsure, don't hesitate to connect with us on [Discord][1] or let our [support][4] team know.

For questions related to the DocSearch x Algolia Crawler, please see our [Crawler FAQ](/docs/crawler).

## What do I need to install on my side?

You just need to [implement DocSearch in your frontend](/docs/docsearch-v3) with the credentials received by email when your application has been deployed.

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

## How do I upgrade my DocSearch app?

Depending on what you are looking for you have a few options!

### Upgrade #1: I want a specific feature, like Rules, added to my existing DocSearch application.

[Reach out to us](https://algolia.com/support) and we may be able to help!

### Upgrade #2: I want to remove the Algolia logo.

This would disqualify you from the free DocSearch program. We do offer an open-source
[legacy version](https://docsearch.algolia.com/docs/legacy/run-your-own) of the DocSearch Crawler that you can use and
host yourself or you can use our [API clients](https://www.algolia.com/doc/api-client/getting-started/install/javascript/?client=javascript) but you will need to use a new Algolia application and pay for its usage.

### Upgrade #3: Algolia is awesome, I want to use it for my whole site!

That's awesome! Please reach out to our [sales team](https://www.algolia.com/contactus/)
who can help you figure out the right plan for you. Once you have your new application
created you can simply copy and paste [your Crawler config](https://docsearch.algolia.com/docs/templates) into your new application's
Crawler.

## Can I use DocSearch on non-doc pages?

The free DocSearch we provide will **only** crawl open-source projects documentation pages or technical blogs. To use it on other parts of your website, you'll need to create your own Algolia account and either:

- Run the [DocSearch crawler][3] on your own
- Use one of our other [framework integrations or API clients](https://www.algolia.com/doc/api-client/getting-started/install/javascript/?client=javascript)

## Can you index code samples?

Yes, but we do not recommend it.

Code samples are a great way for humans to understand how people use a specific method. It often requires boilerplate code though, repeated across examples, which adds noise to the results.

## A documentation website I like does not use DocSearch. What can I do?

We'd love to help!

If one of your favorite tool documentation websites is missing DocSearch, we encourage you to file an issue in their repository explaining how DocSearch could help. Feel free to [let us know on Discord][1] as well and we'll provide all the help we can.

## How did we build this website?

We build this website with [Docusaurus v2](https://docusaurus.io/). We were helped by a great man who inspired us a lot, Endi. We want [to pay a tribute to this exceptional human being that will be always part of the DocSearch project](https://docusaurus.io/blog/2020/01/07/tribute-to-endi). Rest in peace mate!

## Can I share the `apiKey` in my repo?

The `apiKey` the DocSearch team provides is [a search-only key](https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key) and can be safely shared publicly. You can track it in your version control system (e.g. git). If you are running the scraper on your own, please make sure to create a search-only key and [do not share your Admin key](https://www.algolia.com/doc/guides/security/api-keys/#admin-api-key).

## Why is the email API key different in the dashboard?

Every Algolia app comes with a default "Search API Key" which can be seen in the dashboard. That key allow you to list indices, settings, and search on **every** index owned by your application. In the case of a DocSearch application, in your acceptance email we provide a search **ONLY** API key scoped to only your DocSearch index. If for any reason you need to recover the API key sent in the email, just connect with our [support](https://algolia.com/support) team.

## How do I rotate my API keys?

Please reach out to our [support](https://algolia.com/support) team.

## Can I have multiple projects under the same Algolia application?

We recommend having a single Algolia application per project. Please [apply](https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch) if you'd like to use DocSearch in an other project of yours.

### Why ?

The information of the initially applied project is used everywhere when we deploy your app:

- The scope of your API keys
- The name of your Algolia application/Crawler
- The indices we generate
- The allowed domains of your Crawler

This allow us to easily scope issues when reaching out for support.

## Support

:::caution

Please make sure to **first read the documentation before reaching out**.

Here are some links to help you:

- [The Algolia Crawler documentation](https://www.algolia.com/doc/tools/crawler/getting-started/overview/)
- [The Algolia Crawler FAQ](/docs/crawler)
- [The DocSearch FAQ](/docs/docsearch-program)
- [The Algolia documentation](https://www.algolia.com/doc/)

You can also take a look at [the Algolia academy](https://academy.algolia.com/trainings) to understand more about Algolia.

:::

Please be informed that while Algolia does not provide support for DocSearch itself, we can support requests for the following products:

- The Algolia Crawler, reach out [via the support page](https://algolia.com/support).
- The Algolia Dashboard, reach out [via the support page](https://algolia.com/support).

For any issue related to [the DocSearch UI library](https://github.com/algolia/docsearch), please open a [GitHub issues](https://github.com/algolia/docsearch/issues).

[1]: https://alg.li/discord
[2]: https://www.algolia.com/
[3]: /docs/legacy/run-your-own
[4]: https://support.algolia.com/
