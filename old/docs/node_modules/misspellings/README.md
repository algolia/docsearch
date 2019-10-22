# misspellings

[![wercker status](https://app.wercker.com/status/95ab8569948e1fea2444aac46c24d7cd/s/master "wercker status")](https://app.wercker.com/project/bykey/95ab8569948e1fea2444aac46c24d7cd) [![npm version](https://badge.fury.io/js/misspellings.svg)](https://badge.fury.io/js/misspellings) [![GitHub license](https://img.shields.io/github/license/io-monad/misspellings.svg)](LICENSE)

JavaScript module to serve the list of common misspellings from [Wikipedia: Lists of common misspellings](https://en.wikipedia.org/wiki/Wikipedia:Lists_of_common_misspellings/For_machines).

## Installing

    npm install --save misspellings

## Usage

```js
var misspellings = require("misspellings");

// Dictionary access
var dict = misspellings.dict();
console.log(dict["adress"]);     // => "address"
console.log(dict["boaut"]);      // => "bout,boat,about"  (comma-separated string)
console.log(dict["Amercia"]);    // => "America"
console.log(dict["amercia"]);    // => undefined

// Lower-case dictionary
var lcDict = misspellings.dict({ lowerCase: true });
console.log(lcDict["Amercia"]);  // => undefined
console.log(lcDict["amercia"]);  // => "America"

// Get correct words for misspelling word
console.log(misspellings.correctWordsFor("adress"));
  // => ["address"]   (Always returns an array)
console.log(misspellings.correctWordsFor("boaut"));
  // => ["bout", "boat", "about"]
console.log(misspellings.correctWordsFor("non-exist"));
  // => []
console.log(misspellings.correctWordsFor("Amercia"));
  // => ["America"]
console.log(misspellings.correctWordsFor("amercia"));
  // => ["America"]   (Case-insensitive by default)
console.log(misspellings.correctWordsFor("amercia", { caseSensitive: true }));
  // => []

// Correct all misspellings in a string
console.log(misspellings.correct("mispelling is mispelled"));
  // => "misspelling is misspelled"
console.log(misspellings.correct("Mispelling is Mispelled"));
  // => "Misspelling is Misspelled"  (case-insensitive and preserves cases by default)
console.log(misspellings.correct("Mispelling is mispelled", { caseSensitive: true }));
  // => "Mispelling is misspelled"
console.log(misspellings.correct("Mispelling is Mispelled", { overrideCases: true }));
  // => "misspelling is misspelled"

// RegExp to search misspellings
var re = misspellings.regexp("g");
  //  ...or...
var re = new RegExp(misspellings.pattern(), "g");

console.log("mispelling is mispelled".match(re));
  // => ["mispelling", "mispelled"]
```

## API

See [API documentation](API.md)

## Build

    $ npm install
    $ npm run build

And Babel-translated source files go into `lib` directory.

To update documents and dictionaries, run:

    $ npm run update

## Testing

    $ npm test

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
