# unified-args

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Interface for creating CLIs around [**unified**][unified] processors.
Wrapper around [`unifiedjs/unified-engine`][engine] to configure it with
command-line arguments.
Should be `require`d and configured in an executable script, on its own, as it
handles the whole process.

[`unifiedjs.github.io`][site], the website for **unified** provides a good
overview about what unified can do.
Make sure to visit it and try its introductionary [Guides][].

## Install

[npm][]:

```sh
npm install unified-args
```

## Use

This example creates a CLI for [**remark**][remark], loading `remark-` plugins,
searching for markdown files, and loading [configuration][config-file] and
[ignore][ignore-file] files.

`cli` (you can make it runnable with: `chmod +x cli`):

```js
#!/usr/bin/env node
'use strict'

var start = require('unified-args')
var extensions = require('markdown-extensions')
var remark = require('remark')
var pack = require('remark/package.json')

var name = pack.name

start({
  processor: remark,
  name: name,
  description: pack.description,
  version: pack.version,
  pluginPrefix: name,
  extensions: extensions,
  packageField: name + 'Config',
  rcName: '.' + name + 'rc',
  ignoreName: '.' + name + 'ignore'
})
```

## Table of Contents

*   [API](#api)
    *   [start(configuration)](#startconfiguration)
*   [CLI](#cli)
    *   [--help](#--help)
    *   [--version](#--version)
    *   [--output \[path\]](#--output-path)
    *   [--rc-path &lt;path>](#--rc-path-path)
    *   [--ignore-path &lt;path>](#--ignore-path-path)
    *   [--setting &lt;settings>](#--setting-settings)
    *   [--report &lt;reporter>](#--report-reporter)
    *   [--use &lt;plugin>](#--use-plugin)
    *   [--ext &lt;extensions>](#--ext-extensions)
    *   [--watch](#--watch)
    *   [--tree](#--tree)
    *   [--tree-in](#--tree-in)
    *   [--tree-out](#--tree-out)
    *   [--inspect](#--inspect)
    *   [--quiet](#--quiet)
    *   [--silent](#--silent)
    *   [--frail](#--frail)
    *   [--file-path &lt;path>](#--file-path-path)
    *   [--stdout](#--stdout)
    *   [--color](#--color)
    *   [--config](#--config)
    *   [--ignore](#--ignore)
*   [Diagnostics](#diagnostics)
*   [Debugging](#debugging)
*   [Contribute](#contribute)
*   [License](#license)

## API

### `start(configuration)`

Create a CLI for a [**unified**][unified] processor.

###### `configuration`

All options are required.

*   `processor` ([`Processor`][unified-processor])
    — Processor to transform files
    (engine: [`processor`][engine-processor])
*   `name` (`string`)
    — Name of executable
*   `description` (`string`)
    — Description of executable
*   `version` (`string`)
    — Version of executable
*   `extensions` (`Array.<string>`)
    — Default file [extensions][ext] to include
    (engine: [`extensions`][engine-extensions])
*   `ignoreName` (`string`)
    — Name of [ignore files][ignore-file] to load
    (engine: [`ignoreName`][engine-ignore-name])
*   `rcName` (`string`)
    — Name of [configuration files][config-file] to load
    (engine: [`rcName`][engine-rc-name])
*   `packageField` (`string`)
    — Property at which [configuration][config-file] can be found in
    `package.json` files
    (engine: [`packageField`][engine-package-field])
*   `pluginPrefix` (`string`)
    — Prefix to use when searching for [plug-ins][use]
    (engine: [`pluginPrefix`][engine-plugin-prefix])

## CLI

CLIs created with **unified-args**, such as the [example][usage] above, creates
an interface similar to the below (run `cli --help` for accurate information):

```txt
Usage: remark [options] [path | glob ...]

  Markdown processor powered by plugins

Options:

  -h  --help                output usage information
  -v  --version             output version number
  -o  --output [path]       specify output location
  -r  --rc-path <path>      specify configuration file
  -i  --ignore-path <path>  specify ignore file
  -s  --setting <settings>  specify settings
  -e  --ext <extensions>    specify extensions
  -u  --use <plugins>       use plugins
  -w  --watch               watch for changes and reprocess
  -q  --quiet               output only warnings and errors
  -S  --silent              output only errors
  -f  --frail               exit with 1 on warnings
  -t  --tree                specify input and output as syntax tree
      --report <reporter>   specify reporter
      --file-path <path>    specify path to process as
      --tree-in             specify input as syntax tree
      --tree-out            output syntax tree
      --inspect             output formatted syntax tree
      --[no-]stdout         specify writing to stdout (on by default)
      --[no-]color          specify color in report (on by default)
      --[no-]config         search for configuration files (on by default)
      --[no-]ignore         search for ignore files (on by default)

Examples:

  # Process `input.md`
  $ remark input.md -o output.md

  # Pipe
  $ remark < input.md > output.md

  # Rewrite all applicable files
  $ remark . -o
```

All non-options are seen as input and can be:

*   Paths (`cli readme.txt`) and [globs][glob] (`cli *.txt`) pointing to files
    to load
*   Paths (`cli test`) and globs (`cli fixtures/{in,out}`) pointing to
    directories.
    These are searched for files with known [extensions][ext] which are not
    ignored by patterns in [ignore files][ignore-file].
    The default behaviour is to exclude files in `node_modules` and hidden
    directories (those starting with a dot: `.`) unless explicitly given

<!-- Options: -->

*   **Default**: none
*   **Engine**: [`files`][engine-files]

### `--help`

```sh
cli --help
```

Output short usage information.

*   **Default**: off
*   **Alias**: `-h`

### `--version`

```sh
cli --version
```

Output version number.

*   **Default**: off
*   **Alias**: `-v`

### `--output [path]`

```sh
cli . --output
cli . --output doc
cli input.txt --output doc/output.text
```

Whether to write successfully processed files, and where to.
Can be set from [configuration files][config-file].

*   If output is **not** given, files are not written to the file system
*   If output is given **without** `path`, input files are overwritten when
    successful
*   If output is given with `path` and it points to an existing directory,
    files are written to that directory (intermediate directories are not
    created)
*   If output is given with `path`, the parent directory of that path
    exists, and one file is processed, the file is written to the given
    path

<!-- Options: -->

*   **Default**: off
*   **Alias**: `-o`
*   **Engine**: [`output`][engine-output]

### `--rc-path <path>`

```sh
cli . --rc-path config.json
```

File path to a JSON [configuration file][config-file] to load, regardless of
[`--config`][config].

*   **Default**: none
*   **Alias**: `-r`
*   **Engine**: [`rcPath`][engine-rc-path]

### `--ignore-path <path>`

```sh
cli . --ignore-path .gitignore
```

File path to an [ignore file][ignore-file] to load, regardless of
[`--ignore`][ignore].

*   **Default**: none
*   **Alias**: `-i`
*   **Engine**: [`ignorePath`][engine-ignore-path]

### `--setting <settings>`

```sh
cli input.txt --setting alpha:true
cli input.txt --setting bravo:true --setting '"charlie": "delta"'
cli input.txt --setting echo-foxtrot:-2
cli input.txt --setting 'golf: false, hotel-india: ["juliet", 1]'
```

Configuration for the parser and compiler of the processor.
Can be set from [configuration files][config-file].

The given settings are [JSON5][], with one exceptions: surrounding braces must
not be used: `"foo": 1, "bar": "baz"` is valid

*   **Default**: none
*   **Alias**: `-s`
*   **Engine**: [`settings`][engine-settings]

### `--report <reporter>`

```sh
cli input.txt --report ./reporter.js
cli input.txt --report vfile-reporter-json
cli input.txt --report json
cli input.txt --report json=pretty:2
cli input.txt --report 'json=pretty:"\t"'
cli input.txt --report pretty --report json # only last one is used
```

[Reporter][] to load by its name or path, optionally with options, and use to
report metadata about eevery processed file.

To pass options, follow the name by an equals sign (`=`) and settings, which
have the same in syntax as [`--setting <settings>`][setting].

The prefix `vfile-reporter-` can be omitted.
Prefixed reporters are preferred over modules without prefix.

If multiple reporters are given, the last one is used.

*   **Default**: none, which uses [`vfile-reporter`][vfile-reporter].
*   **Engine**: [`reporter`][engine-reporter] and
    [`reporterOptions`][engine-reporter-options].

###### Note

The [`quiet`][quiet], [`silent`][silent], and [`color`][color] options may not
work with the used reporter.
If they are given, they are preferred over the same properties in reporter
settings.

### `--use <plugin>`

```sh
cli input.txt --use man
cli input.txt --use 'toc=max-depth:3'
```

Plugin to load by its name or path, optionally with options, and use on every
processed file.
Can be set from [configuration files][config-file].

To pass options, follow the plugin by an equals sign (`=`) and settings, which
have the same in syntax as [`--setting <settings>`][setting].

Plugins prefixed with the [configured `pluginPrefix`][configured] are preferred
over modules without prefix.

*   **Default**: none
*   **Alias**: `-u`
*   **Engine**: [`plugins`][engine-plugins]

### `--ext <extensions>`

```sh
cli . --ext html
cli . --ext html,htm
```

Specify one or more extensions to include when searching for files.

If no extensions are given, uses the [configured `extensions`][configured].

*   **Default**: Configured [`extensions`][configured]
*   **Alias**: `-e`
*   **Engine**: [`extensions`][engine-extensions]

### `--watch`

```sh
cli . -qwo
```

Yields:

```txt
Watching... (press CTRL+C to exit)
Note: Ignoring `--output` until exit.
```

Process as normal, then watch found files and reprocess when they change.

The watch is stopped when `SIGINT` is received (usually done by pressing
`CTRL-C`).

If [`--output`][output] is given **without** `path` it is not honoured, to
prevent an infinite loop.
On operating systems other than Windows, when the watch closes, a final process
runs including `--output`.

*   **Default**: off
*   **Alias**: `-w`

### `--tree`

```sh
cli --tree < input.json > output.json
```

Treat input as a syntax tree in JSON and output the transformed syntax tree.
This runs neither the [parsing nor the compilation phase][description].

*   **Default**: off
*   **Alias**: `-t`
*   **Engine**: [`tree`][engine-tree]

### `--tree-in`

```sh
cli --tree-in < input.json > input.txt
```

Treat input as a syntax tree in JSON.
This does not run the [parsing phase][description].

*   **Default**: off
*   **Engine**: [`treeIn`][engine-tree-in]

### `--tree-out`

```sh
cli --tree-out < input.txt > output.json
```

Output the transformed syntax tree.
This does not run the [compilation phase][description].

*   **Default**: off
*   **Engine**: [`treeOut`][engine-tree-out]

### `--inspect`

```sh
cli --inspect < input.txt
```

Output the transformed syntax tree, formatted with
[`unist-util-inspect`][inspect].
This does not run the [compilation phase][description].

*   **Default**: off
*   **Engine**: [`inspect`][engine-inspect]

### `--quiet`

```sh
cli input.txt --quiet
```

Ignore files without any messages in the report.
The default behaviour is to show a success message.

*   **Default**: off
*   **Alias**: `-q`
*   **Engine**: [`quiet`][engine-quiet]

###### Note

This option may not work depending on the reporter given in
[`--report`][report].

###### Note

The [`quiet`][quiet], [`silent`][silent], and [`color`][color] options may not
work with the used reporter.

### `--silent`

```sh
cli input.txt --silent
```

Show only fatal errors in the report.
Turns [`--quiet`][quiet] on.

*   **Default**: off
*   **Alias**: `-S`
*   **Engine**: [`silent`][engine-silent]

###### Note

This option may not work depending on the reporter given in
[`--report`][report].

### `--frail`

```sh
cli input.txt --frail
```

Exit with a status code of `1` if warnings or errors occur.
The default behaviour is to exit with `1` on errors.

*   **Default**: off
*   **Alias**: `-f`
*   **Engine**: [`frail`][engine-frail]

### `--file-path <path>`

```sh
cli --file-path input.txt < input.txt > doc/output.txt
```

File path to process the given file on **stdin**(4) as, if any.

*   **Default**: none
*   **Engine**: [`filePath`][engine-file-path]

### `--stdout`

```sh
cli input.txt --no-stdout
```

Whether to write a processed file to **stdout**(4).

*   **Default**: off if [`--output`][output] or [`--watch`][watch] are given, or
    if multiple files could be processed
*   **Engine**: [`out`][engine-out]

### `--color`

```sh
cli input.txt --no-color
```

Whether to output ANSI color codes in the report.

*   **Default**: whether the terminal [supports colour][supports-color]
*   **Engine**: [`color`][engine-color]

###### Note

This option may not work depending on the reporter given in
[`--report`][report].

### `--config`

```sh
cli input.txt --no-config
```

Whether to load [configuration files][config-file].

Searches for files with the [configured `rcName`][configured]: `$rcName` (JSON),
`$rcName.js` (JavaScript), `$rcName.yml` (YAML), and `$rcName.yaml` (YAML); and
looks for the [configured `packageField`][configured] in `package.json` files.

*   **Default**: on
*   **Engine**: [`detectConfig`][engine-detect-config]

### `--ignore`

```sh
cli . --no-ignore
```

Whether to load [ignore files][ignore-file].

Searches for files named [`$ignoreName`][configured].

*   **Default**: on
*   **Engine**: [`detectIgnore`][engine-detect-ignore]

## Diagnostics

CLIs created with **unified-args** exit with:

*   `1` on fatal errors
*   `1` on warnings in [`--frail`][frail] mode, `0` on warnings otherwise
*   `0` on success

## Debugging

CLIs can be debugged by setting the [`DEBUG`][debug] environment variable to
`*`, such as `DEBUG="*" cli example.txt`.

## Contribute

See [`contributing.md`][contributing] in [`unifiedjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/unifiedjs/unified-args.svg

[build]: https://travis-ci.org/unifiedjs/unified-args

[coverage-badge]: https://img.shields.io/codecov/c/github/unifiedjs/unified-args.svg

[coverage]: https://codecov.io/github/unifiedjs/unified-args

[downloads-badge]: https://img.shields.io/npm/dm/unified-args.svg

[downloads]: https://www.npmjs.com/package/unified-args

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/unifiedjs/.github

[contributing]: https://github.com/unifiedjs/.github/blob/master/contributing.md

[support]: https://github.com/unifiedjs/.github/blob/master/support.md

[coc]: https://github.com/unifiedjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[debug]: https://github.com/visionmedia/debug#debug

[glob]: https://github.com/isaacs/node-glob#glob-primer

[supports-color]: https://github.com/chalk/supports-color

[unified]: https://github.com/unifiedjs/unified

[engine]: https://github.com/unifiedjs/unified-engine

[unified-processor]: https://github.com/unifiedjs/unified#processor

[remark]: https://github.com/remarkjs/remark

[config-file]: https://github.com/unifiedjs/unified-engine/blob/master/doc/configure.md

[ignore-file]: https://github.com/unifiedjs/unified-engine/blob/master/doc/ignore.md

[description]: https://github.com/unifiedjs/unified#description

[engine-processor]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsprocessor

[engine-files]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsfiles

[engine-output]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsoutput

[engine-rc-path]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsrcpath

[engine-rc-name]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsrcname

[engine-package-field]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionspackagefield

[engine-ignore-name]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsignorename

[engine-ignore-path]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsignorepath

[engine-reporter]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsreporter

[engine-reporter-options]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsreporteroptions

[engine-settings]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionssettings

[engine-plugins]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsplugins

[engine-plugin-prefix]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionspluginprefix

[engine-extensions]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsextensions

[engine-tree]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionstree

[engine-tree-in]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionstreein

[engine-tree-out]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionstreeout

[engine-inspect]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsinspect

[engine-quiet]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsquiet

[engine-silent]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsilent

[engine-frail]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsfrail

[engine-file-path]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsfilepath

[engine-out]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsout

[engine-color]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionscolor

[engine-detect-config]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsdetectconfig

[engine-detect-ignore]: https://github.com/unifiedjs/unified-engine/blob/master/doc/options.md#optionsdetectignore

[configured]: #startconfiguration

[usage]: #use

[watch]: #--watch

[output]: #--output-path

[config]: #--config

[ext]: #--ext-extensions

[use]: #--use-plugin

[ignore]: #--ignore

[setting]: #--setting-settings

[report]: #--report-reporter

[quiet]: #--quiet

[silent]: #--silent

[color]: #--color

[frail]: #--frail

[site]: https://unifiedjs.github.io

[guides]: https://unifiedjs.github.io/#guides

[reporter]: https://github.com/vfile/vfile#reporters

[vfile-reporter]: https://github.com/vfile/vfile-reporter

[inspect]: https://github.com/syntax-tree/unist-util-inspect

[json5]: https://github.com/json5/json5
