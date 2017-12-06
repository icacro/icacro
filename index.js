/* eslint-disable */

const fs = require('fs.extra');
require('shelljs/global');

const args = process.argv;
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
try {
  if (args.length < 3) throw new Error('Missing path " npm run create ... "');
  const project = args[2];
  fs.readdir('src', (err, files) => {
    if (!project) throw new Error('Missing path " npm run create ... "');
    const path = `./src/${project}`;
    if (fs.existsSync(path)) throw new Error('Path exist"');
    fs.mkdirSync(path);
    const outFile = `${path}/variant.js`;
    const outLoader = `${path}/loader.js`;
    const outStyle = `${path}/style.css`;
    fs.copy('./src/.template/variant.js', outFile, { replace: false }, () => {
      sed('-i', 'hjf', `hj('trigger','variant${files.length}')`, outFile);
      sed('-i', 'testPath', `//${outFile}`, outFile);
      sed('-i', 'testName', capitalizeFirstLetter(project), outFile);
    });
    fs.copy('./src/.template/loader.js', outLoader, { replace: false }, () => {
      sed('-i', '#project', project, outLoader);
    });
    fs.copy('./src/.template/style.css', outStyle, { replace: false });
  });
} catch (e) {
  console.error(e.name + ': ' + e.message);
}
