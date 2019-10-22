# English Inflectors Library
For noun (plural to singular and singular to plural), verb (gerund, present & past) and adjective (comparative, superlative) transformations.

![npm](https://img.shields.io/npm/dm/en-inflectors.svg)
![npm](https://img.shields.io/npm/v/en-inflectors.svg)
![license](https://img.shields.io/github/license/FinNLP/en-inflectors.svg)
![David](https://img.shields.io/david/FinNLP/en-inflectors.svg)

## Demo
Here's a quick demo: [RunKit](https://runkit.com/alexcorvi/58e0ccbae24d0400135491d8)

## Installation

```
npm install en-inflectors --save
```


## Usage

*  **Import the library**
```javascript
// javascript
const Inflectors = require("en-inflectors").Inflectors;
```
```typescript
// typescript
import { Inflectors } from "en-inflectors";
```

* **Instantiate the class**
```javascript
let instance = new Inflectors("book");
``` 

* **Adjective Inflection**
```javascript
let instance = new Inflectors("big");
instance.comparative(); // bigger
instance.superlative(); // biggest
``` 

* **Verb Conjugation**
```javascript
new Inflectors("rallied").conjugate("VBP"); // rally
new Inflectors("fly").conjugate("VBD"); // flew
new Inflectors("throw").conjugate("VBN"); // thrown
new Inflectors("rally").conjugate("VBS"); // rallies
new Inflectors("die").conjugate("VBP"); // dying

// or you can use the aliases
new Inflectors("rallied").toPresent(); // rally
new Inflectors("fly").toPast(); // flew
new Inflectors("throw").toPastParticiple(); // thrown
new Inflectors("rally").toPresentS(); // rallies
new Inflectors("die").toGerund(); // dying
``` 

* **Noun Inflection**
```javascript
const instanceA = new Inflectors("bus");
const instanceB = new Inflectors("ellipses");
const instanceC = new Inflectors("money");

instanceA.isCountable(); // true
instanceB.isCountable(); // true
instanceC.isCountable(); // false

instanceA.isNotCountable(); // false
instanceB.isNotCountable(); // false
instanceC.isNotCountable(); // true

instanceA.isSingular(); // true
instanceB.isSingular(); // false
instanceC.isSingular(); // true

instanceA.isPlural(); // false
instanceB.isPlural(); // true
instanceC.isPlural(); // true

// note that uncountable words return true
// on both plural and singular checks


instanceA.toSingular(); // bus (no change)
instanceB.toSingular(); // ellipsis
instanceC.toSingular(); // money (no change)


instanceA.toPlural(); // buses
instanceB.toPlural(); // ellipses (no change)
instanceC.toPlural(); // money (no change)

```

## How does it work

* **Adjective inflection**
	1. Checks against a dictionary of known irregularities (e.g. little/less/least)
	2. Applies inflection based on:
		* Number of syllables
		* word ending

* **Noun inflection**
	1. Dictionary lookup (known irregularities e.g. octopus/octopi & uncountable words)
	2. Identifies whether the word is plural or singular based on:
		* Dictionary
		* Machine learned regular expressions 
	3. Applies transformation based on ending and word pattern (vowels, consonants and word endings)

* **Verb conjugation**
	1. Dictionary lookup (known irregularities + 4000 common verbs)
	2. If the passed verb is identified as infinitive, it then applies regular expression transformations that are based on word endings, vowels and consonant phonetics.
	3. Tries to trim character from the beginning of the verb, thus solving prefixes (e.g. undergoes, overthrown)
	4. Tries to stem the word and get the infinitive form, then apply regular expression transformations.
	5. Applies regular expressions.


## How accurate is it?

First of all, unless you have a dictionary of all the words and verbs that exist in English, you can't really write a regular expression or an algorithm and expect to have a 100% success rate. English has been adopting words from a lot of different languages (French, Greek and Latin for example), and each one of these languages has its own rules of pluralization and singularization, let alone verb conjugation.

Even with dictionaries you'll have the problem of complex and made up words like `maskedlocation`, and you might have to add dictionaries for specialties (like medicine which does actually have its own dictionary). 

However, I think what you'll find in this library is what can be achieved with the least amount of compromise.

I've used a set of rules (for detection/transformation) in combination with an exceptions list.

However, testing the library was more challenging than anticipated. If you have any case inaccuracy or false positives **please** submit an issue.

And of course, You can clone this repository, install `mocha` and test it for yourself, and you'll see how it passes the **9900** tests successfully.


## License

License: The MIT License (MIT) - Copyright (c) 2017 Alex Corvi
