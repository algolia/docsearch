# textlint-rule-common-misspellings

[![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/) [![Build Status](https://travis-ci.org/io-monad/textlint-rule-common-misspellings.svg?branch=master)](https://travis-ci.org/io-monad/textlint-rule-common-misspellings) [![npm version](https://badge.fury.io/js/textlint-rule-common-misspellings.svg)](https://badge.fury.io/js/textlint-rule-common-misspellings) [![GitHub license](https://img.shields.io/github/license/io-monad/textlint-rule-common-misspellings.svg)](LICENSE)

[textlint](https://github.com/textlint/textlint) rule to find common misspellings from [Wikipedia: Lists of common misspellings](https://en.wikipedia.org/wiki/Wikipedia:Lists_of_common_misspellings/For_machines).

## Installing

    npm install textlint-rule-common-misspellings

## Usage

    $ npm install textlint textlint-rule-common-misspellings
    $ textlint --rule common-misspellings README.md

## Configuration

Write your configuration into `.textlintrc`. Read documents in [textlint official repository](https://github.com/textlint/textlint/tree/master/docs#readme).

The default configuration is following:

```js
{
    "rules": {
        "common-misspellings": {
            // Misspellings to be ignored (case-insensitive)
            "ignore": []
        }
    }
}
```

Example:

```js
{
    "rules": {
        "common-misspellings": {
            // Misspellings to be ignored (case-insensitive)
            "ignore": [
                "isnt",
                "yuo",
            ]
        }
    }
}
```

## Testing

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

This software is licensed under [GNU GPLv3](https://www.gnu.org/copyleft/gpl.html). See [LICENSE](LICENSE) for full text of the license.

This software is using [Wikipedia: Lists of common misspellings](https://en.wikipedia.org/wiki/Wikipedia:Lists_of_common_misspellings/For_machines), which is licensed under [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/), as a source of misspelling list.

The CC BY-SA 3.0 license says that the derived work also should be licensed under CC BY-SA. However, Creative Commons officially says [it is not recommended to apply Creative Commons license to software](https://wiki.creativecommons.org/index.php/Frequently_Asked_Questions#Can_I_apply_a_Creative_Commons_license_to_software.3F).

Therefore, I decided to license this software under GPLv3 which is one-way compatible with CC BY-SA 4.0, and CC BY-SA 3.0 is compatible with CC BY-SA 4.0.

## Acknowledgement

"textlint" is made by [azu-san](https://github.com/azu). Many thanks for creating the awesome linter tool.
