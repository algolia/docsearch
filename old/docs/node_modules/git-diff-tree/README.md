# git-diff-tree

Shelling out to [git-diff-tree(1)](https://www.kernel.org/pub/software/scm/git/docs/git-diff-tree.html) in a Node streamy fashion.

[![build status](https://secure.travis-ci.org/alessioalex/git-diff-tree.png)](http://travis-ci.org/alessioalex/git-diff-tree)

## Usage

```js
gitDiffTree(repoPath, [options]);
```

Where options defaults to:

```js
{
  rev : 'HEAD',
  originalRev : '--root',
  // don't output data for files that have more lines changed than allowed
  MAX_DIFF_LINES_PER_FILE: 300,
  // when the diff output is bigger than the limit destroy the stream
  MAX_DIFF_SIZE: (3 * 1024 * 1024) // 3 Mb
}
```

Example:

```js
var gitDiffTree = require('git-diff-tree');
var path = require('path');
var repoPath = path.resolve(process.env.REPO || (__dirname + '/../.git'));

gitDiffTree(repoPath).on('data', function(type, data) {
  if (type === 'raw') {
    console.log('RAW DATA');
  } else if (type === 'patch') {
    console.log('PATCH DATA');
  } else if (type === 'stats') {
    console.log('FILE STATS');
  } else if (type === 'noshow') {
    console.log('Diffs not shown because files were too big');
  }
  console.log('------ \n');
  console.log(data);
  console.log('=================\n');
  // console.log(type, data);
}).on('error', function(err) {
  console.log('OH NOES!!');
  throw err;
}).on('cut', function() {
  console.log('-----------------');
  console.log('Diff to big, got cut :|');
}).on('end', function() {
  console.log('-----------------');
  console.log("That's all folks");
});
```

## Tests

```
npm test
```

## License

MIT
