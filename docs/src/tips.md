---
layout: two-columns
title: Tips for a good search
---

DocSearch can work with almost any website, but we found that some site
structure yield more relevant result or faster indexing time. In this page
we'll share some tips on how you can make the most out of DocSearch.

### Use a `sitemap.xml`

If your website has a sitemap, DocSearch will use it to get the list of pages to
index. If it can't find one, it will follow every link of every page instead.

We highly recommend you add a `sitemap.xml` to your website if you don't have
one already. This will make the indexing faster, but will also give you more
control over which page you'd like to include or not in the indexing.

Sitemaps are also considered good practice for other aspects, including SEO
([more information on sitemaps][1]).

### Structure the hierarchy of information

DocSearch works better on structured documentation. Relevance of results is
based on the structural hierarchy of content. In simpler terms it means that we
read the `<h1>`, ..., `<h6>` headings of your page to guess the hierarchy of
information.

Documentation starts by explains generic concepts first and then goes deeper
into specifics. This is represented in your HTML markup by the hierarchy of
headings you're using. For example, concepts discussed under a `<h4>` are more
specific than concepts discussed under a `<h2>` in the same page.

DocSearch uses this structure to fine-tune the relevance of results as well as
to provide potential filtering. Documentation that follow this pattern often
have better relevance of search results.

_Note that you don't have to use `<hX>` tags and can use `<span
class="title-X">` for example instead. Your crawling configuration file will
 need to mirror those changes, though._

### Set a unique class to the element holding the content

DocSearch is extracting content based on the HTML structure. We recommend that
you add a custom `class` to the HTML element wrapping all your textual content.
This will help narrow selectors to the relevant content.

Having such a unique identifier will make your configuration more robust as it
will make sure all indexed content is relevant content. We found that
this is the most reliable way to exclude headers, sidebars and footers content
that are not relevant to the search.

### Add anchors to headings

When using headings (as mentioned above), you should also try to add a custom
anchor to each of them. Anchors are HTML attributes (`name` or `id`)
added to headers that will allow the browser to directly scroll to the right
position in the page when clicking a link with a `#` in it.

DocSearch will honor such anchors and automatically bring your users to the
anchor closest to the search result they selected.

### Marking the active page(s) in the navigation

If you're using a multi-level navigation, we recommend that you mark
each active level with a custom CSS class. This will make it easier for
DocSearch to know _where_ the current page fits in the website
hierarchy.

For example, if your `troubleshooting.html` page is located under the
`Installation` menu in your sidebar, we recommend that you add a custom CSS
class to the `Installation` and `Troubleshooting` links in your sidebar.

The name of the CSS class does not matter, as long as it's something that can be
used as part of a CSS selector.

[1]: https://www.sitemaps.org/index.html
