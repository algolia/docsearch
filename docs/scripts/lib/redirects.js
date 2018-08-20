import helper from './helper';
import path from 'path';
import config from '../../config.json';
import pug from 'pug';
import pMap from 'p-map';

export default {
  async run() {
    const redirects = config.redirects;

    await pMap(redirects, async redirect => {
      const { from, to } = redirect;
      const pathToWrite = `./dist/${from}`;
      const urlToRedirectTo = `${config.site.url}/${to}`;

      // Create folder structure
      await helper.mkdirp(path.dirname(pathToWrite));

      const layoutContent = await helper.readFile(
        `./src/_layouts/redirect.pug`
      );
      const pugCompile = pug.compile(layoutContent);
      const redirectHtml = pugCompile({ redirectTo: urlToRedirectTo });

      await helper.writeFile(pathToWrite, redirectHtml);
    });
  },
};
