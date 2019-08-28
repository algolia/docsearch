import fs from 'fs-extra';
import _ from 'lodash';
import pify from 'pify';
import _glob from 'glob';
import path from 'path';
import chalk from 'chalk';
import chokidar from 'chokidar';
const glob = pify(_glob);
const readFile = pify(fs.readFile);
const writeFile = pify(fs.writeFile);
const mkdirp = pify(fs.mkdirp);

export default {
  async mkdirp(filepath) {
    return await mkdirp(filepath);
  },
  // Read a file and return its content as a string
  async readFile(filepath) {
    return (await readFile(filepath)).toString('utf-8');
  },
  // Read a Json file
  async readJson(filepath) {
    return JSON.parse(await this.readFile(filepath));
  },
  // Return the site global config
  async siteConfig() {
    return await this.readJson('./config.json');
  },
  // Write a file to disk
  async writeFile(filepath, content) {
    const dirname = path.dirname(filepath);
    await this.mkdirp(dirname);
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
