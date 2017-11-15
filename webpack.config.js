const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const fs = require("fs");

module.exports = function(env) {
  try {
    if (!env || !env.path) throw new Error('Missing path "npm run build --env.path ...."');
    if (!fs.existsSync(env.path)) fs.mkdirSync(env.path);
    return {
      entry: path.join(path.resolve(__dirname, 'src'), 'template.js'),
      output: {
        path: path.resolve(__dirname, `src/${env.path}`),
        filename: 'variant.js'
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
