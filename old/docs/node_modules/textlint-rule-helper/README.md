# textlint-rule-helper

This is helper library for creating [textlint](https://github.com/textlint/textlint "textlint") rule.

## Installation

```
npm install textlint-rule-helper
```

## Usage - API

### class RuleHelper

Helper for traversing TxtAST.

#### ruleHelper.getParents(node) : TxtNode[]

Get parents of node.
The parent nodes are returned in order from the closest parent to the outer ones.
`node` is not contained in the results.

**Params**

- node `TxtNode` - the node is start point.

####ruleHelper.isChildNode(node, types): boolean

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

**Params**

-  index `number` - index value start with 0

#### isIgnoredRange(range): boolean

If the `range` is included in ignoring range list, return true.

**Params**

- range `[number, number]`

#### isIgnored(node): boolean

If the `range` of `node` is included in ignoring range list, return true.

**Params**

-  node `TxtNode` - target node

## Example

A rule for [textlint](https://github.com/textlint/textlint "textlint").

```js
var RuleHelper = require("textlint-rule-helper").RuleHelper;
var IgnoreNodeManager = require("textlint-rule-helper").IgnoreNodeManager;
module.exports = function (context) {
    var helper = new RuleHelper(context);
    var ignoreNodeManager = new IgnoreNodeManager()
    var exports = {}
    var reportingErrors = [];
    exports[context.Syntax.Paragraph] = function(node){
        // Add `Code` node to ignoring list
        ignoreNodeManager.ignoreChildrenByTypes(node, [context.Syntax.Code])
        // do something
        reportingErrors.push(node, ruleError);
    };
    exports[context.Syntax.Str] = function(node){
        // parent nodes is any one Link or Image.
        if(helper.isChildNode(node, [context.Syntax.Link, context.Syntax.Image]){
            return;
        }
        // get Parents
        var parents = helper.getParents(node);
    }
    [Syntax.Document + ":exit"](){
        reportingErrors.forEach(function(node, ruleError){
            // if the error is ignored, don't report
            if(ignoreNodeManager.isIgnored(node)){
                return;
            }
            // report actual
        });
    }
    return exports;
}
```

## Use-Case

You can see real use-case of this helper library.

- [textlint/rule-advanced.md at master · textlint/textlint](https://github.com/textlint/textlint/blob/master/docs/rule-advanced.md "textlint/rule-advanced.md at master · textlint/textlint")
- [azu/analyze-desumasu-dearu: 文の敬体(ですます調)、常体(である調)を解析するJavaScriptライブラリ](https://github.com/azu/analyze-desumasu-dearu "azu/analyze-desumasu-dearu: 文の敬体(ですます調)、常体(である調)を解析するJavaScriptライブラリ")

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
