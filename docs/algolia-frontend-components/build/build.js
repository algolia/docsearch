const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const ProgressBar = require('progress');
const sass = require('node-sass');
const babel = require('babel-core');
const assets = require('./assets');

const log = console.log;

const COMPONENT_DIR = path.resolve(__dirname, './../components');
const IMG_DIR = path.resolve(__dirname, './../images');
const DIST_DIR = path.resolve(__dirname, './../dist/');
const jshtmlglob = COMPONENT_DIR + "/**/*.html.js";
const cssglob = COMPONENT_DIR + "/**/*.scss";
const jsglob = COMPONENT_DIR + "/**/*.js";
const scssResolvePath = path.resolve(__dirname, '/stylesheets');

const outputMode = [...process.argv].indexOf('--erb') > 0 ? ".erb" : ".html";

const bar = new ProgressBar(`${chalk.green('building')} [:bar]`, { total: 40 });

const timer = setInterval(function() {
  bar.tick();
  if (bar.complete) {
    clearInterval(timer);
  }
}, 100);

const buildAssets = new Promise((resolve, reject) => {

  fs.mkdir(DIST_DIR, function(e) {
    if (!e || (e && e.code === 'EEXIST')) {} else {
      console.log(e);
    }
  });

  const jsPromise = glob(jsglob, (err, files) => {
    const fl = files.length - 1;
    files.forEach((file, i) => {
      if (file.indexOf('.html.js') > 0) {
        return
      }
      const componentName = file.split('/')
        .filter((item, i, arr) => i === arr.length - 1)
        .map(name => {

          // Write filename with '_' prefix 
          // for middleman partials use case
          return '_' + name.split('.')[0];
        })[0];

      const fileName = DIST_DIR + '/' + componentName + '.js';
      let jsCode = fs.readFileSync(file, "utf8");
      const removeExports = /(^module\.exports.*)/gm
      jsCode = jsCode.replace(removeExports, "");

      const transpiled = babel.transform(jsCode, {
        env: "production",
        presets: ["es2015"]
      });

      fs.writeFileSync(fileName, transpiled.code);

    });
  });

  const htmlPromise = new Promise((resolve, reject) => {

    glob(jshtmlglob, (err, files) => {
      const fl = files.length - 1;
      log(chalk.white('Start building algolia components'));
      log(chalk.white('Output to ', chalk.bold.underline(DIST_DIR)));

      files.forEach((file, i) => {
        // Get component name from /path/to/file
        const componentName = file.split('/')
          .filter((item, i, arr) => i === arr.length - 1)
          .map(name => {

            // Write filename with '_' prefix 
            // for middleman partials use case
            return '_' + name.split('.')[0];
          })[0];

        log(chalk.white('Building partial ->'), chalk.bold(componentName));

        // Filename with path to dist dir
        const fileName = DIST_DIR + '/' + componentName + outputMode;
        // Require component
        const component = require(file);
        // Call it's render function
        const html = component({}, assets);

        // Write file
        fs.writeFileSync(fileName, html);
        if (i === fl) {
          resolve({ message: 'Finished html assets' });
        }
      });
    });
  });

  const cssPromise = new Promise((resolve, reject) => {

    glob(cssglob, (err, files) => {
      const fl = files.length - 1;
      files.forEach((file, i) => {
        const componentName = file.split('/')
          .filter((item, i, arr) => i === arr.length - 1)
          .map(name => {

            // Write filename with '_' prefix 
            // for middleman partials use case
            return '_' + name.split('.')[0];
          })[0];

        const cssContent = fs.readFileSync(file, "utf8");

        const result = sass.render({
          file: file,
          includePaths: [scssResolvePath]
        }, (err, result) => {
          if (err) { reject(err) }

          fs.writeFileSync(DIST_DIR + '/' + componentName + '.css', result.css.toString());
        });
        if (i === fl) {
          resolve({ message: 'Finished CSS assets' });
        }
      })
    });
  });

  Promise.all([htmlPromise, cssPromise]).then((data) => {
    resolve('completed');
  });
});


buildAssets.then(data => {
  bar.complete = true;
})

module.exports = buildAssets;
