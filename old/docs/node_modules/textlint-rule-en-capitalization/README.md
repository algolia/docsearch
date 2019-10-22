# textlint-rule-en-capitalization [![Build Status](https://travis-ci.org/textlint-rule/textlint-rule-en-capitalization.svg?branch=master)](https://travis-ci.org/textlint-rule/textlint-rule-en-capitalization)


textlint rule that check capitalization in english text.

**OK**:

```markdown
In text, follow the standard capitalization rules for American English. Additionally:
First, sentence should be capital. Second, sentence should be capital.
# Capitalization in titles and headings
## Capitalization and colons
Use a lowercase letter to begin the first word of the text immediately following a colon, unless the text is one of the following:

- A proper noun.
- A quotation.
- An item in a bulleted, numbered, or definition list.
- Text that follows a label, such as a Caution or Note.
- A subheading on the same line as a heading.

```

**NG**:

```markdown
in text, follow the standard capitalization rules for American English
first, sentence should be capital. second, sentence should be capital.
# capitalization in titles and headings

- a proper noun.
- a quotation.
- an item in a bulleted, numbered, or definition list.
- text that follows a label, such as a Caution or Note.
- a subheading on the same line as a heading.

![image](http://exmaple.com) is not capital.
```


## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-en-capitalization

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "en-capitalization": true
    }
}
```

Via CLI

```
textlint --rule en-capitalization README.md
```


## Options

You can disable check by options.

```json5
{
    "rules": {
        "en-capitalization": {
             // allow lower-case words in Header
             "allowHeading": true,
             // allow lower-case words in Image alt
             "allowFigures": true,
             // allow lower-case words in ListItem
             "allowLists": true,
             // allow lower-case words in anywhere
             "allowWords": []
         }
    }
}
```

## Further reading

- [Capitalization  |  Google Developer Documentation Style Guide  |  Google Developers](https://developers.google.com/style/capitalization "Capitalization  |  Google Developer Documentation Style Guide  |  Google Developers")
- [Purdue OWL: Capital Letters](https://owl.english.purdue.edu/owl/resource/592/01/ "Purdue OWL: Capital Letters")

## Changelog

See [Releases page](https://github.com/textlint-rule/textlint-rule-en-capitalization/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-rule/textlint-rule-en-capitalization/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
