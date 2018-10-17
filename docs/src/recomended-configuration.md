---
layout: two-columns
title: Recommended recommendation
---

This is great news to know that you want to integrate DocSearch in your website.
A good search experience is key to help your users discover your content

This secrtion, [empowered by the details regarding how we build a DocSearch
index][1], this section will give what is the requirements in order to have a
great experience.

## Recommendations

- My website should have [an updated sitemap][2]. This is key in order to let us
  know what should be updated. Do not worry, we will stil crawl your website in
  order to have a great content.

- Every pages needs to have her full context available. Using [metadata is
  meaningful][3].

- Every `lvlx` DOM elements (matching your selectors) must have a unique `id` or
  `name`. This will help the redirection to direclty scroll down to the exact
  place of the matching elements.

- Your website should not required some JavaScript rendering to generate the
  payload of your website (that-is-to-say your documentation). You can change
  the user_agent parameter in order to do so.

-
- `API_KEY` should be set to your API Key. Make sure to use an API key with
  **write** access to your index.

For convenience, you can create a `.env` file in the repository root with the
following format and DocSearch will use those values.

```sh
APPLICATION_ID=YOUR_APP_ID
API_KEY=YOUR_API_KEY
```

## Creating a new config

To create your config, run `./docsearch bootstrap`. A prompt will ask you for a
some information and will then output a JSON config you can use as a base.

```sh
$ ./docsearch bootstrap
# Enter your documentation url
start url: http://www.example.com/docs/
# You most probably don't need variables
Does the start_urls require variables ? [y/n]: n
# Pick another name, or press enter
index_name is example [enter to confirm]: <Enter>

=================
{
  "index_name": "example",
  "start_urls": [
    "http://www.example.com/docs/"
  ],
  "stop_urls": [],
  "selectors": {
    "lvl0": "FIXME h1",
    "lvl1": "FIXME h2",
    "lvl2": "FIXME h3",
    "lvl3": "FIXME h4",
    "lvl4": "FIXME h5",
    "text": "FIXME p, FIXME li"
  }
}
=================
```

Copy-paste the content into a filename `example.json`, we'll use it later to
start the crawling. You can find the complete list of available options in [our
documentation][3], or browse the [list of live configs][4].

## Running your config

Now that you have your environment variables set, you can run the crawler
according to your config.

```sh
$ ./docsearch docker:run /path/to/your/config.json
```

This will crawl all pages, extract content from them and then push it to
Algolia.

## Testing your results

You can test your results by running `./docsearch playground`. This will open a
web page with a search input where you can do live tests against the indexed
results.

![Playground][6] {mt-2}

_Note that if the command fails (it can happen on non-Mac machines), you can get
the same result by running a live server in the `./playground` subdirectory.\`_

## Integration

Once you're satisfied with your config, you can integrate the dropdown menu in
your website by following the [instructions here][5].

The difference is that you'll also have to add the `appId` key to your
`docsearch()` instance. Also don't forget to use a **search** API key here (in
other words, not the **write** API key you used for the crawling).

```javascript
docsearch({
  appId: '<APP_ID>', // Add your own Application ID
  apiKey: '<API_KEY>', // Set it to your own search API key
  […] // Other settings are identical
});
```

## Help

You can run `./docsearch` without any argument to see the list of all available
commands.

Note that we use this command-line tool internally at Algolia to run the free
hosted version, so you might not need all the listed commands.

[1]: how-do-we-build-an-index.html
[2]: https://www.sitemaps.org/
[3]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
