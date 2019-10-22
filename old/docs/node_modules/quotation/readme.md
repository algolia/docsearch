# quotation [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Quote a value.

## Installation

[npm][]:

```bash
npm install quotation
```

## Usage

```js
var quotation = require('quotation')

quotation('one') // => '"one"'
quotation(['one', 'two']) // => ['"one"', '"two"']
quotation('one', "'") // => '\'one\''
quotation('one', '“', '”') // => '“one”'
```

## API

### `quotation(value[, open[, close]])`

Quote a value.

###### Parameters

*   `value` (`string` or `Array.<string>`)
    — Value to wrap in quotes
*   `open` (`string`, default: `"`)
    — Character to add at start of `value`
*   `close` (`string`, default: `open` or `"`)
    — Character to add at end of `value`

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/quotation.svg

[travis]: https://travis-ci.org/wooorm/quotation

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/quotation.svg

[codecov]: https://codecov.io/github/wooorm/quotation

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com
