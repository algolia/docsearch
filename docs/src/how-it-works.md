---
layout: two-columns
title: How does it work?
---

## How to start DocSearch?

It all starts with a simple config file. The config file contains your
doc site's structure, for example your specific CSS selectors. It also
contains a number of attributes and directives that tell
[our DocSearch dedicated](https://github.com/algolia/docsearch-scraper)
tool how to find the searchable information from your website.

## The Scraper, to extract content

At a **regular time interval** (24h), our scraper will index the content of your
whole website. This **brand new** index will collect the public data of your
documentation website and push it onto our dedicated server in order to enable
your DocSearch instance. The process follows the directives contained in your
**customized configuration** file to tailor the generic behavior of our scraper,
with the aim of taking the most important information and organizing it for search optimization.

This scraping process runs on our infrastructure, not yours. You don't have to bother
with it. However, our [scraper is also totally open source](https://github.com/algolia/docsearch-scraper)
and so you are free to run it on your own servers.

## Browsing through your pages

In order to discover your pages, we highly recommend the use of a [sitemap](https://www.sitemaps.org/)
which will be our source of truth and is a good practice for SEO purposes.

In any case, our tool is crawling your website. It follows every hyperlink
embedded within the scraped pages as long as the URL belongs to the scope
defined by the `start_urls` (and/or `sitemap_urls_regexs` applied to your sitemap).

## Building your index

Building records using the scraper is pretty intuitive. According to your settings,
we extract the payload of your webpage and index it, preserving your data's structure.
This is achieved in a simple way:
* We **read top down** your web page following your HTML flow and pick out your
matching elements according their **levels** (`selectors_level`)
* We create a record for each paragraph along with its hierarchical path.
This construction is based on their **time of appearance** along the flow.
* We **index** these records with the appropriate global settings (e.g. metadata, tags, etc.)

_**Note:** The above process performs sanity tests as it scrapes, in order to detect errors.
If indeed there are any serious warnings, it will abort and therefore not overwrite your current index.
These checks ensure that your dedicated index isn't flushed._
