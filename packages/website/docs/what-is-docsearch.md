---
title: What is DocSearch?
description: Understand how DocSearch provides search for technical documentation.
sidebar_label: What is DocSearch?
---

## Why?

We created DocSearch because developers spend a lot of time reading documentation, and finding relevant information in large documentation sites can be difficult. Building good search is a challenge.

Algolia has extensive experience building search interfaces. We use that experience to extract content from technical documentation and make it searchable from the first keystroke.

## Overview

DocSearch has two independent parts: indexing and the frontend search experience.

- The [Algolia Crawler][4] extracts your documentation into an Algolia index. Use the [Crawler interface][5] to edit the crawler configuration, monitor crawls, and trigger new crawls.
- The [DocSearch v5 packages][7] query that index and render keyword search or Ask AI in your frontend. They are built on [Algolia Autocomplete][6].

Crawler configuration and record schema versions don't select the installed DocSearch frontend package version. You can update the frontend package without changing how the crawler is scheduled.

## How to feature DocSearch?

DocSearch is free for eligible documentation sites. Read [the eligibility requirements][2] and apply. After approval and indexing, add a [DocSearch v5 package][7] or a supported framework integration to your website. Keep the "Search by Algolia" link displayed.

DocSearch is [one of our ways][1] to give back to the open source community for everything it did for us already.

You can now [apply to the program][3].

[1]: https://opencollective.com/algolia
[2]: /docs/who-can-apply
[3]: https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch&utm_source=docsearch.algolia.com&utm_medium=referral&utm_campaign=docsearch&utm_content=apply
[4]: https://www.algolia.com/products/search-and-discovery/crawler/
[5]: https://dashboard.algolia.com/crawler
[6]: https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/
[7]: /docs/packages/overview
