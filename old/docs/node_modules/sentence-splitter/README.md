# sentence-splitter

Split {Japanese, English} text into sentences.

## Installation

    npm install sentence-splitter

**Requirements:**

- `Array.from`
- `Array#fill`

### CLI

    $ npm install -g sentence-splitter
    $ echo "This is a pen. But, this is not pen" | sentence-splitter
    This is a pen.
    But This is not pen


## Usage

```ts
/**
 * split `text` into Sentence node list.
 */
export declare function split(text: string): (TxtParentNode | TxtNode)[];
/**
 * Convert Paragraph Node to Paragraph node that convert children to Sentence node
 * This Node is based on TxtAST.
 * See https://github.com/textlint/textlint/blob/master/docs/txtnode.md
 */
export declare function splitAST(paragraphNode: TxtParentNode): TxtParentNode;
```

`TxtParentNode` and `TxtNode` is defined in [TxtAST](https://github.com/textlint/textlint/blob/master/docs/txtnode.md "TxtAST").

### Example

```js
import {split, Syntax} from "sentence-splitter";
let sentences = split(`There it is! I found it.
Hello World. My name is Jonas.`);
console.log(JSON.stringify(sentences, null, 4));
/*
{
    "type": "Paragraph",
    "children": [
        {
            "type": "Sentence",
            "raw": "There it is!",
            "value": "There it is!",
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 12
                }
            },
            "range": [
                0,
                12
            ],
            "children": [
                {
                    "type": "Str",
                    "raw": "There it is",
                    "value": "There it is",
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 0
                        },
                        "end": {
                            "line": 1,
                            "column": 11
                        }
                    },
                    "range": [
                        0,
                        11
                    ]
                },
                {
                    "type": "Punctuation",
                    "raw": "!",
                    "value": "!",
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 11
                        },
                        "end": {
                            "line": 1,
                            "column": 12
                        }
                    },
                    "range": [
                        11,
                        12
                    ]
                }
            ]
        },
        {
            "type": "WhiteSpace",
            "raw": " ",
            "value": " ",
            "loc": {
                "start": {
                    "line": 1,
                    "column": 12
                },
                "end": {
                    "line": 1,
                    "column": 13
                }
            },
            "range": [
                12,
                13
            ]
        },
        {
            "type": "Sentence",
            "raw": "I found it.\nHello World.",
            "value": "I found it.\nHello World.",
            "loc": {
                "start": {
                    "line": 1,
                    "column": 13
                },
                "end": {
                    "line": 2,
                    "column": 12
                }
            },
            "range": [
                13,
                37
            ],
            "children": [
                {
                    "type": "Str",
                    "raw": "I found it.",
                    "value": "I found it.",
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 13
                        },
                        "end": {
                            "line": 1,
                            "column": 24
                        }
                    },
                    "range": [
                        13,
                        24
                    ]
                },
                {
                    "type": "WhiteSpace",
                    "raw": "\n",
                    "value": "\n",
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 24
                        },
                        "end": {
                            "line": 2,
                            "column": 0
                        }
                    },
                    "range": [
                        24,
                        25
                    ]
                },
                {
                    "type": "Str",
                    "raw": "Hello World",
                    "value": "Hello World",
                    "loc": {
                        "start": {
                            "line": 2,
                            "column": 0
                        },
                        "end": {
                            "line": 2,
                            "column": 11
                        }
                    },
                    "range": [
                        25,
                        36
                    ]
                },
                {
                    "type": "Punctuation",
                    "raw": ".",
                    "value": ".",
                    "loc": {
                        "start": {
                            "line": 2,
                            "column": 11
                        },
                        "end": {
                            "line": 2,
                            "column": 12
                        }
                    },
                    "range": [
                        36,
                        37
                    ]
                }
            ]
        },
        {
            "type": "WhiteSpace",
            "raw": " ",
            "value": " ",
            "loc": {
                "start": {
                    "line": 2,
                    "column": 12
                },
                "end": {
                    "line": 2,
                    "column": 13
                }
            },
            "range": [
                37,
                38
            ]
        },
        {
            "type": "Sentence",
            "raw": "My name is Jonas.",
            "value": "My name is Jonas.",
            "loc": {
                "start": {
                    "line": 2,
                    "column": 13
                },
                "end": {
                    "line": 2,
                    "column": 30
                }
            },
            "range": [
                38,
                55
            ],
            "children": [
                {
                    "type": "Str",
                    "raw": "My name is Jonas",
                    "value": "My name is Jonas",
                    "loc": {
                        "start": {
                            "line": 2,
                            "column": 13
                        },
                        "end": {
                            "line": 2,
                            "column": 29
                        }
                    },
                    "range": [
                        38,
                        54
                    ]
                },
                {
                    "type": "Punctuation",
                    "raw": ".",
                    "value": ".",
                    "loc": {
                        "start": {
                            "line": 2,
                            "column": 29
                        },
                        "end": {
                            "line": 2,
                            "column": 30
                        }
                    },
                    "range": [
                        54,
                        55
                    ]
                }
            ]
        }
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 2,
            "column": 30
        }
    },
    "range": [
        0,
        55
    ],
    "raw": "There it is! I found it.\nHello World. My name is Jonas."
}
*/
```

## Node

This node is based on [TxtAST](https://github.com/textlint/textlint/blob/master/docs/txtnode.md "TxtAST").

### Node's type

- `Str`: Str node has `value`
- `Sentence`: Sentence Node has `Str`, `WhiteSpace`, or `Punctuation` nodes as children
- `WhiteSpace`: WhiteSpace Node has `\n`.
- `Punctuation`: Punctuation Node has `.`, `。`

Get these `Syntax` constants value from the module:

```js
import {Syntax} from "sentence-splitter";
console.log(Syntax.Sentence);// "Sentence"
```

### Node's interface

```ts
export interface WhiteSpaceNode extends TxtTextNode {
    readonly type: "WhiteSpace";
}

export interface PunctuationNode extends TxtTextNode {
    readonly type: "Punctuation";
}

export interface StrNode extends TxtTextNode {
    readonly type: "Str";
}

export interface SentenceNode extends TxtParentNode {
    readonly type: "Sentence";
}
```

Fore more details, Please see [TxtAST](https://github.com/textlint/textlint/blob/master/docs/txtnode.md "TxtAST").

### Node layout

Node layout image.

```
<WhiteSpace />
<Sentence>
    <Str />
    <Punctuation />
    <Str />
    <Punctuation />
</Sentence>
<WhiteSpace />
```

Note: This library will not split `Str` into `Str` and `WhiteSpace`(tokenize)
Because, Tokenize need to implement language specific context.  

## Reference

This library use ["Golden Rule" test](test/pragmatic_segmenter/test.ts) of `pragmatic_segmenter`.

- [diasks2/pragmatic_segmenter: Pragmatic Segmenter is a rule-based sentence boundary detection gem that works out-of-the-box across many languages.](https://github.com/diasks2/pragmatic_segmenter "diasks2/pragmatic_segmenter: Pragmatic Segmenter is a rule-based sentence boundary detection gem that works out-of-the-box across many languages.")

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
