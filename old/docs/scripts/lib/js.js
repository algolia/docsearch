import helper from './helper';
import _ from 'lodash';
import path from 'path';
import * as babel from 'babel-core';
import pMap from 'p-map';

export default {
  // Interpolate placeholders
  async interpolatePlaceholders(initialContent) {
    let content = initialContent;
    const siteConfig = await helper.siteConfig();
    _.each(siteConfig.placeholders, (value, key) => {
      content = _.replace(content, new RegExp(`{{${key}}}`, 'g'), value);
    });

    return content;
  },

  // Compile JavaScript through Babel
  async compileWithBabel(content, destination) {
    const babelConfigPath = path.resolve('.babelrc');
    const babelConfig = await helper.readJson(babelConfigPath);
    const babelOptions = {
      ...babelConfig,
      filename: destination,
      filenameRelative: destination,
    };
    const result = babel.transform(content, babelOptions);
    return result.code;
  },

  async compile(filepath) {
    const relativePath = path.relative('./src', filepath);
    const destination = `./dist/${relativePath}`;
    let content = await helper.readFile(filepath);
    content = await this.interpolatePlaceholders(content);
    content = await this.compileWithBabel(content, destination);

    await helper.writeFile(destination, content);
  },

  async run() {
    // Compile JavaScript files
    const jsFiles = await helper.getFiles('js/*.js');
    await pMap(jsFiles, async filepath => {
      await this.compile(filepath);
    });
  },

  // Listen to changes in js files and rewrite them
  watch() {
    helper.watch('./src/js/*.js', filepath => {
      this.compile(filepath);
    });
  },
};
