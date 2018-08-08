import helper from './helper';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';
import postcssNested from 'postcss-nested';
import postcssImport from 'postcss-import';
import postcssPurge from '@fullhuman/postcss-purgecss';
import postcssClean from 'postcss-clean';
import path from 'path';
import fs from 'fs';
import pEach from 'p-each-series';

export default {
  postcssPlugins(tailwindConfigFile) {
    const plugins = [
      postcssImport(),
      tailwind(tailwindConfigFile),
      postcssNested,
    ];

    // Add more plugins when building
    if (!this.isProduction()) {
      return plugins;
    }

    // Only keep classes used in files at the same level
    let pathLevel = path.dirname(path.relative('./src', tailwindConfigFile));
    if (pathLevel === '..') {
      pathLevel = '';
    }
    plugins.push(
      postcssPurge({
        content: [`./docs/${pathLevel}/*.html`],
        whitelistPatterns: [/^ais-/, /^ats-/],
      })
    );

    plugins.push(autoprefixer);

    const cleanCssOptions = {
      level: {
        1: {
          specialComments: false,
        },
      },
    };

    plugins.push(postcssClean(cleanCssOptions));

    return plugins;
  },

  // Are we building (as opposed to local serve)
  isProduction() {
    return process.env.NODE_ENV === 'production';
  },

  // Compile the css source file to docs
  async compile(source) {
    const rawContent = await helper.readFile(source);
    const relativePath = path.relative('./src', source);
    const destination = `./docs/${relativePath}`;

    // Use a local tailwind file if one is found
    const dirname = path.dirname(source);
    const potentialTailwindConfig = path.join(dirname, 'tailwind.config.js');
    const tailwindConfig = fs.existsSync(potentialTailwindConfig)
      ? potentialTailwindConfig
      : './tailwind.config.js';

    const plugins = this.postcssPlugins(tailwindConfig);
    const result = await postcss(plugins).process(rawContent, {
      from: source,
      to: destination,
    });
    await helper.writeFile(destination, result.css);
  },

  // Compile all css files
  async run() {
    const cssFiles = await helper.getFiles('{style.css,demos/[^_]*/style.css}');

    await pEach(cssFiles, async filepath => {
      await this.compile(filepath);
    });
  },

  // Listen to changes in css files and rebuild them
  watch() {
    // Rebuild main file when changed
    helper.watch('./src/style.css', filepath => {
      this.compile(filepath);
    });
    // Rebuild main file when includes are changed
    helper.watch('./src/_styles/*.css', () => {
      this.compile('./src/style.css');
    });
    // Rebuild demo when tailwind config of a demo is changed
    helper.watch('./src/demos/[^_]*/tailwind.config.js', tailwindPath => {
      const cssPath = `${path.dirname(tailwindPath)}/style.css`;
      this.compile(cssPath);
    });
    // Rebuild demo when style of a demo is changed
    helper.watch('./src/demos/[^_]*/style.css', filepath => {
      this.compile(filepath);
    });
    // Rebuild all files when main tailwind config is changed
    helper.watch('./tailwind.config.js', () => {
      this.run();
    });
  },
};
