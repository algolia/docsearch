# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="3.1.8"></a>
## [3.1.8](https://github.com/textlint/textlint/compare/@textlint/kernel@3.1.6...@textlint/kernel@3.1.8) (2019-07-20)


### Code Refactoring

* **kernel:** remove object-assign ([24eed59](https://github.com/textlint/textlint/commit/24eed59))
* **utils:** move implementation from types to utils ([#611](https://github.com/textlint/textlint/issues/611)) ([cd9adbe](https://github.com/textlint/textlint/commit/cd9adbe))





<a name="3.1.7"></a>
## [3.1.7](https://github.com/textlint/textlint/compare/@textlint/kernel@3.1.6...@textlint/kernel@3.1.7) (2019-07-13)


### Code Refactoring

* **utils:** move implementation from types to utils ([#611](https://github.com/textlint/textlint/issues/611)) ([cd9adbe](https://github.com/textlint/textlint/commit/cd9adbe))





<a name="3.1.6"></a>
## [3.1.6](https://github.com/textlint/textlint/compare/@textlint/kernel@3.1.5...@textlint/kernel@3.1.6) (2019-04-30)


### Chores

* **deps:** update deps && devDeps ([a19463b](https://github.com/textlint/textlint/commit/a19463b))





<a name="3.1.5"></a>
## [3.1.5](https://github.com/textlint/textlint/compare/@textlint/kernel@3.1.4...@textlint/kernel@3.1.5) (2019-04-30)


### Bug Fixes

* **test:** fix integration tests ([24422ad](https://github.com/textlint/textlint/commit/24422ad))


### Code Refactoring

* **textlint:** move normalization logic to [@textlint](https://github.com/textlint)/types ([9930809](https://github.com/textlint/textlint/commit/9930809))





<a name="3.1.4"></a>
## [3.1.4](https://github.com/textlint/textlint/compare/@textlint/kernel@3.1.3...@textlint/kernel@3.1.4) (2019-02-10)


### Bug Fixes

* **textlint:** fix regression for ignoreReport ([8d1c195](https://github.com/textlint/textlint/commit/8d1c195)), closes [#586](https://github.com/textlint/textlint/issues/586) [#586](https://github.com/textlint/textlint/issues/586)





<a name="3.1.3"></a>
## [3.1.3](https://github.com/textlint/textlint/compare/@textlint/kernel@3.1.2...@textlint/kernel@3.1.3) (2019-02-10)


### Bug Fixes

* **textlint:** add reasonable debug log ([3931810](https://github.com/textlint/textlint/commit/3931810))





<a name="3.1.2"></a>
## [3.1.2](https://github.com/textlint/textlint/compare/@textlint/kernel@3.1.1...@textlint/kernel@3.1.2) (2019-01-03)


### Bug Fixes

* **textlint:** fix internal typing ([e2fde6c](https://github.com/textlint/textlint/commit/e2fde6c))





<a name="3.1.1"></a>
## [3.1.1](https://github.com/textlint/textlint/compare/@textlint/kernel@3.1.0...@textlint/kernel@3.1.1) (2019-01-03)

**Note:** Version bump only for package @textlint/kernel





<a name="3.1.0"></a>
# [3.1.0](https://github.com/textlint/textlint/compare/@textlint/kernel@3.0.1...@textlint/kernel@3.1.0) (2019-01-01)


### Bug Fixes

* **kernel:** fix type error ([214c287](https://github.com/textlint/textlint/commit/214c287))
* **kernel:** refer to TextlintRuleContextReportFunctionArgs ([27e6968](https://github.com/textlint/textlint/commit/27e6968))
* **types:** fix name of type definition ([67d9c49](https://github.com/textlint/textlint/commit/67d9c49))


### Chores

* **deps:** update eslint deps ([5bf2d38](https://github.com/textlint/textlint/commit/5bf2d38))
* **deps:** update TypeScript deps ([3ea7fb0](https://github.com/textlint/textlint/commit/3ea7fb0))


### Code Refactoring

* **kernel:** move report()/shouldIgnore() definition to types ([601ce3a](https://github.com/textlint/textlint/commit/601ce3a))
* **kernel:** remove SeverityLevel.ts from kernel ([88a306c](https://github.com/textlint/textlint/commit/88a306c))
* **types:** move type definition for rule to [@textlint](https://github.com/textlint)/types ([9be6e16](https://github.com/textlint/textlint/commit/9be6e16))


### Documentation

* **types:** Update README ([ab1e2ba](https://github.com/textlint/textlint/commit/ab1e2ba))


### Features

* **types:** Move TextlintResult/TextlintMessage type to [@textlint](https://github.com/textlint)/types ([b2a03a1](https://github.com/textlint/textlint/commit/b2a03a1))


### Styles

* **prettier:** format style by prettier ([19a2901](https://github.com/textlint/textlint/commit/19a2901))


### Tests

* **deps:** update no-todo rule reference ([6cecc88](https://github.com/textlint/textlint/commit/6cecc88))
* **types:** Move SourceCode test to types ([ec61d65](https://github.com/textlint/textlint/commit/ec61d65))




<a name="3.0.1"></a>
## [3.0.1](https://github.com/textlint/textlint/compare/@textlint/kernel@3.0.0...@textlint/kernel@3.0.1) (2018-12-24)


### Bug Fixes

* **kernel:** fix applyFix order on Node.js 11 ([714a90c](https://github.com/textlint/textlint/commit/714a90c))




<a name="3.0.0"></a>
# [3.0.0](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.9...@textlint/kernel@3.0.0) (2018-07-22)


### Bug Fixes

* **kernel:** kernel use TextlintrcDescriptor ([efd89c2](https://github.com/textlint/textlint/commit/efd89c2))
* **kernel:** make rule and plugin's option value {} by default ([b7aa63d](https://github.com/textlint/textlint/commit/b7aa63d))


### Chores

* **deps:** update mocha ([5df8af4](https://github.com/textlint/textlint/commit/5df8af4))
* remove [@textlint](https://github.com/textlint)/textlintrc-descriptor ([3613e1f](https://github.com/textlint/textlint/commit/3613e1f))
* **kernel:** add comment ([582d0d6](https://github.com/textlint/textlint/commit/582d0d6))
* **kernel:** add Processor validation ([86ed609](https://github.com/textlint/textlint/commit/86ed609))
* **kernel:** fix test title ([4eeeff8](https://github.com/textlint/textlint/commit/4eeeff8))
* **kernel:** support instance availableExtensions() method ([b821fc5](https://github.com/textlint/textlint/commit/b821fc5))
* **textlint:** make static availableExtensions() optional ([d471637](https://github.com/textlint/textlint/commit/d471637))
* **textlint:** use shallowMerge ([95d056d](https://github.com/textlint/textlint/commit/95d056d))


### Code Refactoring

* **kernel:** merge textlintrc-descriptor to kernel ([3c01067](https://github.com/textlint/textlint/commit/3c01067))
* **kernel:** remove TextlintRuleDescriptorType ([a5b0f30](https://github.com/textlint/textlint/commit/a5b0f30))
* **kernel:** Replace Object.freeze directly with factory function ([c43580b](https://github.com/textlint/textlint/commit/c43580b))
* **kernel:** separate linter and fixer descriptor ([b5bc8bd](https://github.com/textlint/textlint/commit/b5bc8bd))
* **kernel:** use textlintrc-descriptor instead of rule-creator-helper ([f0eb4bf](https://github.com/textlint/textlint/commit/f0eb4bf))
* **textlintrc-descriptor:** Introduce textlintrc-descriptor ([6177794](https://github.com/textlint/textlint/commit/6177794))
* **typescript:** update to TypeScript 2.8 ([f7b2b08](https://github.com/textlint/textlint/commit/f7b2b08))


### Features

* **kernel:** Freeze Context ([7fc9ec8](https://github.com/textlint/textlint/commit/7fc9ec8)), closes [#508](https://github.com/textlint/textlint/issues/508) [#508](https://github.com/textlint/textlint/issues/508)
* **textlint:** support availableExtensions() instance method in plugin ([a7cd053](https://github.com/textlint/textlint/commit/a7cd053))


### Tests

* **kernel:** Add missing Readonly<T> ([c5313c8](https://github.com/textlint/textlint/commit/c5313c8))
* **kernel:** add plugin's option tests ([f362257](https://github.com/textlint/textlint/commit/f362257))
* **textlint:** add tests for object-to-kernel-format ([5fbb22d](https://github.com/textlint/textlint/commit/5fbb22d))


### BREAKING CHANGES

* **kernel:** Previously, textlint pass `true` to rule and plugin as default value of option.
This commit change the default value to `{}` (empty object).

fix https://github.com/textlint/textlint/issues/535




<a name="2.0.9"></a>
## [2.0.9](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.8...@textlint/kernel@2.0.9) (2018-04-02)




**Note:** Version bump only for package @textlint/kernel

<a name="2.0.8"></a>
## [2.0.8](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.7...@textlint/kernel@2.0.8) (2018-04-02)




**Note:** Version bump only for package @textlint/kernel

<a name="2.0.7"></a>
## [2.0.7](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.6...@textlint/kernel@2.0.7) (2018-03-25)


### Chores

* **test:** use `ts-node-test-register` for TypeScript testing ([be746d8](https://github.com/textlint/textlint/commit/be746d8)), closes [#451](https://github.com/textlint/textlint/issues/451)




<a name="2.0.6"></a>
## [2.0.6](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.5...@textlint/kernel@2.0.6) (2018-01-27)


### Code Refactoring

* **ast-traverse:** update usage of [@textlint](https://github.com/textlint)/ast-traverse ([133ab5a](https://github.com/textlint/textlint/commit/133ab5a))
* **plugin-markdown:** update usage of [@textlint](https://github.com/textlint)/textlint-plugin-markdown ([d34ee08](https://github.com/textlint/textlint/commit/d34ee08))




<a name="2.0.5"></a>
## [2.0.5](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.4...@textlint/kernel@2.0.5) (2018-01-18)




**Note:** Version bump only for package @textlint/kernel

<a name="2.0.4"></a>
## [2.0.4](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.3...@textlint/kernel@2.0.4) (2018-01-12)


### Bug Fixes

* **kernel:** fix return type of `SourceCode#getSource` ([1b55894](https://github.com/textlint/textlint/commit/1b55894))
* **kernel:** pass the file path to preProcess() that is on FixerProcessor ([#458](https://github.com/textlint/textlint/issues/458)) ([5b947aa](https://github.com/textlint/textlint/commit/5b947aa))




<a name="2.0.2"></a>
## [2.0.2](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.1...@textlint/kernel@2.0.2) (2017-12-25)


### Bug Fixes

* **kernel:** fix import path ([02d98fe](https://github.com/textlint/textlint/commit/02d98fe))
* **monorepo:** fix TypeScript module resolution in monorepo ([d5df499](https://github.com/textlint/textlint/commit/d5df499))




<a name="2.0.1"></a>
## [2.0.1](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.0...@textlint/kernel@2.0.1) (2017-12-19)




**Note:** Version bump only for package @textlint/kernel

<a name="2.0.0"></a>
# [2.0.0](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.0-next.2...@textlint/kernel@2.0.0) (2017-12-18)




**Note:** Version bump only for package @textlint/kernel

<a name="2.0.0-next.2"></a>
# [2.0.0-next.2](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.0-next.1...@textlint/kernel@2.0.0-next.2) (2017-12-18)




**Note:** Version bump only for package @textlint/kernel

<a name="2.0.0-next.1"></a>
# [2.0.0-next.1](https://github.com/textlint/textlint/compare/@textlint/kernel@2.0.0-next.0...@textlint/kernel@2.0.0-next.1) (2017-12-17)




**Note:** Version bump only for package @textlint/kernel

<a name="2.0.0-next.0"></a>
# [2.0.0-next.0](https://github.com/textlint/textlint/compare/@textlint/kernel@1.0.3...@textlint/kernel@2.0.0-next.0) (2017-12-15)


### Bug Fixes

* **textlint:** fix kernel test ([#374](https://github.com/textlint/textlint/issues/374)) ([d6953cc](https://github.com/textlint/textlint/commit/d6953cc))
* **textlint-fixer-formatter:** use paths ([734806f](https://github.com/textlint/textlint/commit/734806f))




<a name="1.0.3"></a>
## [1.0.3](https://github.com/textlint/textlint/compare/@textlint/kernel@1.0.2...@textlint/kernel@1.0.3) (2017-11-05)


### Bug Fixes

* **textlint:** support scoped preset module  ([#329](https://github.com/textlint/textlint/issues/329)) ([a2c8f6b](https://github.com/textlint/textlint/commit/a2c8f6b))




<a name="1.0.2"></a>
## [1.0.2](https://github.com/textlint/textlint/compare/@textlint/kernel@1.0.1...@textlint/kernel@1.0.2) (2017-11-03)




**Note:** Version bump only for package @textlint/kernel

<a name="1.0.0"></a>
# [1.0.0](https://github.com/textlint/textlint/compare/@textlint/kernel@1.0.0-beta.0...@textlint/kernel@1.0.0) (2017-10-28)




**Note:** Version bump only for package @textlint/kernel

<a name="0.2.1"></a>
## [0.2.1](https://github.com/textlint/textlint/compare/@textlint/kernel@0.2.0...@textlint/kernel@0.2.1) (2017-05-21)




<a name="0.2.0"></a>
# [0.2.0](https://github.com/textlint/textlint/compare/@textlint/kernel@0.1.0...@textlint/kernel@0.2.0) (2017-05-21)


### Features

* **textlint-kernel:** add `configBaseDir` option (#295) ([85dad8a](https://github.com/textlint/textlint/commit/85dad8a))




<a name="0.1.0"></a>
# 0.1.0 (2017-05-18)


### Features

* **textlint-kernel:** Add [@textlint](https://github.com/textlint)/kernel (#292) ([30473c3](https://github.com/textlint/textlint/commit/30473c3))
