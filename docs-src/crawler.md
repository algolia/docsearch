---
layout: two-columns
title: DocSearch on your own infrastructure
---

In the regular use of DocSearch, you don't have to bother, we **handle the whole stack**.

In some specific use cases, you may want to look under the hood and DIY.
This is welcome with DocSearch since every tool is open source.
DocSearch is composed of 3 different projects:
* [The front-end of DocSearch](https://github.com/algolia/docsearch)
* [The scraper](https://github.com/algolia/docsearch-scraper), which browses & indexes web pages
* [The configuration repo](https://github.com/algolia/docsearch-configs) for the scraper.

## The DocSearch backend: [our scraper](https://github.com/algolia/docsearch-scraper):

This project is a collection of submodules, each one in its own directory:
* cli: A command line tool to manage DocSearch. Run `./docsearch` and follow the steps
* deployer: Tool used by Algolia to deploy the configuration in our Apache Mesos infrastructure
* doctor: A monitoring/repair tool to check if the indices built by the scraper are in good shape
* playground: An HTML page to easily test DocSearch indices
* scraper: The core of the scraper. It reads the configuration file, fetches the web pages and indexes them in Algolia.

## Install

The DocSearch scraper is based on [Scrapy](https://scrapy.org), a famous python-based web scraper. Because it might need some JavaScript to render the pages it crawls, the scraper is also depending on [selenium](http://www.seleniumhq.org).

To ease the setup process, a Docker container is provided to help you run the scraper.

### Environment:

- Install `python` & `pip`
  - `brew install python # will install pip`
  - `apt-get install python`
  - Or any other way
- `git clone git@github.com:algolia/docsearch-scraper.git`
- `cd docsearch-scraper`
- `pip install --user -r requirements.txt`

### With docker:

- Build the underlying Docker image: `./docsearch docker:build`

## Configure DocSearch

You need to create an [Algolia account](https://www.algolia.com/users/sign_up) to get the `APPLICATION_ID` and (admin) `API_KEY` credentials the scraper will use to create the underlying indices.

Create a file named `.env` file at the root of the project containing the following keys:

```
APPLICATION_ID=
API_KEY=
```

And run the CLI to see the available commands:

```sh
$ ./docsearch
Docsearch CLI

Usage:
  ./docsearch command [options] [arguments]

Options:
  --help    Display help message

Available commands:
 bootstrap              Bootstrap a docsearch config
 run                    Run a config
 playground             Launch the playground
 docker
  docker:build          Build the scraper images (dev, prod, test)
  docker:run            Run a config using docker
 test                   Run tests
```

## Use DocSearch

### Create a config

To use DocSearch, the first thing you need is to create a crawler config. For more details about configs, check out [our configuration repo](https://github.com/algolia/docsearch-configs), you'll have a list of options you can use and a lot of live and working examples.

### Crawl the website

#### With docker:

```sh
$ ./docsearch docker:run /path/to/your/config
```

#### Without docker

```sh
$ ./docsearch run /path/to/your/config
```

### Try it with our playground

You can open the included **Playground** to test your DocSearch index.

```sh
$ ./docsearch playground
```

Enter your credentials and the index name mentioned in the crawler config file, and try the search!

### Integrate DocSearch to your website

To add the DocSearch dropdown menu to your website, add the following snippet to your website:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
<script>
  var search = docsearch({
    apiKey: '<API_KEY>', // use a SEARCH-ONLY api key here
    indexName: '<INDEX_NAME>',
    inputSelector: '<YOUR_INPUT_DOM_SELECTOR>',
    debug: false // set to `true` if you want to inspect the dropdown menu's CSS
  });
</script>
```

And you are good to go!

### Specify your own appId

If you are running the scraper on your own, you will need to tell the widget about your Algolia application ID via the `appId` parameter.

```javascript
  var search = docsearch({
    appId: '<APP_ID>', // the application ID containing your DocSearch data
    ... // other parameters as above
  });
```

If Algolia is handling the crawling of your site, you do not need to specify `appId`.

## Admin task

If you are an Algolia employee and want to manage a DocSearch account,
you'll need to add the following variables in your `.env` file:

```
WEBSITE_USERNAME=
WEBSITE_PASSWORD=
SLACK_HOOK=
SCHEDULER_USERNAME=
SCHEDULER_PASSWORD=
DEPLOY_KEY=
```

The cli will then have more commands for you to run.

For some actions like deploying you might need to use different credentials than the ones in the _.env_ file.
To do this you need to override them when running the cli tool:

```sh
APPLICATION_ID=<your APPLICATION_ID> API_KEY=<your API_KEY> ./docsearch deploy:configs
```

## Run the tests

### With docker:

```sh
$ ./docsearch test
```

### Without docker:

```sh
$ pip install pytest
$ API_KEY='test' APPLICATION_ID='test' python -m pytest
```
