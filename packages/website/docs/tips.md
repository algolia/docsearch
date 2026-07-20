---
title: Tips for a good search
description: Improve DocSearch relevance with clear content structure and crawler selectors.
---

DocSearch works with many website structures, but consistent structure can improve relevance and indexing time. Follow these recommendations to improve your DocSearch results.

## Use a `sitemap.xml`

If you provide a sitemap in your crawler configuration, DocSearch uses it to find pages to index. The crawler also follows eligible links on those pages.

Add a `sitemap.xml` to your website if you don't have one. A sitemap can reduce indexing time and gives you more control over which pages are indexed.

Sitemaps can also improve search engine optimization. For more information, see the [sitemaps specification][1].

## Structure the hierarchy of information

DocSearch works better on structured documentation. Result relevance uses the structural hierarchy of your content. The crawler reads the `<h1>` through `<h6>` headings or equivalent selectors to build `hierarchy.lvl0` through `hierarchy.lvl6`.

Documentation usually introduces general concepts before covering details. Represent this structure with an ordered heading hierarchy. For example, content under an `<h4>` is more specific than content under an `<h2>` on the same page. Content that appears earlier on the page ranks higher.

DocSearch uses this structure to improve relevance. V5 also uses the populated hierarchy levels to render result breadcrumbs. Keep headings in order and avoid skipping levels where possible so each result retains its page context.

Choose a documentation depth that gives each result enough context. For large pages, use four levels, from `lvl0` to `lvl3`. Use at least three levels.

You can use classes, such as `<span class="title-X">`, instead of `<hX>` elements.

## Set a unique class to the element holding the content

DocSearch extracts content based on the HTML structure. We recommend that you add a custom `class` to the HTML element wrapping all your textual content. This will help narrow selectors to the relevant content.

A unique identifier makes your configuration more robust and limits indexing to relevant content. Use it to exclude unrelated headers, sidebars, and footers.

## Add anchors to headings

Add a custom anchor to each heading. Define anchors with an `id` or `name` HTML attribute so browsers can scroll directly to the corresponding position. Links can target an anchor with `#` followed by its value.

DocSearch uses these anchors to send users to the location of the selected result.

## Mark active pages in the navigation

If you use multi-level navigation, mark each active level with a custom CSS class. The crawler can use this class to determine where the current page fits in the website hierarchy.

For example, if your `troubleshooting.html` page is located under the "Installation" menu in your sidebar, we recommend that you add a custom CSS class to the "Installation" and "Troubleshooting" links in your sidebar.

Use any valid CSS class name that can be part of a CSS selector.

## Consistency of your content

Use the same heading structure across documentation pages. Make each page topic and outline clear, and avoid selectors that create records without enough context, such as standalone introductions or asides.

Write selectors that match documentation pages but exclude landing pages, tables of contents, and other unrelated content. Add a dedicated class, such as `.DocSearch-content`, to the main documentation container.

Use consistent terms for the same concepts. You can also configure [synonyms][5] for terms your users search interchangeably.

## Avoid duplicate content

Split broad topics into focused pages. Avoid catch-all pages that make it difficult to identify the relevant result.

Duplicate content adds noise and can mislead users. Don't repeat all documentation content on a landing or summary page. If you need duplicate records for separate datasets, such as different versions, use [facets][3] to distinguish them.

## Index metadata for v5

Add each attribute used by the v5 `facets` option to `attributesForFaceting`. DocSearch supports up to five facet controls. For a result badge, index a short value such as `version`, include it in `attributesToRetrieve`, and pass its property path to `resultBadgeKey`. See the [v5 JavaScript API reference][4].

## Conciseness

Keep content focused on one task or concept, and use short headings and paragraphs.

For more guidance, read [How to build a helpful search for technical documentation][2].

[1]: https://www.sitemaps.org/index.html
[2]: https://blog.algolia.com/how-to-build-a-helpful-search-for-technical-documentation-the-laravel-example/
[3]: https://www.algolia.com/doc/guides/searching/faceting/
[4]: /docs/packages/js/api-reference#facets
[5]: https://www.algolia.com/doc/guides/managing-results/must-do/searchable-attributes/#synonyms
