---
layout: two-columns
title: How does it work?
---

Getting up and ready with DocSearch is a straightforward process that requires
a three steps: you apply, we configure the crawler for you, and you update your
front-end.

<img src="./assets/docsearch-how-it-works.png" alt="How it works" class="mt-2"/>

### 1. You apply

The first thing you'll need to do is to apply for DocSearch by filling the
form on this page (make sure to double check that you qualify first). We are
receiving a lot of requests, so this form makes sure we won't be forgetting
anyone.

We guarantee that we will answer to every request, but due to the amount of
applications we receive, please give us a couple of days to get back to you :)

### 2. We create a configuration

Once we receive your application, we'll have a look at your website and create
a custom configuration file for it. This file defines which urls we
should crawl or ignore, as well as the specific CSS selectors to be used for
selecting headers, subheaders, etc. All configs are publicly available in our
[config repo][1].

This step still requires some manual work, but thanks to the 900+ configs we
already created, we're able to automate most of it. Once done, we'll run a first
indexing of your website and have it run automatically every 24h.

### 3. You update your website

We'll then get back to you with the JavaScript snippet you'll need to add to
your website. This will bind your search `input` field to display results from
your Algolia index on each keystroke in a dropdown menu.

The default styling of the dropdown uses a grey theme to fit in most designs.
The dropdown itself is made of HTML with custom CSS classes and we recommend
that you overwrite those classes to provide a theming more inline with the rest
of your website.

Now that DocSearch is set, you don't have anything else to do. We'll keep
crawling your website every day and update your search results automatically.
All we ask is that you keep the "search by Algolia" logo next to your search
results.

[1]: https://github.com/algolia/docsearch-configs/tree/master/configs
