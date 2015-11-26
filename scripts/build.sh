#!/usr/bin/env bash

set -e # exit when error

mkdir -p dist/
mkdir -p dist-es5-module/

rm -rf dist/*
rm -rf dist-es5-module/*

VERSION=$(json version < package.json)

bundle='documentationsearch'

license="/*! ${bundle} ${VERSION:-UNRELEASED} | © Algolia | github.com/algolia/documentationsearch.js */"

webpack --config webpack.config.jsdelivr.babel.js

# only transpile to ES5 for package.json main entry
babel -q index.js -o dist-es5-module/index.js
declare -a sources=("src")
for source in "${sources[@]}"
do
  babel -q --out-dir dist-es5-module/${source} ${source}
done

echo "$license" | cat - dist/${bundle}.js > /tmp/out && mv /tmp/out dist/${bundle}.js
cd dist
uglifyjs ${bundle}.js --source-map ${bundle}.min.map --preamble "$license" -c warnings=false -m -o ${bundle}.min.js
cd ..

gzip_size=$(gzip -9 < dist/${bundle}.min.js | wc -c | pretty-bytes)
echo "=> ${bundle}.min.js gzipped will weight $gzip_size-bytes"
