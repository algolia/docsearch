---
layout: two-columns
title: Run your own
---

The version of DocSearch we provide for free is one hosted on our own
servers, running every 24 hours. To update your results
more often than that, or to index content sitting behind a
firewall, you might want to run the crawler yourself.

The code of DocSearch is Open-Source, and we packaged it as a Docker
image to make this even easier for you to use.

## Installation

Start by cloning [the repo][1] and then running `./docsearch
docker:build` to create the local image.

Even if not recommended, you can run DocSearch directly from you host.
For that, you'll need to have `python` and `pip` installed, and then
run `pip install --user -r requirements.txt`.

## Configuration

You'll need to set your Algolia application ID and admin API key as
environment variables. If you don't have an Algolia account, you
should [create one][2].

- `APPLICATION_ID` should be set to your Application ID

- `API_KEY` should be set to your API Key. Make sure to use an API key
  with **write** access to your index.

For convenience, you can create a `.env` file in the repository root
with the following format and DocSearch will use those values.

```sh
APPLICATION_ID=YOUR_APP_ID
API_KEY=YOUR_API_KEY
```

## Creating a new config

To create your config, run `./docsearch bootstrap`. A prompt will ask
you for a some information and will then output a JSON config you can
use as a base.

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

Copy-paste the content into a file name `example.json`, we'll use it
later to start the crawling. You can find the complete list of
available options in [our documentation][3], or browse the [list of
live configs][4].

## Running your config

Now that you have your environment variables set, you can run the
crawler according to your config.

```sh
$ ./docsearch docker:run /path/to/your/config.json
```

This will crawl all pages, extract content from them and then push it
to Algolia.

## Testing your results

You can test your results by running `./docsearch playground`. This
will open a web page with a search input where you can do live tests
against the indexed results.

<img src="./assets/playground.png" alt="Playground" class="mt-2"/>

_Note that if the command fails (it can happen on non-Mac machines),
you can get the same result by running a live server in the `./playground` subdirectory.\`_

## Integration

Once you're satisfied with your config, you can integrate the dropdown
menu in your website by following the [instructions here][5].

The difference is that you'll also have to add the `appId` key to your
`docsearch()` instance. Also don't forget to use a **search** API key
here (in other words, not the **write** API key you used for the crawling).

```javascript
docsearch({
  appId: '<APP_ID>', // Add your own Application ID
  apiKey: '<API_KEY>', // Set it to your own search API key
  […] // Other settings are identical
});
```

## Help

You can run `./docsearch` without any argument to see the list of all
available commands.

Note that we use this CLI tool internally at Algolia to run the free
hosted version, so you might not need all the listed commands.

[1]: https://github.com/algolia/docsearch-scraper

[2]: https://www.algolia.com/pricing#community

[3]: ./config-file.html

[4]: https://github.com/algolia/docsearch-configs/tree/master/configs

[5]: ./dropdown.html
