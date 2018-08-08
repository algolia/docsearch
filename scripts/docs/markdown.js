import helper from './helper';
import _ from 'lodash';
import path from 'path';
import frontMatter from 'front-matter';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItHighlight from 'markdown-it-highlightjs';
import cheerio from 'cheerio';
import pug from 'pug';
import pMap from 'p-map';
const markdown = markdownIt()
  .use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'anchor',
    permalinkSymbol: '',
  })
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
    const siteData = await helper.siteData();
    const currentUrl = path.relative(
      './src',
      _.replace(filepath, '.md', '.html')
    );
    const destination = `./docs/${currentUrl}`;

    // Read file, and extract front-matter from raw text
    const rawContent = await helper.readFile(filepath);
    const parsed = frontMatter(rawContent);
    const fileData = parsed.attributes;
    const pageData = _.merge({}, siteData, fileData);

    // Update {{config}} placeholders
    let markdownBody = parsed.body;
    _.each(pageData.config, (value, key) => {
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
    const sidebar = _.clone(pageData.sidebar);
    _.each(sidebar, category => {
      _.each(category.pages, page => {
        const linkBasename = path.basename(page.url, '.html');
        if (linkBasename === currentUrl) {
          page.headings = headings; // eslint-disable-line no-param-reassign
        }
      });
    });

    // Init layout
    const layoutName = fileData.layout;
    const layoutFile = `./src/_layouts/${layoutName}.pug`;
    const layoutContent = await helper.readFile(layoutFile);
    const pugCompile = pug.compile(layoutContent, { filename: layoutFile });

    // Compile layout
    const compileData = {
      ...pageData,
      sidebar,
      current: {
        url: currentUrl,
        content: htmlBody,
        ...fileData,
      },
    };
    const htmlContent = pugCompile(compileData);

    // Save to disk
    await helper.writeFile(destination, htmlContent);
  },

  async run() {
    // Convert markdown to HTML
    const markdownFiles = await helper.getFiles('{*.md,demos/[^_]*/*.md}');
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
    // Rebuild everything when a layout, include or data changes
    helper.watch(
      [
        './src/_layouts/*.pug',
        './src/_includes/*.pug',
        './src/_mixins/*.pug',
        './src/_data.json',
      ],
      () => {
        this.run();
      }
    );
  },
};
