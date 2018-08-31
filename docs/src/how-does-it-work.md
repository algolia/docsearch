---
layout: two-columns
title: How does it work?
---

Getting up and ready with DocSearch is a straightforward process that requires a
three steps: you apply, we configure the crawler for you, and you integrate our
Search-UI in your frontend. It is as simple as copying and pasting a snippet.

<img src="./assets/docsearch-how-it-works.png" alt="How it works" class="mt-2"/>

### You apply

The first thing you'll need to do is to apply for DocSearch by filling the form
on this page (make sure to double check that you qualify first). We are
receiving a lot of requests, so this form makes sure we won't be forgetting
anyone.

We guarantee that we will answer to every request, but we receive a lot of
applications, so please give us a couple of days to get back to you :)

### We create a configuration

Once we receive [your application][2], we'll have a look at your website and
create a custom configuration file for it. This file defines which URLs we
should crawl or ignore, as well as the specific CSS selectors to be used for
selecting headers, subheaders, etc. All configs are publicly available in our
[config repository][1].

This step still requires some manual work, but thanks to the 1 000+ configs we
already created, we're able to automate most of it. Once done, we'll run a first
indexing of your website and have it run automatically every 24h.

### You update your website

We'll then get back to you with the JavaScript snippet you'll need to add to
your website. This will bind your search `input` field to display results from
your Algolia index on each keystroke in a dropdown menu.

The default styling of the dropdown uses a grey theme to fit in most designs.
The dropdown itself is made of HTML with custom CSS classes and we recommend
that [you overwrite those classes][3] to provide a theming more inline with the
rest of your website.

Now that DocSearch is set, you don't have anything else to do. We'll keep
crawling your website every day and update your search results automatically.
All we ask is that you keep the "search by Algolia" logo next to your search
results.

[1]: https://github.com/algolia/docsearch-configs/tree/master/configs
[2]: apply.html
[3]: styling.html
