# textlint-rule-write-good

[![npm](https://img.shields.io/npm/v/textlint-rule-write-good.svg)](https://www.npmjs.com/package/textlint-rule-write-good)
[![Build Status](https://travis-ci.org/textlint-rule/textlint-rule-write-good.svg?branch=master)](https://travis-ci.org/textlint-rule/textlint-rule-write-good)
[![Dependency Status](https://david-dm.org/textlint-rule/textlint-rule-write-good.svg)](https://david-dm.org/textlint-rule/textlint-rule-write-good)
[![devDependency Status](https://david-dm.org/textlint-rule/textlint-rule-write-good/dev-status.svg)](https://david-dm.org/textlint-rule/textlint-rule-write-good#info=devDependencies)

[textlint](https://github.com/textlint/textlint) rule
to check your English writing styles with [btford/write-good](https://github.com/btford/write-good).

## Installation

```
$ npm install textlint-rule-write-good
```

## Usage

```
$ npm install textlint textlint-rule-write-good
$ textlint --rule textlint-rule-write-good some-text-to-proofread.txt
```

## Options

All checks except for [`eprime`](https://github.com/btford/write-good#eprime) are enabled by default.

You can disable each type of checks by passing `false` in `.textlintrc`.

```
{
  "rules": {
    "write-good": {
      "passive": false,
      "thereIs": false
    }
  }
}
```

For available checks, please refer to [btford/write-good#checks](https://github.com/btford/write-good#checks).

## Tests

```
npm test
```

## Contribution

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT License (http://nodaguti.mit-license.org/)
