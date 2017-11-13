const fs = require('fs'),
      path = require('path'),
      glob = require('glob'),
      ttf2woff2 = require('ttf2woff2'),
      ttf2woff = require('ttf2woff/index.js'),
      crypto = require('crypto');

const last = (arr) => {
  return arr[arr.length-1];
}

const files = glob.sync(path.resolve(__dirname, 'source/doc/assets/fonts/*.ttf'));
const replaceFontNameRegexp = /^@.*\{[^{]+?\}/gm;

const fileMap = files.reduce((p,f) => {

  const name = last(f.split('/')).replace('.ttf','');
  const woffName = f.replace('.ttf', '.woff');

  const ttfBuffer = fs.readFileSync(f);
  const woffBuffer = fs.readFileSync(woffName);

  const woff2 = ttf2woff2(ttfBuffer);

  const woffHash = crypto.createHash('md5').update(woffBuffer).digest('hex');
  const ttfHash = crypto.createHash('md5').update(ttfBuffer).digest('hex')

  const woff2Encode = new Buffer(woff2).toString('base64');
  // const woffEncode = new Buffer(woff).toString('base64');

  const cssFontFamily = `@font-face {
    font-family: '${name}';
    src: url('data:application/font-woff2;charset=utf-8;base64, ${woff2Encode}') format('woff2'),
      url('../../fonts/${name}.woff?${woffHash}') format('woff'),
      url('../../fonts/${name}.ttf?${ttfHash}') format('truetype');
    font-weight: normal;
    font-style: normal;
}`

  const key = f.split('-')[1] === 'brands' ? 'source/doc/assets/stylesheets/_brands.scss' : 'source/doc/assets/stylesheets/vendors/_icons.scss';
  p[key] = cssFontFamily;

  return p;
},{});

// Write stylesheet
Object.keys(fileMap).forEach(key => {
  console.log(key)
  fs.readFile(key, 'utf-8', (err, data) => {
    if(err) throw new Error(`Error when reading ${key}`)

    const replacedContent = data.replace(replaceFontNameRegexp, fileMap[key]);

    fs.writeFileSync(key, replacedContent, 'utf8', function (err) {
       if (err) throw new Error(`Error when writing file ${key}`);
    });
  });
})