# split-lines [![Build Status](https://travis-ci.org/sindresorhus/split-lines.svg?branch=master)](https://travis-ci.org/sindresorhus/split-lines)

> Split lines into an array of lines


## Install

```
$ npm install split-lines
```


## Usage

```js
const splitLines = require('split-lines');

splitLines('foo\r\nbar\r\nbaz\nrainbow');
//=> ['foo', 'bar', 'baz', 'rainbow']

splitLines('foo\r\nbar\r\nbaz\nrainbow', {preserveNewlines: true});
//=> ['foo\r\n', 'bar\r\n', 'baz\n', 'rainbow']
```

## API

### splitLines(input, [options])

#### input

Type: `string`

String to split.

#### options

Type: `Object`

##### preserveNewlines

Type: `boolean`<br>
Default: `false`

Preserve the line separator at the end of every line, except the last line, which will never contain one.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
