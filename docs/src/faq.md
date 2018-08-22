---
layout: two-columns
title: FAQ
---

If you're not finding the answer to your question in the website, this
page will help you. If you're still unsure, don't hesitate to send [your
question to us][1] directly.

### How often will you crawl my website?

Every day.

The exact time of day might vary each day, but we'll crawl your website at most
every 24 hours. We will also trigger a manual crawling every time your config is
updated.

### What do I need to install on my side?

Nothing.

The DocSearch crawler is running on our own infra. It will read HTML
content from your website and populate an Algolia index with it every day. All
you need to do is keep your website online, and we take care of the rest.

### How much does it cost?

Nothing.

We know that paying for search infrastructure is a cost not all Open Source
projects can afford. That's why we decided to keep DocSearch free for everyone.
All we ask in exchange is that you keep the _powered by
[Algolia][2]_ logo displayed next to the search results.

If this is not possible for you, you're totally free to [open your own Algolia
account][3] and run DocSearch on your own without this limitation. In that case
though, depending on the size of your documentation, you might need a paid
account ([free accounts][4] can hold as much as 10k records).

### What data are you collecting?

The data we save in the index is the data we extract from your website
markup, in a custom JSON format instead of HTML. Which part of the
page is defined in your custom config.

As the website owner, we also give you access to the Algolia Analytics
dashboard, that will let you have more data about the anonymized searches that
were done on your website. You'll be able to see the most searched terms, or
those with no results.

You will understand what people do not.

_If you don't have Analytics access, send us an email and we'll enable it._

### Where is my data hosted?

All DocSearch data is hosted on Algolia's servers, with replication around the
globe. You can find more details about the actual [server specs here][5], and
more complete information in our [privacy policy][6].

### Can I use DocSearch on non-doc pages?

The free DocSearch we provide will crawl documentation pages. If you want
to use it on other parts of your website, you'll need to create your own Algolia
account and either:

- Run the [DocSearch crawler][7] on your own
- Use one of our other [framework integrations or API clients][8]

### Can you index code samples?

Yes, but we do not recommend it.

Code samples are a great way for humans to understand how a specific pattern
/ method should be used. It often requires boilerplate code though, repeated
across examples, which will add noise to the results.

What we recommend instead is to exclude the code blocks from the indexing (by
using the `selectors_exclude` option in your config), and instead structure your
content so the method names are actual headers.

### Why do I have duplicate content in my results?

This can happen when you have more than one urls pointing to the same content,
for example with `./docs`, `./docs/` and `./docs/index.html` or even both `http`
and `https` in place.

This can be fixed by `stop_urls` to all the patterns you want to exclude. The
following example will exclude all urls ending with `/` or `index.html` as well
as those starting with `http://`.

```json
{
  "stop_urls": [
    "/$",
    "/index.html$",
    "^http://"
  ]
}
```

### A documentation I like does not use DocSearch. What can I do?

We'd love to help!

If one of your favorite tool documentation is missing DocSearch, we encourage
you to file an issue in their repository explaining how DocSearch could help.
Feel free to ping `@docsearch` on GitHub in the issue as well, and we'll provide
all the help we can.

[1]: mailto:docsearch@algolia.com

[2]: https://www.algolia.com/

[3]: https://www.algolia.com/pricing

[4]: https://www.algolia.com/pricing#community

[5]: https://www.algolia.com/doc/guides/infrastructure/servers/

[6]: https://www.algolia.com/policies/privacy

[7]: ./crawler-overview.html

[8]: https://www.algolia.com/doc/api-reference/
