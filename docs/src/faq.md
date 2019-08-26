---
layout: two-columns
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

The DocSearch crawler is running on our own infra. It will read the HTML content
from your website and populate an Algolia index with it every day. All you need
to do is keep your website online, and we take care of the rest. If you want to
edit your configuration, please submit a pull request.

## How much does it cost?

Nothing.

We know that paying for search infrastructure is a cost not all Open Source
projects can afford. That's why we decided to keep DocSearch free for everyone.
All we ask in exchange is that you keep the _powered by [Algolia][2]_ logo
displayed next to the search results.

If this is not possible for you, you're free to [open your own Algolia
account][3] and run DocSearch on your own without this limitation. In that case,
though, depending on the size of your documentation, you might need a paid
account (free accounts can hold as much as 10k records).

## What data are you collecting?

We save the data we extract from your website markup, which we put in a custom
JSON format instead of HTML. This is the data we put in the Algolia DocSearch
index. The selectors in your config define the data on file,

As the website owner, we also give you access to the Algolia Analytics
dashboard. This will let you have more data about the anonymized searches that
were done on your website. You'll see the most searched terms, or those with no
results.

With such Analytics, you will understand better what your users are doing.

_If you don't have Analytics access, [send us an email][1] and we'll enable it._

## Where is my data hosted?

All DocSearch data is hosted on Algolia's servers, with replications around the
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

Code samples are a great way for humans to understand how a specific pattern ap
alpha / method should be used. It often requires boilerplate code though,
repeated across examples, which will add noise to the results.

What we recommend instead is to exclude the code blocks from the indexing (by
using the `selectors_exclude` option in your config), and instead structure your
content so the method names are actual headers.

## Why do I have duplicate content in my results?

This can happen when you have more than one URL pointing to the same content,
for example with `./docs`, `./docs/` and `./docs/index.html` or even both `http`
and `https` in place.

This can be fixed by `stop_urls` to all the patterns you want to exclude. The
following example will exclude all URLs ending with `/` or `index.html` as well
as those starting with `http://`.

```json
{
  "stop_urls": ["/$", "/index.html$", "^http://"]
}
```

## Why are the custom changes from the Algolia dashboard ineffective?

Changing your setting from the dashboard might be something you want to do for
some reasons .

Please be aware that your DocSearch settings are set at every time the crawler
is successful. These settings will be overridden at the next crawl. We **do not
recommend to edit anything from the dashboard**. These changes have be made from
the JSON configuration itself.

You can use the [custom_settings parameter][8] in such purpose.

## A documentation website I like does not use DocSearch. What can I do?

We'd love to help!

If one of your favorite tool documentation websites is missing DocSearch, we
encourage you to file an issue in their repository explaining how DocSearch
could help. Feel free to [send us an email][1] as well, and we'll provide all
the help we can.

## How many records are created by DocSearch?

The [property `nb_hits`][9] in your configuration keeps track of the number of
records that were extracted and indexed by the last DocSearch run. It is updated
automatically at each run.

The DocSearch scraper follows [the recommended atomic-reindexing strategy][10].
It creates a brand new temporary index to populate the data scraped from your
website. Once the crawl is successfully achieved, this temporary index overwites
the old index defined in your configuration with the key `index_name`.

## Why aren't my pages indexed?

We are scraping your website according to your configuration. It might happen
that some pages are missing from the search. There are several possible reasons
for that:

- Makes sure you are not filtering on the search by wrongly using
  `facetFilters`. [See here for more details][11].
- Make sure the page missing is referenced from an other indexed page thanks to
  a hyperlink tag `<a/>`.
- Make sure you are [providing a compliant sitemap from the configuration][12]
  and that this page is referenced by it.

## Can I know when the next crawl will happen?

No you can't. You can only know that every crawls are made in a day. The
position of your crawl in the queue is the inverse of the lexicographic order of
your `index_name` amongs the whole list of featured website.

If none of the previous points help, you can contact our support.

[1]: mailto:docsearch@algolia.com
[2]: https://www.algolia.com/
[3]: https://www.algolia.com/pricing
[4]: https://www.algolia.com/doc/guides/infrastructure/servers/
[5]: https://www.algolia.com/policies/privacy
[6]: ./run-your-own.html
[7]: https://www.algolia.com/doc/api-reference/
[8]: ./config-file.html#custom_settings-optional
[9]: ./config-file.html#nb_hits-special
[10]:
  https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/in-depth/asynchronicity-and-when-to-wait-for-tasks/#atomic-reindexing
[11]: https://www.algolia.com/doc/api-reference/api-parameters/facetFilters/
[12]: ./tips.html#use-a-sitemapxml
