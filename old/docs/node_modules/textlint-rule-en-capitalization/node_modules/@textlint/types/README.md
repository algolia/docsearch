# @textlint/types

Type definition and Typed object package for textlint and textlint rule.

If you import types from `@textlint/kernel` in your rule module, please use `@textlint/types` instead of it.

## Types

### Rule types

Rule types includes following definition.

- Rule module types
- Rule report function types
- Rule Context types

Rule types is depended from textlint's rule module and `@textlint/kernel`.
By contrasts, textlint's rule module should not depended on `@textlint/kernel`

- OK: Rule types <--- Rule module
- OK: Rule types <--- Kernel module
- NG: Kernel module <--- Rule module
- NG: Kernel module ---> Rule module

### Source

Source type includes following definition.

- Abstraction layer of source code/text

### Other

This package also includes other utilities for typing.
It is similar meaning with [@babel/types](https://babeljs.io/docs/en/babel-types).

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @textlint/types

## Usage

```ts
import { TextlintSourceCode, TextlintSourceCodeArgs, TextlintSourceCodeLocation, TextlintSourceCodePosition, TextlintSourceCodeRange } from "@textlint/types";
import { TextlintRuleContextFixCommand } from "@textlint/types";
import { TextlintRuleContextFixCommandGenerator } from "@textlint/types";
import { TextlintRuleError, TextlintRuleErrorPadding, TextlintRuleReportedObject } from "@textlint/types";
import { TextlintRuleSeverityLevel } from "@textlint/types";
import { TextlintRuleContext, TextlintRuleContextArgs, TextlintRuleContextReportFunction, TextlintRuleContextReportFunctionArgs } from "@textlint/types";
import { TextlintRuleOptions } from "@textlint/types";
import { TextlintRuleReporter, TextlintFixableRuleModule, TextlintRuleModule, TextlintRuleReportHandler } from "@textlint/types";
import { TextlintFilterRuleContext, TextlintFilterRuleShouldIgnoreFunction, TextlintFilterRuleShouldIgnoreFunctionArgs } from "@textlint/types";
import { TextlintFilterRuleModule, TextlintFilterRuleOptions, TextlintFilterRuleReporter, TextlintFilterRuleReportHandler } from "@textlint/types";
import { TextlintPluginCreator, TextlintPluginOptions, TextlintPluginProcessor, TextlintPluginProcessorConstructor } from "@textlint/types";

```

## Changelog

See [Releases page](https://github.com/textlint/textlint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint/textlint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
