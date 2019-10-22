# [postcss][postcss]-clean [![CI](https://img.shields.io/travis/leodido/postcss-clean/master.svg?style=flat-square)][ci] [![NPM](https://img.shields.io/npm/v/postcss-clean.svg?style=flat-square)][npm] [![Coveralls branch](https://img.shields.io/coveralls/leodido/postcss-clean/master.svg?style=flat-square)](https://coveralls.io/r/leodido/postcss-clean?branch=master) [![NPM Monthly Downloads](https://img.shields.io/npm/dm/postcss-clean.svg?style=flat-square)][npm]

> PostCss plugin to minify your CSS

Compression will be handled by **[clean-css][clean-css]**, which according to [this benchmark](http://goalsmashers.github.io/css-minification-benchmark) is one of the top (probably the best) libraries for minifying CSS.

## Install

With [npm](https://npmjs.org/package/postcss-clean) do:

```
npm install postcss-clean --save
```

## Example

### Input

```css
.try {
  color: #607d8b;
  width: 32px;
}
```

### Output

```css
.try{color:#607d8b;width:32px}
```

### Input

```css
:host {
  display: block;
}

:host ::content {
  & > * {
    color: var(--primary-color);
  }
}
```

### Output

```css
:host{display:block}:host ::content>*{color:var(--my-color)}
```

**Note** this example assumes you combined postcss-clean with other plugins (e.g. [postcss-nesting][postcss-nesting]).

## API

### `clean([options])`

Note that **postcss-clean** is an asynchronous processor. It cannot be used like this:

```javascript
var out = postcss([ clean() ]).process(css).css;
console.log(out)
```

Instead make sure your runner uses the async APIs:

```javascript
postcss([ clean() ]).process(css).then(function(out) {
    console.log(out.css);
});
```

#### options

It simply proxies the [clean-css][clean-css] options. See the complete list of options [here][clean-css-opts].

## Usage

See the [PostCSS documentation](https://github.com/postcss/postcss#usage) for examples for your environment.

## Contributing

Pull requests are welcome.

## License

MIT © Leonardo Di Donato

---

[![Analytics](https://ga-beacon.appspot.com/UA-49657176-1/postcss-clean?flat)](https://github.com/igrigorik/ga-beacon)

[clean-css]:       http://github.com/jakubpawlowicz/clean-css
[clean-css-opts]:  https://github.com/jakubpawlowicz/clean-css/tree/3.4#how-to-use-clean-css-api
[ci]:              https://travis-ci.org/leodido/postcss-clean
[deps]:            https://gemnasium.com/leodido/postcss-clean
[postcss]:         https://github.com/postcss/postcss
[postcss-nesting]: https://github.com/jonathantneal/postcss-nesting
[npm]:             https://www.npmjs.com/package/postcss-clean
