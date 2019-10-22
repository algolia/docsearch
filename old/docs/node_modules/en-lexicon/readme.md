# English Lexicon
Extensible English language lexicon for POS tagging with Emojis and around 110K words

## Installation

```
npm install en-lexicon --save
```


## Usage

```javascript

const lexicon = require("en-lexicon");

console.log(lexicon.lexicon.faraway);
// "JJ"

// multiple POS tags are separated by "|"
console.log(lexicon.lexicon.acquired);
// "VBN|JJ|VBD"

```


## Extending

One of the main reason that I had to write my own lexicon module is that I needed it to be extensible. 

To extend the lexion with medical terms for example:

```javascript
const lexicon = require("en-lexicon");
lexicon.extend({
	lactate:"VB",
	serum:"NN"
});

// Now that you've extended the lexicon with your own terms
// you won't only get the terms you entered
// The lexicon will (try) to be smart and
// apply some inflections on those terms

// the term you entered
console.log(lexicon.lexicon.lactate);
// "VB"
console.log(lexicon.lexicon.lactated);
// "VBD|VBN"
console.log(lexicon.lexicon.lactating);
// "VBG"

```


## Credits

I've used Eric Brill's lexicon as starting point for this project, manually corrected some cases, and expanded it using various corpora, [this one](https://github.com/dariusk/corpora) and [this one](https://github.com/nibblesoft/dictionary-thesaurus) for example.

## License

License: The MIT License (MIT) - Copyright (c) 2017 Alex Corvi