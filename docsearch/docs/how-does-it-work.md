---
id: how
title: How does it work?
---

Getting up and ready with DocSearch is a straightforward process that requires
three steps: you apply, we configure the crawler for you, and you integrate our
Search-UI in your frontend. You only need to copy and paste a JavaScript
snippet.

<img src="https://docsearch.algolia.com/img/assets/docsearch-how-it-works.png" alt="How it works"/>

## You apply

The first thing you'll need to do is to apply for DocSearch by [filling out the
form on this page][1] (double check first that you qualify). We are receiving a
lot of requests, so this form makes sure we won't be forgetting anyone.

We guarantee that we will answer every request, but as we receive a lot of
applications, please give us a couple of days to get back to you :)

## We create a configuration

Once we receive [your application][1], we'll have a look at your website and
create a custom configuration file for it. This file defines which URLs we
should crawl or ignore, as well as the specific CSS selectors to use for
selecting headers, subheaders, etc. All configs are publicly available in our
[config repository][2].

This step still requires some manual work and human brain, but thanks to the +1
000 configs we already created, we're able to automate most of it. Once this
creation finishes, we'll run a first indexing of your website and have it run
automatically every 24h.

## You update your website

We'll then get back to you with the JavaScript snippet you'll need to add to
your website. This will bind your search `input` field to display results from
your Algolia index on each keystroke in a dropdown menu.

The default styling of the dropdown uses a grey theme to fit in most designs. We
have made the dropdown itself with HTML using custom CSS classes and we
recommend that [you overwrite those classes][3] to provide a theming more inline
with the rest of your website.

Now that DocSearch is set, you don't have anything else to do. We'll keep
crawling your website every day and update your search results automatically.
All we ask is that you keep the "search by Algolia" logo next to your search
results.

[1]: apply.mdx
[2]: https://github.com/algolia/docsearch-configs/tree/master/configs
[3]: styling.md