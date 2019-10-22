# js-levenshtein [![Build Status](https://travis-ci.org/gustf/js-levenshtein.svg?branch=master)](https://travis-ci.org/gustf/js-levenshtein)

The most efficient JS implementation calculating the Levenshtein distance, i.e. the difference between two strings.

Based on Wagner-Fischer dynamic programming algorithm, optimized for speed and memory
 - use a single distance vector instead of a matrix
 - loop unrolling on the outer loop
 - remove common prefixes/postfixes from the calculation
 - minimize the number of comparisons
 
## Install

```
$ npm install --save js-levenshtein
```


## Usage

```js
const levenshtein = require('js-levenshtein');

levenshtein('kitten', 'sitting');
//=> 3
```


## Benchmark

```
$ npm run bench
  
                      50 paragraphs, length max=500 min=240 avr=372.5
             126 op/s » js-levenshtein
              81 op/s » talisman
              74 op/s » levenshtein-edit-distance
              73 op/s » leven
              34 op/s » fast-levenshtein

                      100 sentences, length max=170 min=6 avr=57.5
           2,441 op/s » js-levenshtein
           1,615 op/s » talisman
           1,365 op/s » levenshtein-edit-distance
           1,342 op/s » leven
             687 op/s » fast-levenshtein

                      2000 words, length max=20 min=3 avr=9.5
           2,607 op/s » js-levenshtein
           1,783 op/s » talisman
           1,830 op/s » levenshtein-edit-distance
           1,608 op/s » leven
           1,119 op/s » fast-levenshtein
```

Benchmarks was performed with node v8.6.0 on a MacBook pro 15", 2.9 GHz Intel Core i7

## License

MIT © Gustaf Andersson