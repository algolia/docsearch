[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

# e-prime
npm module for detecting ['to be'](https://en.wikipedia.org/wiki/E-Prime) verbs. Also a module used within [write-good](https://github.com/btford/write-good).

## Install

```shell
npm install e-prime
```

## Use

```javascript
var eprime = require('e-prime');
var problems = eprime('NodeJs is awesome :)');
// problems -> [{ index: 7, offset: 2 }]
```

## License
MIT

[npm-image]: https://img.shields.io/npm/v/e-prime.svg?style=flat-square
[npm-url]: https://npmjs.org/package/e-prime
[travis-image]: https://img.shields.io/travis/Vorror/e-prime.svg?style=flat-square
[travis-url]: https://travis-ci.org/Vorror/e-prime
[coveralls-image]: https://img.shields.io/coveralls/Vorror/e-prime.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/Vorror/e-prime
[downloads-image]: http://img.shields.io/npm/dm/e-prime.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/e-prime
