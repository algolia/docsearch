# en-pos
A better English POS tagger written in JavaScript

### Installation and usage

Install via NPM:

```
npm i --save en-pos
```

**How to use**

```javascript
const Tag = require("en-pos").Tag;
var tags = new Tag(["this","is","my","sentence"])
.initial() // initial dictionary and pattern based tagging
.smooth() // further context based smoothing
.tags;
console.log(tags);
// ["DT","VBZ","PRP$","NN"]
```

## Annotation Specification

Annotation | Name | Example
--- | --- | ---
**`NN`** | Noun | `dog` `man`
**`NNS`** | Plural noun | `dogs` `men`
**`NNP`** | Proper noun | `London` `Alex`
**`NNPS`** | Plural proper noun | `Smiths`
**`VB`** | Base form verb | `be`
**`VBP`** | Present form verb | `throw`
**`VBZ`** | Present form (3rd person) | `throws`
**`VBG`** | Gerund form verb | `throwing`
**`VBD`** | Past tense verb | `threw`
**`VBN`** | Past participle verb | `thrown`
**`MD`** | Modal verb | `can` `shall` `will` `may` `must` `ought`
**`JJ`** | Adjective | `big` `fast`
**`JJR`** | Comparative adjective | `bigger`
**`JJS`** | Superlative adjective | `biggest`
**`RB`** | Adverb | `not` `quickly` `closely`
**`RBR`** | Comparative adverb | `less-closely` `faster`
**`RBS`** | Superlative adverb | `fastest`
**`DT`** | Determiner | `the` `a` `some` `both`
**`PDT`** | Predeterminer | `all` `quite`
**`PRP`** | Personal Pronoun | `I` `you` `he` `she`
**`PRP$`** | Possessive Pronoun | `I` `you` `he` `she`
**`POS`** | Possessive ending | `'s`
**`IN`** | Preposition | `of` `by` `in`
**`PR`** | Particle | `up` `off`
**`TO`** | *to* | `to`
**`WDT`** | Wh-determiner | `which` `that` `whatever` `whichever`
**`WP`** | Wh-pronoun | `who` `whoever` `whom` `what`
**`WP$`** | Wh-possessive | `whose`
**`WRB`** | Wh-adverb | `how` `where` 
**`EX`** | Expletive there | `there`
**`CC`** | Coordinating conjugation | `&` `and` `nor` `or`
**`CD`** | Cardinal Numbers | `1` `7` `77` `one`
**`LS`** | List item marker | `1` `B` `C` `One`
**`UH`** | Interjection | `ah` `oh` `oops`
**`FW`** | Foreign Words | `viva` `mon` `toujours`
**`,`** | Comma | `,`
**`:`** |Mid-sent punct | `:` `;` `...`
**`.`** | Sent-final punct. | `.` `!` `?`
**`(`** | Left parenthesis | `)` `}` `]`
**`)`** | Right parenthesis | `(` `{` `[`
**`#`** | Pound sign | `#`
**`$`** | Currency symbols | `$` `€` `£` `¥`
**`SYM`** | Other symbols | `+` `*` `/` `<` `>`
**`EM`** | Emojis & emoticons | `:)` `❤`

## Accuracy and performance

#### TL:DR;

- When smoothing is enabled: **96.43%** accuracy (processing 132K tokens in 38 seconds)
- When smoothing is disabled: **94.4%** accuracy (processing 132K tokens in 3 seconds)

----

As of 25 Jan 2017, this library scored **96.43%** at the [Penn Treebank](http://www.cis.upenn.edu/~treebank/) test (0.3% away from being a [state of the art tagger](https://www.aclweb.org/aclwiki/index.php?title=POS_Tagging_(State_of_the_art))).

Being written in JavaScript, I think it's safe to say that this is the most accurate JavaScript POS tagger, since the only JS library I know of is [pos-js](https://github.com/neopunisher/pos-js) which when I tested on the same treebank scored **87.8%**, though it was faster than my implementation when smoothing is enabled.

However, if performance is what's you're after rather than accuracy, then you have the option to disable smoothing in this library and this will marginally increase performance making this library even faster than pos-js but with far better accuracy (**94.4%**).

## Building from source and testing

- Build: `tsc` (requires typescript)
- Test: `node test/test.ts`

## Credits
* This project is an optimization and (almost complete) re-writing of [Compendium](https://github.com/Ulflander/compendium-js)'s POS tagger.
* **Compendium**'s tagger itself was based on **[fasttag](https://github.com/mark-watson/fasttag_v2)**.
* **Fasttag** is based on [Eric Brill's POS tagger](https://en.wikipedia.org/wiki/Brill_tagger).