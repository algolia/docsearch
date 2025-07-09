---
title: What is DocSearch?
sidebar_label: What is DocSearch?
---

## Why?

We created DocSearch because we are scratching our own itch. As developers, we spend a lot of time reading documentation, and it can be hard to find relevant information in large documentations. We're not blaming anyone here: building good search is a challenge.

It happens that we are a search company and we actually have a lot of experience building search interfaces. We wanted to use those skills to help others. That's why we created a way to automatically extract content from tech documentation and make it available to everyone from the first keystroke.

## Quick description

We split DocSearch into a crawler and a frontend library.

- Crawls are handled by the [Algolia Crawler][4] and scheduled to run once a week by default, you can then trigger new crawls yourself and monitor them directly from the [Crawler interface][5], which also offers a live editor where you can maintain your config.
- The frontend library is built on top of [Algolia Autocomplete][6] and provides an immersive search experience through its modal.

## How to feature DocSearch?

DocSearch is entirely free and automated. The one thing we'll need from you is to read [our checklist][2] and apply! After that, we'll share with you the snippet needed to add DocSearch to your website. We ask that you keep the "Search by Algolia" link displayed.

DocSearch is [one of our ways][1] to give back to the open source community for everything it did for us already.

You can now [apply to the program][3]

[1]: https://opencollective.com/algolia
[2]: /docs/who-can-apply
[3]: https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch
[4]: https://www.algolia.com/products/search-and-discovery/crawler/
[5]: https://dashboard.algolia.com/crawler
[6]: https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/
