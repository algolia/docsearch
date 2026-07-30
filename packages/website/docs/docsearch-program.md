---
title: DocSearch program
description: Learn about DocSearch program eligibility, costs, data, and support.
---

Use this page to learn about the DocSearch program. If you need more help, contact us on [Discord][1] or through [Algolia support][4].

For questions about the DocSearch crawler, see the [Crawler FAQ][5].

## What do I need to install on my side?

After your content is indexed, add a [DocSearch v5 frontend package][19] with the application ID, Search API key, and index name from your Algolia application.

DocSearch uses the [Algolia Crawler][6] to index your content. Use the [Crawler interface][7] to create, monitor, edit, and start crawlers. For crawler questions, see the [Crawler FAQ][5]. Crawler configuration and frontend package versions are independent.

## How much does it cost?

The DocSearch program is free.

Search infrastructure can be costly for open source projects, so the DocSearch program is free. In exchange, keep the "Search by [Algolia][2]" logo next to the search results.

If you can't display the logo, [create an Algolia account][8] and run [DocSearch on your own][3]. Depending on the size of your documentation, you might need a paid plan. Free plans can hold up to 10,000 records.

## What data are you collecting?

We extract data from your website markup and store it in a custom JSON format in your Algolia DocSearch index. The selectors in your crawler configuration determine what data to extract.

As the website owner, you can access your Algolia application to review indexed data, analyze anonymized searches, and manage your team.

## Where is my data hosted?

We host DocSearch data on Algolia servers with replicas around the world. For more information, see the [Algolia infrastructure documentation][9] and [privacy policy][10].

## How do I upgrade my DocSearch app?

Choose an option based on your goal.

### Upgrade #1: I want a specific feature, like Rules, added to my existing DocSearch application

[Contact Algolia support][4] to discuss your requirements.

### Upgrade #2: I want to remove the Algolia logo

Removing the logo makes the project ineligible for the free DocSearch program. Instead, host the open source [legacy DocSearch crawler][3] or use an [Algolia API client][11]. Both options require a new Algolia application, and usage charges may apply.

### Upgrade #3: Algolia is awesome, I want to use it for my whole site

Contact the [Algolia sales team][12] to choose a plan. After creating your application, adapt a [crawler configuration template][20] for the new crawler.

## Can I use DocSearch on non-doc pages?

The free DocSearch program crawls only documentation pages for open source projects and technical blogs. To index other parts of your website, create an Algolia account and choose one of these options:

- Run the [DocSearch crawler][3] on your own
- Use a [DocSearch frontend package][19], a supported [framework integration][21], or an [Algolia API client][11]

## Can you index code samples?

Yes, but we do not recommend it.

Code samples can help users understand a method, but repeated boilerplate adds noise to search results.

## A documentation website I like does not use DocSearch. What can I do?

If a documentation website does not use DocSearch, file an issue in its repository that explains how DocSearch could help. You can also [contact us on Discord][1].

## How did we build this website?

We built this website with [Docusaurus][13]. Endi helped inspire the project. Read our [tribute to Endi][14].

## Can I share the `apiKey` in my repo?

The `apiKey` from the DocSearch team is a [search-only API key][15], so you can share it publicly and track it in version control. If you run the scraper yourself, create a search-only key and [don't share your Admin API key][16].

## Why is the email API key different in the dashboard?

Every Algolia application has a default "Search API Key" in the dashboard. That key lets you list indices, retrieve settings, and search every index in your application. For DocSearch applications, the acceptance email includes a search-only API key scoped to your DocSearch index. To recover this key, contact [Algolia support][4].

## How do I rotate my API keys?

Contact [Algolia support][4].

## Can I have multiple projects under the same Algolia application?

Use one Algolia application per project. [Apply to the DocSearch program][17] for each additional project.

### Why?

The information of the initially applied project is used everywhere when we deploy your app:

- The scope of your API keys
- The name of your Algolia application/Crawler
- The indices we generate
- The allowed domains of your Crawler

This information helps us scope support requests to the correct project.

## Support

:::caution

Before contacting support, read the relevant documentation.

Here are some links to help you:

- [The Algolia Crawler documentation](https://www.algolia.com/doc/tools/crawler/getting-started/overview/)
- [The Algolia Crawler FAQ](/docs/crawler)
- [The DocSearch FAQ](/docs/docsearch-program)
- [The Algolia documentation](https://www.algolia.com/doc/)

Visit [Algolia Academy][18] to learn more about Algolia.

:::

Algolia doesn't provide support for the DocSearch UI library, but support is available for these products:

- Contact [Algolia support][4] for the Algolia Crawler.
- Contact [Algolia support][4] for the Algolia dashboard.

For any issue related to [the DocSearch UI library](https://github.com/algolia/docsearch), please open a [GitHub issue](https://github.com/algolia/docsearch/issues).

[1]: https://alg.li/discord
[2]: https://www.algolia.com/
[3]: /docs/legacy/run-your-own
[4]: https://support.algolia.com/
[5]: /docs/crawler
[6]: https://www.algolia.com/products/search-and-discovery/crawler/
[7]: https://dashboard.algolia.com/crawler
[8]: https://www.algolia.com/pricing
[9]: https://www.algolia.com/doc/guides/infrastructure/servers/
[10]: https://www.algolia.com/policies/privacy
[11]: https://www.algolia.com/doc/api-client/getting-started/install/javascript/?client=javascript
[12]: https://www.algolia.com/contactus/
[13]: https://docusaurus.io/
[14]: https://docusaurus.io/blog/2020/01/07/tribute-to-endi
[15]: https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key
[16]: https://www.algolia.com/doc/guides/security/api-keys/#admin-api-key
[17]: https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch&utm_source=docsearch.algolia.com&utm_medium=referral&utm_campaign=docsearch&utm_content=apply
[18]: https://academy.algolia.com/trainings
[19]: /docs/packages/overview
[20]: /docs/templates
[21]: /docs/integrations
