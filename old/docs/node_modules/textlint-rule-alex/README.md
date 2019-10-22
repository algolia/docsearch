# textlint-rule-alex [![Build Status](https://travis-ci.org/textlint-rule/textlint-rule-alex.svg?branch=master)](https://travis-ci.org/textlint-rule/textlint-rule-alex)

[textlint](https://github.com/textlint/textlint "textlint") rule for [ALEX](http://alexjs.com/ "ALEX").

> Whether your own or someone else’s writing, alex helps you find gender favouring, polarising, race related, religion inconsiderate, or other unequal phrasing.
> -- [wooorm/alex: Catch insensitive, inconsiderate writing](https://github.com/wooorm/alex#alexvalue-allow "wooorm/alex: Catch insensitive, inconsiderate writing")

## Installation

    npm install textlint-rule-alex

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "alex": {
            "allow": []
        }
    }
}
```

Via CLI

```sh
$ textlint --rule alex README.md
```

## Options

### `allow`

See Alex's document: [Ignoring messages](https://github.com/wooorm/alex#ignoring-messages "Ignoring messages")

```json
{
    "rules": {
        "alex": {
             "allow": ["boogeyman-boogeywoman"]
        }
    }
}
```

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT