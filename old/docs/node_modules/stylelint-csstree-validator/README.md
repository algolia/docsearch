[![NPM version](https://img.shields.io/npm/v/stylelint-csstree-validator.svg)](https://www.npmjs.com/package/stylelint-csstree-validator)
[![Build Status](https://travis-ci.org/csstree/stylelint-validator.svg?branch=master)](https://travis-ci.org/csstree/stylelint-validator)

# stylelint-csstree-validator

CSS syntax validator based on [csstree](https://github.com/csstree/csstree) as plugin for [stylelint](http://stylelint.io/). Currently it's only checking declaration values to match W3C specs and browsers extensions. It would be extended in future to validate other parts of CSS.

> Validator is designed to check CSS syntax only. However PostCSS (that used by stylelint as backend) may parse other syntaxes like Less or Sass and can be used for these syntaxes too. In this case validator is limited to check declaration that doesn't contain any CSS extension (e.g. variables).

## Install

```
$ npm install --save-dev stylelint-csstree-validator
```

## Usage

Setup plugin in your [stylelint config](http://stylelint.io/user-guide/configuration/):

```json
{
  "plugins": [
    "stylelint-csstree-validator"
  ],
  "rules": {
    "csstree/validator": true
  }
}
```

### Options

#### ignore

Type: `Array` or `false`
Default: `false`

Defines a list of property names that should be ignored by the validator.

```json
{
  "plugins": [
    "stylelint-csstree-validator"
  ],
  "rules": {
    "csstree/validator": {
      "ignore": ["composes", "foo", "bar"]
    }
  }
}
```

In this example, plugin would not test declaration with property name `composes`, `foo` or `bar`. As a result, no warnings for these declarations.

## License

MIT
