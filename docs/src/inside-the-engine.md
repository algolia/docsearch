---
layout: two-columns
title: Inside the engine
---

// TODO

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
