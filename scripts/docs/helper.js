import fs from 'fs';
import _ from 'lodash';
import pify from 'pify';
import _glob from 'glob';
import path from 'path';
import _mkdirp from 'mkdirp';
import chalk from 'chalk';
import chokidar from 'chokidar';
const glob = pify(_glob);
const mkdirp = pify(_mkdirp);
const readFile = pify(fs.readFile);
const writeFile = pify(fs.writeFile);

export default {
  // Read a file and return its content as a string
  async readFile(filepath) {
    return (await readFile(filepath)).toString('utf-8');
  },
  // Read a Json file
  async readJson(filepath) {
    return JSON.parse(await this.readFile(filepath));
  },
  // Return the site global data
  async siteData() {
    return await this.readJson('./src/_data.json');
  },
  // Write a file to disk
  async writeFile(filepath, content) {
    const dirname = path.dirname(filepath);
    await mkdirp(dirname);
    await writeFile(filepath, content);

    const extname = path.extname(filepath);
    let displayName = filepath;
    const colors = {
      '.html': 'magenta',
      '.css': 'yellow',
      '.js': 'green',
    };
    if (colors[extname]) {
      displayName = chalk[colors[extname]](displayName);
    }

    console.info(`✔ Saving ${displayName}`);
  },
  // Get an array of all files matching a glob pattern
  async getFiles(pattern) {
    return await glob(`./src/${pattern}`);
  },
  // Watch for file changes and react
  watch(pattern, callback) {
    const watcher = chokidar.watch(pattern);
    watcher.on('change', _.debounce(callback, 500, { leading: true }));
  },
};
