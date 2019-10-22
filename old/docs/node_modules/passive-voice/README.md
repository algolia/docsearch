# passive voice [![Build Status](https://travis-ci.org/btford/passive-voice.svg?branch=master)](https://travis-ci.org/btford/passive-voice)

npm module for detecting passive voice.

Based on this [shell script](http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/).


## Install

```shell
npm install passive-voice
```


## Use

```javascript
var passive = require('passive-voice');

var problems = passive('He was judged.');
// problems -> [{ index: 3, offset: 10 }]
```


## The Preposition "By"

In scientific writing, it's sometimes more reasonable to use passive voice:

> The mixture was heated to 300°C.


Still, it's easy to restate with an active voice passive constructions followed by the
preposition "by."

For example:

> The mixture was heated by the apparatus to 300°C.

Versus:

> The apparatus headed the mixture to 300°C.

For this case, you can pass `{ by: true }` as a second argument to `passive` to only flag
such constructions as problematic:

```javascript
var passive = require('passive-voice');

var problems = passive('The mixture was heated to 300°C.');
// problems -> []

var problems = passive('The mixture was heated by the apparatus to 300°C.');
// problems -> [{ index: 12, offset: 13 }]
```


## See Also

* [write-good](https://github.com/btford/write-good) - a module for linting English


## License
MIT
