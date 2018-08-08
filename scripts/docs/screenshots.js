import pify from 'pify';
import _ from 'lodash';
import _glob from 'glob';
import path from 'path';
import fs from 'fs-extra';
import liveServer from 'live-server';
import puppeteer from 'puppeteer';
import pEach from 'p-each-series';
const glob = pify(_glob);

(async function() {
  // Geting the list of demo folders that don't have an og_image
  const demos = _.compact(
    _.map(await glob('./src/demos/[^_]*/index.md'), filepath => {
      const dirname = path.dirname(filepath);
      const imagePath = `${dirname}/og_image.png`;
      if (fs.existsSync(imagePath)) {
        return null;
      }
      return path.basename(dirname);
    })
  );

  if (_.isEmpty(demos)) {
    return;
  }

  liveServer.start({
    root: './docs',
    open: false,
    port: 8082,
  });

  const browser = await puppeteer.launch();
  await pEach(demos, async demo => {
    const page = await browser.newPage();
    page.setViewport({ width: 1600, height: 900 });
    await page.goto(`http://127.0.0.1:8082/demos/${demo}/`);

    // Wait for the whole InstantSearch to load
    let waitForRender = true;
    while (waitForRender) {
      const renderDiv = await page.evaluate(() =>
        document.getElementById('firstRender')
      );
      waitForRender = !renderDiv;
    }

    const srcPath = `./src/demos/${demo}/og_image.png`;
    const docsPath = `./docs/demos/${demo}/og_image.png`;
    await page.screenshot({
      path: srcPath,
    });

    await fs.copy(srcPath, docsPath);
  });
  await browser.close();
  process.exit(0); // eslint-disable-line no-process-exit
})();
