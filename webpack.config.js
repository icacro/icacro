const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const fs = require("fs");

module.exports = function(env) {
  try {
    if (!env || !env.path) throw new Error('Missing path "npm run build --env.path ...."');
    const fullPath = `./src/${env.path}`;
    console.log(fullPath);
    if (!fs.existsSync(fullPath))  throw new Error('No path exist.');
    return {
      entry: path.join(path.resolve(__dirname, fullPath), 'variant.js'),
      output: {
        path: path.resolve(__dirname, `src/${env.path}`),
        filename: 'variant.min.js'
      },
      plugins: [
        new UglifyJSPlugin()
      ],
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: [
              'babel-loader',
            ],
          },
        ],
      }
    }
  } catch (e) {
    console.log(e.name + ': ' + e.message);
  }
};
