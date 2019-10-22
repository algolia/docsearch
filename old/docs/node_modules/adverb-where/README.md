[![Build Status](https://travis-ci.org/duereg/adverb-where.svg?branch=master)](https://travis-ci.org/duereg/adverb-where)
[![devDependencies](https://david-dm.org/duereg/adverb-where/dev-status.svg)](https://david-dm.org/duereg/adverb-where#info=devDependencies&view=table)
[![NPM version](https://badge.fury.io/js/adverb-where.svg)](http://badge.fury.io/js/adverb-where)

# Adverb Where?

npm module for checking for adverbs or vague constructs. Adverbs can have the
effect of being an [intensifier that doesn't
intensify](http://grammar.ccc.commnet.edu/grammar/concise.htm#intensifiers).

## Install

```shell
npm install adverb-where
```

## Use

```javascript
var complexity = require('adverb-where');

var problems = complexity('Allegedly, this sentence is terrible.');
// problems -> [{ match: "Allegedly", index: 0, offset: 9 }]
```

## License
MIT
