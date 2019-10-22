# cpx

[![npm version](https://img.shields.io/npm/v/cpx.svg)](https://www.npmjs.com/package/cpx)
[![Downloads/month](https://img.shields.io/npm/dm/cpx.svg)](http://www.npmtrends.com/cpx)
[![Build Status](https://travis-ci.org/mysticatea/cpx.svg?branch=master)](https://travis-ci.org/mysticatea/cpx)
[![codecov](https://codecov.io/gh/mysticatea/cpx/branch/master/graph/badge.svg)](https://codecov.io/gh/mysticatea/cpx)
[![Dependency Status](https://david-dm.org/mysticatea/cpx.svg)](https://david-dm.org/mysticatea/cpx)

Copy file globs, watching for changes.

This module provides a CLI tool like `cp`, but with watching.


## Installation

```
npm install cpx
```


## Usage

```
Usage: cpx <source> <dest> [options]

    Copy files, watching for changes.

        <source>  The glob of target files.
        <dest>    The path of a destination directory.

Options:

    -c, --command <command>   A command text to transform each file.
    -C, --clean               Clean files that matches <source> like pattern in
                              <dest> directory before the first copying.
    -L, --dereference         Follow symbolic links when copying from them.
    -h, --help                Print usage information.
    --include-empty-dirs      The flag to copy empty directories which is
                              matched with the glob.
    --no-initial              The flag to not copy at the initial time of watch.
                              Use together '--watch' option.
    -p, --preserve            The flag to copy attributes of files.
                              This attributes are uid, gid, atime, and mtime.
    -t, --transform <name>    A module name to transform each file. cpx lookups
                                the specified name via "require()".
    -u, --update              The flag to not overwrite files on destination if
                              the source file is older.
    -v, --verbose             Print copied/removed files.
    -V, --version             Print the version number.
    -w, --watch               Watch for files that matches <source>, and copy
                              the file to <dest> every changing.
```


## Example

```
$ cpx "src/**/*.{html,png,jpg}" app --watch
```

This example will copy html/png/jpg files from `src` directory to `app`
directory, keeping file tree structure.
Whenever the files are changed, copy them.

> Since Bash expands globs, requires to enclose it with double quotes.

You can use together [Browserify](http://browserify.org).

```
$ cpx "src/**/*.{html,png,jpg}" app -w & watchify src/index.js -o app/index.js
```

You can use shell commands to convert each file.

```
$ cpx "src/**/*.js" app -w -c "babel --source-maps inline"
```

You can use the transform packages for Browserify.

```
$ cpx "src/**/*.js" app -w -t babelify -t uglifyify
```

It maybe can use to add header comment, to optimize images, or etc...


## Node.js API

You can use this module as a node module.

```js
var cpx = require("cpx");
```

### cpx.copy

```ts
cpx.copy(source, dest, options, callback)
cpx.copy(source, dest, callback)
```

- **source** `{string}` -- A file glob of copy targets.
- **dest** `{string}` -- A file path of a destination directory.
- **options** `{object}`
  - **options.clean** `{boolean}` -- The flag to remove files that copied on past before copy. Default: `false`.
  - **options.dereference** `{boolean}` -- The flag to follow symbolic links when copying from them. Default: `false`.
  - **options.includeEmptyDirs** `{boolean}` -- The flag to copy empty directories which is matched with the glob. Default: `false`.
  - **options.initialCopy** `{boolean}` -- The flag to not copy at the initial time of watch. This is for `cpx.watch()`. Default: `true`.
  - **options.preserve** `{boolean}` -- The flag to copy uid, gid, atime, and mtime of files. Default: `false`.
  - **options.transform** `{((filepath: string) => stream.Transform)[]}` -- Functions that creates a `stream.Transform` object to transform each copying file.
  - **options.update** `{boolean}` -- The flag to not overwrite files on destination if the source file is older. Default: `false`.
- **callback** `{(err: Error|null) => void}` -- A function that is called at done.

Copy files that matches with `source` glob to `dest` directory.

### cpx.copySync

```ts
cpx.copySync(source, dest, options)
cpx.copySync(source, dest)
```

A synchronous function of `cpx.copy`.

Arguments is almost same as `cpx.copy`.
But `options.transform` is not supported.

### cpx.watch

```ts
cpx.watch(source, dest, options)
cpx.watch(source, dest)
```

Copy files that matches with `source` glob string to `dest` directory.
After the first copy, starts observing.  And copy the files when every changes.

Arguments is same as `cpx.copy`.

`cpx.watch` returns an `EventEmitter`.

- `.on("copy", (e) => { ... })` : Be fired after file is copied. `e.srcPath` is a path of original file. `e.dstPath` is a path of new file.
- `.on("remove", (e) => { ... })` : Be fired after file is removed. `e.path` is a path of removed file.
- `.on("watch-raedy", () => { ... })` : Be fired when started watching files, after the first copying.
- `.on("watch-error", (err) => { ... })` : Be fired when occured errors during watching.

## Changelog

[GitHub Releases](https://github.com/mysticatea/cpx/releases)

## Contributing

Thank you for contributions!

### Bug Reports or Feature Requests

Please use GitHub Issues.

### Document Corrections

Please use GitHub Pull Requests.
I would especially thank for document corrections since I'm not familiar with English.

### Feature Implementing

Please use GitHub Pull Requests.

There are some npm-scripts to help developments.

- `npm test` - Run tests and collect coverage.
- `npm run build` - Make lib directory from src directory.
- `npm run clean` - Delete directories (folders) which are created by other commands.
- `npm run lint` - Run ESLint.
- `npm run watch` - Run tests (not collect coverage) when each file was modified.
- `npm run open-coverage` - Open the coverage report of the last `npm test` command with web browser.
