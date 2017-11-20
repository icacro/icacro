const fs = require('fs.extra');
const pktJs = require('./icacro/package.json');
require('shelljs/global');
const args = process.argv;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
try {

  if(args.length < 3) throw new Error('Missing path " npm run create ... "');
  const project = args[2];
  fs.readdir('src', (err, files) => {
    if (!project)  throw new Error('Missing path " npm run create ... "');
    const path = `./src/${project}`;
    if (fs.existsSync(path)) throw new Error('Path exist"');
    fs.mkdirSync(path);
    const out = `${path}/variant.js`;
    fs.copy('./src/template.js', out, { replace: false }, () => {
      sed('-i', 'hj', `hj('trigger','variant${files.length}')`, out);
      sed('-i', 'testPath', `//${out}`, out);
      sed('-i', 'testName', capitalizeFirstLetter(project), out);
      sed('-i', '#version', pktJs.version, out);
    });
  });
} catch (e) {
  console.error(e.name + ': ' + e.message);
}
