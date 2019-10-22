# textlint-rule-helper [![Build Status](https://travis-ci.org/textlint/textlint-rule-helper.svg?branch=master)](https://travis-ci.org/textlint/textlint-rule-helper)

This is helper library for creating [textlint](https://github.com/textlint/textlint "textlint") rule.

## Installation

```
npm install textlint-rule-helper
```

## API

### class RuleHelper

Helper for traversing TxtAST.

#### ruleHelper.getParents(node) : TxtNode[]

Get parents of node.
The parent nodes are returned in order from the closest parent to the outer ones.
`node` is not contained in the results.

**Params**

- node `TxtNode` - the node is start point.

#### ruleHelper.isChildNode(node, types): boolean

Return true if `node` is wrapped any one of node `types`.

**Params**

- node `TxtNode` - is target node
- types `Array.<string>` - are wrapped target node

### class IgnoreNodeManager

You can manager ignoring range in texts.

#### ignore(node): void

Add the range of `node` to ignoring range list.

**Params**

-  node `TxtNode` - target node

#### ignoreRange(range): void

Add the `range` to ignoring range list

**Params**

- range `[number, number]`

#### ignoreChildrenByTypes(targetNode, ignoredNodeTypes): void

if the children node has the type that is included in `ignoredNodeTypes`,
Add range of children node of `node` to ignoring range list,

**Params**

- targetNode `TxtNode` - target node
- ignoredNodeTypes `Array.<string>` - are node types for ignoring

#### isIgnoredIndex(index): boolean

If the `index` is included in ignoring range list, return true.
`index` should be absolute position.

**Params**

-  index `number` - index value start with 0

#### isIgnoredRange(range): boolean

If the `range` is included in ignoring range list, return true.
`range` should includes absolute positions.

**Params**

- range `[number, number]`

#### isIgnored(node): boolean

If the `range` of `node` is included in ignoring range list, return true.

**Params**

-  node `TxtNode` - target node

### RuleHelper and IgnoreNodeManager Example

A rule for [textlint](https://github.com/textlint/textlint "textlint").

```js
import { RuleHelper } from "textlint-rule-helper";
import { IgnoreNodeManager } from "textlint-rule-helper";
module.exports = function(context) {
  var helper = new RuleHelper(context);
  var ignoreNodeManager = new IgnoreNodeManager();
  var exports = {};
  var reportingErrors = [];
  exports[context.Syntax.Paragraph] = function(node) {
    // Add `Code` node to ignoring list
    ignoreNodeManager.ignoreChildrenByTypes(node, [context.Syntax.Code]);
    // do something
    reportingErrors.push(node, ruleError);
  };
  exports[context.Syntax.Str] = function(node) {
    // parent nodes is any one Link or Image.
    if (helper.isChildNode(node, [context.Syntax.Link, context.Syntax.Image])) {
      return;
    }
    // get Parents
    var parents = helper.getParents(node);
  };
  exports[Syntax.Document + ":exit"] = function(node) {
    reportingErrors.forEach(function(node, ruleError) {
      // if the error is ignored, don't report
      if (ignoreNodeManager.isIgnored(node)) {
        return;
      }
      // report actual
    });
  };
  return exports;
};
```

## `wrapReportHandler(context, options, handler): TextlintRuleReportHandler`

**Params**

- context `TextlintRuleContent` - rule context object
- options `{{ignoreNodeTypes: TxtNodeType[]}}` - options
- handler `(report: (node: AnyTxtNode, ruleError: TextlintRuleError) => void) => any` - handler should return a object

`wrapReportHandler` is high level API that use `RuleHelper` and `IgnoreNodeManager`.
It aim to easy to ignore some Node type for preventing unnecessary error report.

Example: ignore `BlockQuote` and `Code` node.

```js
import { wrapReportHandler } from "textlint-rule-helper";
const reporter = function (context) {
   const { Syntax, getSource } = context;
   return wrapReportHandler(context, {
       ignoreNodeTypes: [Syntax.BlockQuote, Syntax.Code]
   },report => { // <= wrap version of context.report
       // handler should return a rule handler object
       return {
           [Syntax.Paragraph](node) {
               const text = getSource(node);
               const index = text.search("code");
               /*
                * Following text is matched, but it will not reported.
                * ----
                * This is `code`.
                * > code
                * ----
                */
                if(index === -1){
                    return;
                }
                report(node, new context.RuleError(item.name, {
                   index
                }));
           }
       }
   });
};
module.exports = reporter;
```

The Mechanism of `wrapReportHandler`: `

- Ignore all parent nodes that are matched with `ignoreNodeTypes`.
- Ignore all children nodes that are matched with `ignoreNodeTypes`.
    - `wrapReportHandler` create custom `report` function that ignore matched node

## Use-Case

You can see real use-case of this helper library.

- [textlint/rule-advanced.md at master · textlint/textlint](https://github.com/textlint/textlint/blob/master/docs/rule-advanced.md "textlint/rule-advanced.md at master · textlint/textlint")
- [textlint-rule-no-mix-dearu-desumasu](https://github.com/azu/textlint-rule-no-mix-dearu-desumasu "textlint-rule-no-mix-dearu-desumasu")

## ChangeLog

- [Releases · textlint/textlint-rule-helper](https://github.com/textlint/textlint-rule-helper/releases "Releases · textlint/textlint-rule-helper")

## Development

```
# watch
npm run watch
# build
npm run build
# test
npm run test
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
