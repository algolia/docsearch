# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="11.3.1"></a>
## [11.3.1](https://github.com/textlint/textlint/compare/textlint@11.2.5...textlint@11.3.1) (2019-07-20)


### Bug Fixes

* **textlint:** fix --rulesdir description ([#607](https://github.com/textlint/textlint/issues/607)) ([742fe59](https://github.com/textlint/textlint/commit/742fe59))
* **textlint:** fix crypto's DeprecationWarning ([84cfa43](https://github.com/textlint/textlint/commit/84cfa43))


### Chores

* **deps:** update dependencies ([09bca08](https://github.com/textlint/textlint/commit/09bca08))
* add publishConfig ([682c114](https://github.com/textlint/textlint/commit/682c114))


### Code Refactoring

* **test:** fix fixture package ([9dfa0ae](https://github.com/textlint/textlint/commit/9dfa0ae))
* **textlint:** remove object-assign ([9c6275e](https://github.com/textlint/textlint/commit/9c6275e))
* **utils:** move implementation from types to utils ([#611](https://github.com/textlint/textlint/issues/611)) ([cd9adbe](https://github.com/textlint/textlint/commit/cd9adbe))
* use [@textlint](https://github.com/textlint)/module-interop instead of interop-require ([10d34a6](https://github.com/textlint/textlint/commit/10d34a6))


### Features

* **types:** add generics parameter to TextlintRuleReporter<T> ([#615](https://github.com/textlint/textlint/issues/615)) ([963324b](https://github.com/textlint/textlint/commit/963324b))





<a name="11.3.0"></a>
# [11.3.0](https://github.com/textlint/textlint/compare/textlint@11.2.5...textlint@11.3.0) (2019-07-13)


### Bug Fixes

* **textlint:** fix --rulesdir description ([#607](https://github.com/textlint/textlint/issues/607)) ([742fe59](https://github.com/textlint/textlint/commit/742fe59))


### Chores

* **deps:** update dependencies ([09bca08](https://github.com/textlint/textlint/commit/09bca08))


### Code Refactoring

* **test:** fix fixture package ([9dfa0ae](https://github.com/textlint/textlint/commit/9dfa0ae))
* **utils:** move implementation from types to utils ([#611](https://github.com/textlint/textlint/issues/611)) ([cd9adbe](https://github.com/textlint/textlint/commit/cd9adbe))


### Features

* **types:** add generics parameter to TextlintRuleReporter<T> ([#615](https://github.com/textlint/textlint/issues/615)) ([963324b](https://github.com/textlint/textlint/commit/963324b))





<a name="11.2.6"></a>
## [11.2.6](https://github.com/textlint/textlint/compare/textlint@11.2.5...textlint@11.2.6) (2019-07-04)


### Bug Fixes

* **textlint:** fix --rulesdir description ([#607](https://github.com/textlint/textlint/issues/607)) ([742fe59](https://github.com/textlint/textlint/commit/742fe59))


### Chores

* **deps:** update dependencies ([09bca08](https://github.com/textlint/textlint/commit/09bca08))


### Code Refactoring

* **test:** fix fixture package ([9dfa0ae](https://github.com/textlint/textlint/commit/9dfa0ae))





<a name="11.2.5"></a>
## [11.2.5](https://github.com/textlint/textlint/compare/textlint@11.2.4...textlint@11.2.5) (2019-04-30)


### Bug Fixes

* **textlint:** add `[@textlint](https://github.com/textlint)/types` as dependencies ([7bad9a2](https://github.com/textlint/textlint/commit/7bad9a2))
* **textlint:** require node >= 8.0.0 ([51275e0](https://github.com/textlint/textlint/commit/51275e0))


### Chores

* **deps:** update deps && devDeps ([a19463b](https://github.com/textlint/textlint/commit/a19463b))


### Styles

* apply prettier ([925a5a5](https://github.com/textlint/textlint/commit/925a5a5))


### BREAKING CHANGES

* **textlint:** textlint require Node.js 8.0.0 and more





<a name="11.2.4"></a>
## [11.2.4](https://github.com/textlint/textlint/compare/textlint@11.2.3...textlint@11.2.4) (2019-04-30)


### Bug Fixes

* **textlint:** Config#hash return random value if can not get package.json ([f08d2db](https://github.com/textlint/textlint/commit/f08d2db))
* **textlint:** should not refer `Config#hash` when no use --cache ([43d0842](https://github.com/textlint/textlint/commit/43d0842))


### Code Refactoring

* **textlint:** move normalization logic to [@textlint](https://github.com/textlint)/types ([9930809](https://github.com/textlint/textlint/commit/9930809))





<a name="11.2.3"></a>
## [11.2.3](https://github.com/textlint/textlint/compare/textlint@11.2.2...textlint@11.2.3) (2019-02-10)


### Bug Fixes

* **textlint:** fix regression for ignoreReport ([8d1c195](https://github.com/textlint/textlint/commit/8d1c195)), closes [#586](https://github.com/textlint/textlint/issues/586) [#586](https://github.com/textlint/textlint/issues/586)





<a name="11.2.2"></a>
## [11.2.2](https://github.com/textlint/textlint/compare/textlint@11.2.1...textlint@11.2.2) (2019-02-10)


### Bug Fixes

* **textlint:** add normalization for rule config key ([a644d3d](https://github.com/textlint/textlint/commit/a644d3d)), closes [#583](https://github.com/textlint/textlint/issues/583)
* **textlint:** add reasonable debug log ([3931810](https://github.com/textlint/textlint/commit/3931810))


### Chores

* **textlint:** disable eslint at line ([6696c7f](https://github.com/textlint/textlint/commit/6696c7f))
* **textlint:** expand path ([9cb0e6d](https://github.com/textlint/textlint/commit/9cb0e6d))
* **textlint:** fix comment ([74a07d9](https://github.com/textlint/textlint/commit/74a07d9))
* **textlint:** fix name ([75c34fe](https://github.com/textlint/textlint/commit/75c34fe))
* **textlint:** remove unused object ([8423993](https://github.com/textlint/textlint/commit/8423993))
* **textlint:** remove unused object ([110179f](https://github.com/textlint/textlint/commit/110179f))
* **textlint:** use this.config instead of raw option ([596e941](https://github.com/textlint/textlint/commit/596e941))


### Code Refactoring

* **textlint:** move Prefix constant to pacakge-prefix.ts ([533d822](https://github.com/textlint/textlint/commit/533d822))
* **textlint:** polish config ([25dc89d](https://github.com/textlint/textlint/commit/25dc89d))
* **textlint:** polish config utility ([dc204a4](https://github.com/textlint/textlint/commit/dc204a4))


### Documentation

* **textlint:** add document to config ([403543a](https://github.com/textlint/textlint/commit/403543a))
* **textlint:** Add README for textlint ([d39e66c](https://github.com/textlint/textlint/commit/d39e66c))





<a name="11.2.1"></a>
## [11.2.1](https://github.com/textlint/textlint/compare/textlint@11.2.0...textlint@11.2.1) (2019-01-03)

**Note:** Version bump only for package textlint





<a name="11.2.0"></a>
# [11.2.0](https://github.com/textlint/textlint/compare/textlint@11.1.0...textlint@11.2.0) (2019-01-03)


### Bug Fixes

* **textlint:** fix package's keyword ([2a600b8](https://github.com/textlint/textlint/commit/2a600b8))


### Features

* **ast-node-types:** add `*Exit` type as constant value ([7106f5d](https://github.com/textlint/textlint/commit/7106f5d))





<a name="11.1.0"></a>
# [11.1.0](https://github.com/textlint/textlint/compare/textlint@11.0.2...textlint@11.1.0) (2019-01-01)


### Bug Fixes

* **kernel:** fix type error ([214c287](https://github.com/textlint/textlint/commit/214c287))
* **textlint:** fix typing of converting function ([ab3b4ef](https://github.com/textlint/textlint/commit/ab3b4ef))


### Chores

* **deps:** update eslint deps ([5bf2d38](https://github.com/textlint/textlint/commit/5bf2d38))
* **deps:** update TypeScript deps ([3ea7fb0](https://github.com/textlint/textlint/commit/3ea7fb0))
* **textlint:** remove unused types ([5f86a62](https://github.com/textlint/textlint/commit/5f86a62))
* **textlint:** restore get severity() ([6057210](https://github.com/textlint/textlint/commit/6057210))


### Code Refactoring

* **kernel:** simply typing ([f53ed51](https://github.com/textlint/textlint/commit/f53ed51))


### Styles

* **eslint:** apply eslint to all files ([6a9573f](https://github.com/textlint/textlint/commit/6a9573f))
* **prettier:** format style by prettier ([19a2901](https://github.com/textlint/textlint/commit/19a2901))




<a name="11.0.2"></a>
## [11.0.2](https://github.com/textlint/textlint/compare/textlint@11.0.0...textlint@11.0.2) (2018-12-24)


### Code Refactoring

* **textlint:** convert cli tests to TypeScript ([58f2f5e](https://github.com/textlint/textlint/commit/58f2f5e))
* **textlint:** make arguments optional correctly ([3077921](https://github.com/textlint/textlint/commit/3077921))




<a name="11.0.1"></a>
## [11.0.1](https://github.com/textlint/textlint/compare/textlint@11.0.0...textlint@11.0.1) (2018-10-12)


### Code Refactoring

* **textlint:** convert cli tests to TypeScript ([58f2f5e](https://github.com/textlint/textlint/commit/58f2f5e))
* **textlint:** make arguments optional correctly ([3077921](https://github.com/textlint/textlint/commit/3077921))




<a name="11.0.0"></a>
# [11.0.0](https://github.com/textlint/textlint/compare/textlint@10.2.1...textlint@11.0.0) (2018-07-22)


### Bug Fixes

* **textlint:** add engine.availableExtensions for backward-compatible ([e8652bc](https://github.com/textlint/textlint/commit/e8652bc))
* **textlint:** fix config type ([0f2fd6f](https://github.com/textlint/textlint/commit/0f2fd6f))


### Chores

* **deps:** update mocha ([5df8af4](https://github.com/textlint/textlint/commit/5df8af4))
* **textlint:** add type of public TextlintrcDescriptor ([7268b9e](https://github.com/textlint/textlint/commit/7268b9e))
* **textlint:** make static availableExtensions() optional ([d471637](https://github.com/textlint/textlint/commit/d471637))
* remove [@textlint](https://github.com/textlint)/textlintrc-descriptor ([3613e1f](https://github.com/textlint/textlint/commit/3613e1f))
* **textlint:** use shallowMerge ([95d056d](https://github.com/textlint/textlint/commit/95d056d))


### Code Refactoring

* **kernel:** merge textlintrc-descriptor to kernel ([3c01067](https://github.com/textlint/textlint/commit/3c01067))
* **kernel:** separate linter and fixer descriptor ([b5bc8bd](https://github.com/textlint/textlint/commit/b5bc8bd))
* **textlint:** fix to import util ([6629bd5](https://github.com/textlint/textlint/commit/6629bd5))
* **textlint:** remove `extensions` from Config ([7bc9ab8](https://github.com/textlint/textlint/commit/7bc9ab8))
* **textlintrc-descriptor:** Introduce textlintrc-descriptor ([6177794](https://github.com/textlint/textlint/commit/6177794))


### Features

* **textlint:** show message if `textlint --init` is success ([#529](https://github.com/textlint/textlint/issues/529)) ([102d568](https://github.com/textlint/textlint/commit/102d568))
* **textlint:** support availableExtensions() instance method in plugin ([a7cd053](https://github.com/textlint/textlint/commit/a7cd053))


### Tests

* **kernel:** add plugin's option tests ([f362257](https://github.com/textlint/textlint/commit/f362257))
* **textlint:** add cli output test ([#533](https://github.com/textlint/textlint/issues/533)) ([abd314a](https://github.com/textlint/textlint/commit/abd314a)), closes [#532](https://github.com/textlint/textlint/issues/532)
* **textlint:** add tests for object-to-kernel-format ([5fbb22d](https://github.com/textlint/textlint/commit/5fbb22d))
* **textlint:** fix plugin tests ([bbfc8f6](https://github.com/textlint/textlint/commit/bbfc8f6))


### BREAKING CHANGES

* **textlint:** potentially it is a breaking change for tool user




<a name="10.2.1"></a>
## [10.2.1](https://github.com/textlint/textlint/compare/textlint@10.2.0...textlint@10.2.1) (2018-04-02)




**Note:** Version bump only for package textlint

<a name="10.2.0"></a>
# [10.2.0](https://github.com/textlint/textlint/compare/textlint@10.1.5...textlint@10.2.0) (2018-04-02)


### Bug Fixes

* **textlint:** check textlintrc option exists for internal use ([744da23](https://github.com/textlint/textlint/commit/744da23))


### Features

* **textlint:** support --no-textlintrc ([466e257](https://github.com/textlint/textlint/commit/466e257))


### Tests

* **textlint:** add tests for --no-textlintrc ([289deb3](https://github.com/textlint/textlint/commit/289deb3))
* **textlint:** pass textlintrc options for failure tests ([bc0804d](https://github.com/textlint/textlint/commit/bc0804d))
* **textlint:** simplify textlint --help test ([0d2114d](https://github.com/textlint/textlint/commit/0d2114d))




<a name="10.1.5"></a>
## [10.1.5](https://github.com/textlint/textlint/compare/textlint@10.1.4...textlint@10.1.5) (2018-03-25)


### Bug Fixes

* **textlint:** remove utf-8-validate ([7668c1b](https://github.com/textlint/textlint/commit/7668c1b))


### Chores

* **test:** use `ts-node-test-register` for TypeScript testing ([be746d8](https://github.com/textlint/textlint/commit/be746d8)), closes [#451](https://github.com/textlint/textlint/issues/451)




<a name="10.1.4"></a>
## [10.1.4](https://github.com/textlint/textlint/compare/textlint@10.1.3...textlint@10.1.4) (2018-01-27)


### Code Refactoring

* **ast-traverse:** update usage of [@textlint](https://github.com/textlint)/ast-traverse ([133ab5a](https://github.com/textlint/textlint/commit/133ab5a))
* **plugin-markdown:** update usage of [@textlint](https://github.com/textlint)/textlint-plugin-markdown ([d34ee08](https://github.com/textlint/textlint/commit/d34ee08))
* **plugin-text:** update usage of [@textlint](https://github.com/textlint)/textlint-plugin-text ([b040b33](https://github.com/textlint/textlint/commit/b040b33))


### Tests

* **textlint:** add non-scoped case to module-resolver ([5eeaa02](https://github.com/textlint/textlint/commit/5eeaa02))




<a name="10.1.3"></a>
## [10.1.3](https://github.com/textlint/textlint/compare/textlint@10.1.2...textlint@10.1.3) (2018-01-18)




**Note:** Version bump only for package textlint

<a name="10.1.2"></a>
## [10.1.2](https://github.com/textlint/textlint/compare/textlint@10.1.1...textlint@10.1.2) (2018-01-12)




**Note:** Version bump only for package textlint

<a name="10.1.0"></a>
# [10.1.0](https://github.com/textlint/textlint/compare/textlint@10.0.1...textlint@10.1.0) (2017-12-25)


### Bug Fixes

* **textlint:** Return an exit status when no rules found ([#408](https://github.com/textlint/textlint/issues/408)) ([3dc76e4](https://github.com/textlint/textlint/commit/3dc76e4)), closes [#406](https://github.com/textlint/textlint/issues/406)


### Features

* **textlint:** show available formatter in help ([af6b0da](https://github.com/textlint/textlint/commit/af6b0da)), closes [#85](https://github.com/textlint/textlint/issues/85)




<a name="10.0.1"></a>
## [10.0.1](https://github.com/textlint/textlint/compare/textlint@10.0.0...textlint@10.0.1) (2017-12-19)


### Bug Fixes

* **textlint:** throw an error if file is not encoded in UTF8 ([dfe7e28](https://github.com/textlint/textlint/commit/dfe7e28))




<a name="10.0.0"></a>
# [10.0.0](https://github.com/textlint/textlint/compare/textlint@10.0.0-next.2...textlint@10.0.0) (2017-12-18)




**Note:** Version bump only for package textlint

<a name="10.0.0-next.2"></a>
# [10.0.0-next.2](https://github.com/textlint/textlint/compare/textlint@10.0.0-next.1...textlint@10.0.0-next.2) (2017-12-18)




**Note:** Version bump only for package textlint

<a name="10.0.0-next.1"></a>
# [10.0.0-next.1](https://github.com/textlint/textlint/compare/textlint@10.0.0-next.0...textlint@10.0.0-next.1) (2017-12-17)


### Bug Fixes

* **textlint:** Replace pkg-conf with read-pkg-up to get package version ([e3e6197](https://github.com/textlint/textlint/commit/e3e6197))
* **textlint:** use read-pkg-up to get package version ([c1aeaa2](https://github.com/textlint/textlint/commit/c1aeaa2)), closes [#388](https://github.com/textlint/textlint/issues/388)




<a name="10.0.0-next.0"></a>
# [10.0.0-next.0](https://github.com/textlint/textlint/compare/textlint@9.1.1...textlint@10.0.0-next.0) (2017-12-15)


### Bug Fixes

* **textlint:** fix bin/cli.js ([3e0f103](https://github.com/textlint/textlint/commit/3e0f103))
* **textlint:** fix build temp ([a0bc1af](https://github.com/textlint/textlint/commit/a0bc1af))
* **textlint:** fix tsconfig resolution ([c2f588a](https://github.com/textlint/textlint/commit/c2f588a))
* **textlint:** move textlint-fixer-formatter from devDeps to deps ([#367](https://github.com/textlint/textlint/issues/367)) ([da23f71](https://github.com/textlint/textlint/commit/da23f71))
* **textlint:** overwrite tsconfig.json ([de60be3](https://github.com/textlint/textlint/commit/de60be3))
* **textlint:** support nest read pkg ([bf14941](https://github.com/textlint/textlint/commit/bf14941))
* **textlint:** Update README ([88cdb2e](https://github.com/textlint/textlint/commit/88cdb2e))


### BREAKING CHANGES

* **textlint:** It need to upgrade to 10.0.0




<a name="9.1.1"></a>
## [9.1.1](https://github.com/textlint/textlint/compare/textlint@9.1.0...textlint@9.1.1) (2017-11-05)


### Bug Fixes

* **textlint:** support scoped preset module  ([#329](https://github.com/textlint/textlint/issues/329)) ([a2c8f6b](https://github.com/textlint/textlint/commit/a2c8f6b))




<a name="9.1.0"></a>
# [9.1.0](https://github.com/textlint/textlint/compare/textlint@9.0.1...textlint@9.1.0) (2017-11-03)


### Features

* **textlint:** support shortcut scoped package name ([#326](https://github.com/textlint/textlint/issues/326)) ([0dff2cc](https://github.com/textlint/textlint/commit/0dff2cc))




<a name="9.0.0"></a>
# [9.0.0](https://github.com/textlint/textlint/compare/textlint@9.0.0-beta.0...textlint@9.0.0) (2017-10-28)




**Note:** Version bump only for package textlint

<a name="8.2.1"></a>
## [8.2.1](https://github.com/textlint/textlint/compare/textlint@8.2.0...textlint@8.2.1) (2017-05-21)


### Bug Fixes

* **textlint:** fix `config.configFile` is undefined at sometimes (#297) ([cd64560](https://github.com/textlint/textlint/commit/cd64560)), closes [#297](https://github.com/textlint/textlint/issues/297)




<a name="8.2.0"></a>
# [8.2.0](https://github.com/textlint/textlint/compare/textlint@8.1.0...textlint@8.2.0) (2017-05-21)


### Features

* **textlint-kernel:** add `configBaseDir` option (#295) ([85dad8a](https://github.com/textlint/textlint/commit/85dad8a))




<a name="8.1.0"></a>
# [8.1.0](https://github.com/textlint/textlint/compare/textlint@8.0.1...textlint@8.1.0) (2017-05-18)


### Features

* **textlint-kernel:** Add [@textlint](https://github.com/textlint)/kernel (#292) ([30473c3](https://github.com/textlint/textlint/commit/30473c3))




<a name="8.0.1"></a>
## [8.0.1](https://github.com/textlint/textlint/compare/textlint@8.0.0...textlint@8.0.1) (2017-05-11)


### Bug Fixes

* **textlint:** remove shelljs dependencies (#287) ([0e88942](https://github.com/textlint/textlint/commit/0e88942))




<a name="8.0.0"></a>
# 8.0.0 (2017-05-07)


### Bug Fixes

* **babel:** ignore lib directory ([12e581d](https://github.com/textlint/textlint/commit/12e581d))
* **fixer:** fix thrown error when empty result. (#274) ([7013cee](https://github.com/textlint/textlint/commit/7013cee)), closes [#274](https://github.com/textlint/textlint/issues/274)
* **textilnt:** fix JSDoc ([8a417e0](https://github.com/textlint/textlint/commit/8a417e0))


### Features

* **packages:** import textlint-plugin-text ([1b7a571](https://github.com/textlint/textlint/commit/1b7a571))
* **textlint:** update built-in textlint-plugin-markdown@^2 (#282) ([448fef9](https://github.com/textlint/textlint/commit/448fef9))


### BREAKING CHANGES

* **textlint:** markdown-to-ast@4 includes some breaking change
It enhance some linting result. It found potential issue.



<a name="7.4.0"></a>
# 7.4.0 (2017-04-11)


### Features

* **cli:** Support quiet mode (#268) ([7b1af88](https://github.com/textlint/textlint/commit/7b1af88))



<a name="7.3.0"></a>
# 7.3.0 (2017-03-04)


### Features

* **cli:** Support glob pattern (#264) ([d1cd6f3](https://github.com/textlint/textlint/commit/d1cd6f3))



<a name="7.2.2"></a>
## 7.2.2 (2017-02-12)


### Bug Fixes

* **config:** use rc-config-loader insteadof rc-loader (#262) ([df2154d](https://github.com/textlint/textlint/commit/df2154d)), closes [#39](https://github.com/textlint/textlint/issues/39)




<a name="7.4.0"></a>
# 7.4.0 (2017-04-11)


### Features

* **cli:** Support quiet mode (#268) ([7b1af88](https://github.com/textlint/textlint/commit/7b1af88))



<a name="7.3.0"></a>
# 7.3.0 (2017-03-04)


### Features

* **cli:** Support glob pattern (#264) ([d1cd6f3](https://github.com/textlint/textlint/commit/d1cd6f3))



<a name="7.2.2"></a>
## 7.2.2 (2017-02-12)


### Bug Fixes

* **config:** use rc-config-loader insteadof rc-loader (#262) ([df2154d](https://github.com/textlint/textlint/commit/df2154d)), closes [#39](https://github.com/textlint/textlint/issues/39)
