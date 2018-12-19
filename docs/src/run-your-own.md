---
layout: two-columns
title: Run your own
---

The version of DocSearch we provide for free is one hosted on our own servers,
running every 24 hours. To update your results with more control, if you are not
compliant with our checklist, or to index content sitting behind a firewall, you
might want to run the crawler yourself.

The whole code of DocSearch is open source, and we packaged it as a Docker image
to make this even easier for you to use.

## Installation

The scraper is a python tool [based on scrapy][1]. Start by cloning [the open
source repository][2]. We do recommend [pipenv][3] to install the whole python
environment

- [Install pipenv][4]
- `pipenv install`
- `pipenv shell`

You should be ready to go.

You can use DocSearch from inside a Docker image. You can setup one by running
`./docsearch docker:build`.

## Configuration

You'll need to set your Algolia application ID and admin API key as environment
variables. If you don't have an Algolia account, you should [create one][5].

- `APPLICATION_ID` should be set to your Application ID

- `API_KEY` should be set to your API Key. Make sure to use an API key with
  **write** access to your index.

For convenience, you can create a `.env` file in the repository root with the
following format and DocSearch will use those values.

```sh
APPLICATION_ID=YOUR_APP_ID
API_KEY=YOUR_API_KEY
```

## Create a new config

To create a config, run `./docsearch bootstrap`. A prompt will ask you for some
information and will then output a JSON config you can use as a base.

```sh
$ ./docsearch bootstrap
# Enter your documentation url
start url: http://www.example.com/docs/
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

Create a file from this text into a filename `example.json`, we'll use it later
on to start the crawl. You can find the complete list of available options in
[the configuration documentation][6], or browse the [list of live configs][7].

## Running your config

Now that you have your environment variables set, you can run the crawler
according to your config.

Running `pipenv shell` will enable your virtual environment. From there, you can
run one crawl with the following command:

```sh
$ ./docsearch run /path/to/your/config.json
```

Or from your built docker image:

```sh
$ ./docsearch docker:run /path/to/your/config.json
```

This will start the crawl. It extracts content from parsed pages and push the
built records to Algolia.

## Testing your results

You can test your results by running `./docsearch playground`. This will open a
web page with a search input. You can do live tests against the indexed results.

![Playground][9] {mt-2}

_Note that if the command fails (it can happen on non-Mac machines), you can get
the same result by running a live server in the `./playground` subdirectory.\`_

## Integration

Once you're satisfied with your config, you can integrate the dropdown menu in
your website by following the [instructions here][8].

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

[1]: https://scrapy.org/
[2]: https://github.com/algolia/docsearch-scraper
[3]: https://github.com/pypa/pipenv
[4]: https://pipenv.readthedocs.io/en/latest/install/#installing-pipenv
[5]: https://www.algolia.com/pricing#community
[6]: ./config-file.html
[7]: https://github.com/algolia/docsearch-configs/tree/master/configs
[8]: ./dropdown.html
[9]: ./assets/playground.png
