const fs = require('fs');
const path = require('path');
const glob = require('glob');
const buildAssets = require('./build.js');

const COMPONENT_DIR = path.resolve(__dirname, './../components');
const FILE_GLOB = COMPONENT_DIR + "/**/*";

glob(FILE_GLOB, (err, files) => {
  files.forEach(file => {
    fs.watch(file, (eventType, filename) => {
      buildAssets();
    });
  })
});
