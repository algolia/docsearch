import helper from './helper';
import _ from 'lodash';
import path from 'path';
import * as babel from '@babel/core';
import pMap from 'p-map';

export default {
  // Replace all "include: ./path/to/file.js" with the actual content of the
  // file
  async includeTemplates(initialContent) {
    const lines = _.split(initialContent, '\n');

    const newContent = await pMap(lines, async line => {
      // Skip lines without a template
      if (!_.startsWith(line, '// include: ')) {
        return line;
      }

      const filename = line.split(': ')[1];
      const templateContent = await helper.readFile(
        `./src/demos/_includes/${filename}`
      );

      return templateContent;
    });

    return newContent.join('\n');
  },

  // Interpolate placeholders
  async interpolatePlaceholders(initialContent) {
    let content = initialContent;
    const siteData = await helper.siteData();
    _.each(siteData.config, (value, key) => {
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
    const destination = `./docs/${relativePath}`;
    let content = await helper.readFile(filepath);
    content = await this.includeTemplates(content);
    content = await this.interpolatePlaceholders(content);
    content = await this.compileWithBabel(content, destination);

    await helper.writeFile(destination, content);
  },

  async run() {
    // Compile JavaScript files
    const jsFiles = await helper.getFiles('demos/[^_]*/search.js');
    await pMap(jsFiles, async filepath => {
      await this.compile(filepath);
    });
  },

  // Listen to changes in js files and rewrite them
  watch() {
    // Update HTML on each markdown change
    helper.watch('./src/demos/**/search.js', filepath => {
      this.compile(filepath);
    });
    // Rebuild everything when an include changes
    helper.watch(['./src/demos/_includes/*.js'], () => {
      this.run();
    });
  },
};
