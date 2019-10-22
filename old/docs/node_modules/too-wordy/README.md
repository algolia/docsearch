[![Build Status](https://travis-ci.org/duereg/too-wordy.svg?branch=master)](https://travis-ci.org/duereg/too-wordy)
[![devDependencies](https://david-dm.org/duereg/too-wordy/dev-status.svg)](https://david-dm.org/duereg/too-wordy#info=devDependencies&view=table)
[![NPM version](https://badge.fury.io/js/too-wordy.svg)](http://badge.fury.io/js/too-wordy)

# Word Complexity

npm module for checking for wordy or unnecessary passages in your writing

## Install

```shell
npm install too-wordy
```

## Use

```javascript
var complexity = require('too-wordy');

var problems = complexity('An abundance of long winded words to accentuate this boring sentence......');
// problems -> [{ match: "abundance", index: 3, offset: 9 }, {match: accentuate, ....}]
```

## License
MIT
