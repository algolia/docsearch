import helper from './helper';
import _ from 'lodash';
import path from 'path';
import frontMatter from 'front-matter';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItClassy from 'markdown-it-classy';
import markdownItHighlight from 'markdown-it-highlightjs';
import cheerio from 'cheerio';
import pug from 'pug';
import pMap from 'p-map';
const markdown = markdownIt({
  html: true,
  linkify: true,
})
  .use(markdownItAnchor, {
    slugify: e =>
      e
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, ''),
    permalink: true,
    permalinkClass: 'anchor',
    permalinkSymbol: '',
  })
  .use(markdownItClassy)
  .use(markdownItHighlight);

export default {
  // Returns an array of all headings and their ids (to use in the sidebar)
  getHeadings(htmlBody) {
    const $ = cheerio.load(htmlBody);
    const headings = $('h2');
    return _.map(headings, heading => {
      const $el = $(heading);
      return {
        title: $el.text(),
        anchor: $el.attr('id'),
      };
    });
  },

  // Build a markdown file to an html file
  async compile(filepath) {
    const siteConfig = await helper.siteConfig();
    const currentUrl = path.relative(
      './src',
      _.replace(filepath, '.md', '.html')
    );
    const srcpath =
      siteConfig.site.repo + _.replace(filepath, './', '/tree/master/docs/');
    const destination = `./dist/${currentUrl}`;

    // Read file, and extract front-matter from raw text
    const rawContent = await helper.readFile(filepath);
    const parsed = frontMatter(rawContent);
    const fileConfig = parsed.attributes;
    const pageConfig = _.merge({}, siteConfig, fileConfig);

    // Update {{placeholders}}
    let markdownBody = parsed.body;
    _.each(pageConfig.placeholders, (value, key) => {
      markdownBody = _.replace(
        markdownBody,
        new RegExp(`{{${key}}}`, 'g'),
        value
      );
    });

    // Convert markdown to html
    const htmlBody = markdown.render(markdownBody);

    // Add the hierarchy of headings to the matching link in the sidebar
    const headings = this.getHeadings(htmlBody);
    const sidebar = _.clone(pageConfig.sidebar);
    _.each(sidebar, category => {
      _.each(category.pages, page => {
        if (page.url === currentUrl) {
          page.headings = headings; // eslint-disable-line no-param-reassign
        }
      });
    });

    // Init layout
    const layoutName = fileConfig.layout;
    const layoutFile = `./src/_layouts/${layoutName}.pug`;
    const layoutContent = await helper.readFile(layoutFile);
    const pugCompile = pug.compile(layoutContent, { filename: layoutFile });

    // Compile layout
    const compileConfig = {
      ...pageConfig,
      sidebar,
      current: {
        url: currentUrl,
        content: htmlBody,
        src: srcpath,
        ...fileConfig,
      },
    };
    const htmlContent = pugCompile(compileConfig);

    // Save to disk
    await helper.writeFile(destination, htmlContent);
  },

  async run() {
    // Convert markdown to HTML
    const markdownFiles = await helper.getFiles('*.md');
    await pMap(markdownFiles, async filepath => {
      await this.compile(filepath);
    });
  },

  // Listen to changes in markdown and layouts and rebuild them
  watch() {
    // Update HTML on each markdown change
    helper.watch('./src/*.md', filepath => {
      this.compile(filepath);
    });
    // Rebuild everything when a layout, include or config changes
    helper.watch(
      [
        './src/_layouts/*.pug',
        './src/_includes/*.pug',
        './src/_mixins/*.pug',
        './config.json',
      ],
      () => {
        this.run();
      }
    );
  },
};
