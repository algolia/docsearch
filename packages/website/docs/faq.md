---
title: FAQ
---

If you're not finding the answer to your question on this website, this page
will help you. If you're still unsure, don't hesitate to send [your question to
us][1] directly.

## How often will you crawl my website?

Every day.

The exact time of day might vary each day, but we'll crawl your website at most
every 24 hours.

## What do I need to install on my side?

Nothing.

The DocSearch crawler is running on our own infra. It reads the HTML content
from your website and populates an Algolia index every day. All you need to do
is keep your website online, and we take care of the rest. To edit your
configuration, please [submit a pull request][14].

## How much does it cost?

Nothing.

We know that paying for search infrastructure is a cost not all open source
projects can afford. That's why we decided to keep DocSearch free for everyone.
All we ask in exchange is that you keep the "Search by [Algolia][2]" logo
displayed next to the search results.

If this is not possible for you, you're free to [open your own Algolia
account][3] and run DocSearch on your own without this limitation. In that case,
though, depending on the size of your documentation, you might need a paid
account (free accounts can hold as much as 10k records).

## What data are you collecting?

We save the data we extract from your website markup, which we put in a custom
JSON format instead of HTML. This is the data we put in the Algolia DocSearch
index. The selectors in your config define what data to scrape.

As the website owner, we also give you access to the [Algolia Analytics][15]
dashboard. This will let you have more data about the anonymized searches in
your website. You'll see the most searched terms, or those that lead to no
results.

With such analytics, you will better understand what your users are searching
for.

_If you don't have Analytics access, [send us an email][1] and we'll enable it._

## Where is my data hosted?

We host the DocSearch data on Algolia's servers, with replications around the
globe. You can find more details about the actual [server specs here][4], and
more complete information in our [privacy policy][5].

## Can I use DocSearch on non-doc pages?

The free DocSearch we provide will crawl documentation pages. To use it on other
parts of your website, you'll need to create your own Algolia account and
either:

- Run the [DocSearch crawler][6] on your own
- Use one of our other [framework integrations or API clients][7]

## Can you index code samples?

Yes, but we do not recommend it.

Code samples are a great way for humans to understand how people use a specific
method. It often requires boilerplate code though, repeated across examples,
which adds noise to the results.

What we recommend instead is to exclude the code blocks from the indexing (by
using the `selectors_exclude` option in your config), and instead structure your
content so the method names are present in the headers.

## Why do I have duplicate content in my results?

This can happen when you have more than one URL pointing to the same content,
for example with `./docs`, `./docs/` and `./docs/index.html`.

You set the `stop_urls` to all the patterns you want to exclude. The following
example will exclude all URLs ending with `/` or `index.html`

```json
{
  "stop_urls": ["/$", "/index.html$"]
}
```

## Why are custom changes from the Algolia dashboard ineffective?

Changing your setting from the dashboard might be something you want to do for
some reasons .

Every successful crawl sets the DocSearch settings. These settings will be
overridden at the next crawl. We **do not recommend to edit anything from the
dashboard**. These changes come from the JSON configuration itself.

You can use the [custom_settings parameter][8] for such purpose.

## A documentation website I like does not use DocSearch. What can I do?

We'd love to help!

If one of your favorite tool documentation websites is missing DocSearch, we
encourage you to file an issue in their repository explaining how DocSearch
could help. Feel free to [send us an email][1] as well, and we'll provide all
the help we can.

## How many records does the DocSearch crawl create?

The [`nb_hits` property][8] in your configuration keeps track of the number of
records the crawl has extracted and indexed by the last DocSearch run. A crawl
updates this number automatically.

The DocSearch scraper follows [the recommended atomic-reindexing strategy][9].
It creates a brand new temporary index to populate the data scraped from your
website. When successful, the crawl overwrites the old index defined in your
configuration with the key `index_name`.

## Why aren't my pages indexed?

We are scraping your website according to your configuration. It might happen
that some pages are missing from the search. Some possible reasons for that are:

- Makes sure you are not filtering on the search by wrongly using
  `facetFilters`. [See here for more details][10].
- Make sure that an other indexed page references the page missing with an
  hyperlink tag `<a/>`.
- Make sure you are [providing a compliant sitemap from the configuration][11]
  and that it references the page.

## Can I know when the next crawl will happen?

No you can't. You should be aware that we made every crawls in a day. The
position of your crawl in the queue is the lexicographic order of your
`index_name` amongs the whole list of featured website.

If none of the previous points help, you [can contact our support][1].

## How did we build this website?

We build this website with [Docusaurus v2][12]. We were helped by a great man
who inspired us a lot, Endi. We want [to pay a tribute to this exceptional human
being that will be always part of the DocSearch project][13]. Rest in peace
mate!

## What is the timeline on the v3?

We are pre-releasing the v3 on docusaurus 2. It will help us to iterate faster
on it and make sure we are ready to release a vanilla version. We will provide a
migration guide to help you move on this new version. If you want to have more
information on this version, you can [watch the search party we made about this
topic][16].

## Can I share the `apiKey` in my repo?

The `apiKey` the DocSearch team provides is [a search-only key][16] and can be
safely shared publicly. You can track it in your version control system (e.g.
git). If you are running the scraper on your own, please make sure to create a
search-only key and [do not share your Admin key][18].

[1]: mailto:docsearch@algolia.com
[2]: https://www.algolia.com/
[3]: https://www.algolia.com/pricing
[4]: https://www.algolia.com/doc/guides/infrastructure/servers/
[5]: https://www.algolia.com/policies/privacy
[6]: run-your-own.md
[7]: https://www.algolia.com/doc/api-reference/
[8]: config-file.md
[9]:
  https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/in-depth/asynchronicity-and-when-to-wait-for-tasks/#atomic-reindexing
[10]: https://www.algolia.com/doc/api-reference/api-parameters/facetFilters/
[11]: tips.md
[12]: https://v2.docusaurus.io/
[13]: https://docusaurus.io/blog/2020/01/07/tribute-to-endi
[14]: https://github.com/algolia/docsearch-configs/pulls
[15]:
  https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/understand-reports/
[16]: https://youtu.be/OXRjnG7SHJM
[17]: https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key
[18]: https://www.algolia.com/doc/guides/security/api-keys/#admin-api-key
