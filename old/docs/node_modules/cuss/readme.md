# cuss [![Build Status][travis-badge]][travis]

Map of [1700+ profanities][profanities] to sureness rating.
This rating _does not_ represent _how_ vulgar a term is, instead, how
likely it is to be used as either profanity or clean text.

## Installation

[npm][]:

```bash
npm install cuss
```

## Usage

```js
var cuss = require('cuss');

console.log(Object.keys(cuss).length); // 1770

console.log(cuss.beaver); // 0
console.log(cuss.asshat); // 2
```

## API

### `cuss`

**Type**: `Object.<number>` — **cuss** exposes a dictionary
of phrases to ratings, where each phrase stems from [profanities][],
and each rating is a number between `0` and `2` (both including),
representing the certainty the word is used as a profanity depending
on context.

| Rating | Use as a profanity | Use in clean text | Example |
| ------ | ------------------ | ----------------- | ------- |
| 2      | likely             | unlikely          | asshat  |
| 1      | maybe              | maybe             | addict  |
| 0      | unlikely           | likely            | beaver  |

## Support

**cuss** supports 1770 English profane words and phrases from
[profanities][support].

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/words/cuss.svg

[travis]: https://travis-ci.org/words/cuss

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[profanities]: https://github.com/words/profanities

[support]: https://github.com/words/profanities#support
