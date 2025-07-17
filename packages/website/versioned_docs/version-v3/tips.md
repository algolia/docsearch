---
title: Tips for a good search
---

DocSearch can work with almost any website, but we've found that some site structures yield more relevant results or faster indexing time. On this page we'll share some tips on how to make the most out of DocSearch.

## Use a `sitemap.xml`

If you provide a sitemap in your configuration, DocSearch will use it to directly browse the pages to index. Pages are still crawled which means we extract every compliant link.

We highly recommend you add a `sitemap.xml` to your website if you don't have one already. This will not only make the indexing faster, but also provide you more control over which pages to index.

Sitemaps are also considered good practice for other aspects, including SEO ([more information on sitemaps][1]).

## Structure the hierarchy of information

DocSearch works better on structured documentation. Relevance of results is based on the structural hierarchy of content. In simpler terms, it means that we read the `<h1>`, ..., `<h6>` headings of your page to guess the hierarchy of information. This hierarchy brings contextual information to your records.

Documentation starts by explaining generic concepts first and then goes deeper into specifics. This is represented in your HTML markup by the hierarchy of headings you're using. For example, concepts discussed under a `<h4>` are more specific than concepts discussed under a `<h2>` in the same page. The sooner the information comes up within the page, the higher is it ranked.

DocSearch uses this structure to fine-tune the relevance of results as well as to provide potential filtering. Documentations that follow this pattern often have better relevance in their search results.

Finding the right depth of your documentation tree and how to split up your content are two of the most complex tasks. For large pages, we recommend having 4 levels (from `lvl0` to `lvl3`). We recommend at least three different levels.

_Note that you don't have to use `<hX>` tags and can use classes instead (e.g., `<span class="title-X">` )._

## Set a unique class to the element holding the content

DocSearch extracts content based on the HTML structure. We recommend that you add a custom `class` to the HTML element wrapping all your textual content. This will help narrow selectors to the relevant content.

Having such a unique identifier will make your configuration more robust as it will make sure indexed content is relevant content. We found that this is the most reliable way to exclude content in headers, sidebars, and footers that are not relevant to the search.

## Add anchors to headings

When using headings (as mentioned above), you should also try to add a custom anchor to each of them. Anchors are specified by HTML attributes (`name` or `id`) added to headers that allow browsers to directly scroll to the right position in the page. They're accessible by clicking a link with `#` followed by the anchor.

DocSearch will honor such anchors and automatically bring your users to the anchor closest to the search result they selected.

## Marking the active page(s) in the navigation

If you're using a multi-level navigation, we recommend that you mark each active level with a custom CSS class. This will make it easier for DocSearch to know _where_ the current page fits in the website hierarchy.

For example, if your `troubleshooting.html` page is located under the "Installation" menu in your sidebar, we recommend that you add a custom CSS class to the "Installation" and "Troubleshooting" links in your sidebar.

The name of the CSS class does not matter, as long as it's something that can be used as part of a CSS selector.

## Consistency of your content

Consistency is a pillar of meaningful documentation. It increases the **intelligibility** of a document and shortens the time required for a user to find the coveted information. The document **topic** should be **identifiable** and its **outline** should be demarcated.

The hierarchy should always have the same size. Try to **avoid orphan records** such as the introduction/conclusion, or asides. The selectors must be efficient for **every document** and highlight the proper hierarchy. They need to match the coveted elements depending on their level. Be careful to avoid the **edge effect** by matching unexpected **superfluous elements**.

Selectors should match information from **real document web pages** and stay ineffective for others ones (e.g., landing page, table of content, etc.). We urge the maintainer to define a **dedicated class** for the **main DOM container** that includes the actual document content such as `.DocSearch-content`

Since documentation should be **interactive**, it is a key point to **verbalize concepts with standardized words**. This **redundancy**, empowered with the **search experience** (dropdown), will even enable the **learn-as-you-type experience**. The **way to find the information** plays a key role in **leading** the user to the **retrieved knowledge**. You can also use the **synonym feature**.

## Avoid duplicates by promoting unicity

The more time-consuming reading documentation is, the more painful and reluctant its use will be. You must avoid hazy points or catch-all. With being unhelpful, the catch-all document may be **confusing** and **counterproductive**.

Duplicates introduce noise and mislead users. This is why you should always focus on the relevant content and avoid duplicating content within your site (for example landing page which contains all information, summing up, etc.). If duplicates are expected because they belong to multiple datasets (for example a different version), you should use [facets][3].

## Conciseness

What is clearly thought out is clearly and concisely expressed.

We highly recommend that you read this blog post about [how to build a helpful search for technical documentation][2].

[1]: https://www.sitemaps.org/index.html
[2]: https://blog.algolia.com/how-to-build-a-helpful-search-for-technical-documentation-the-laravel-example/
[3]: https://www.algolia.com/doc/guides/searching/faceting/
