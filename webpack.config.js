const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const fs = require('fs');
const webpack = require('webpack');

function getAllVariants(projectName) {
  return fs.readdirSync(`src/${projectName}`).filter(file => file.startsWith('variant') && !file.includes('min'));
}

function removeExtension(name) {
  return name.replace('.js', '');
}

function getEntries(projectName, fullPath) {
  const entry = {};
  getAllVariants(projectName).forEach((name) => {
    entry[removeExtension(name)] = path.join(path.resolve(__dirname, fullPath), name);
  });
  return entry;
}

module.exports = (env) => {
  try {
    if (!env || !env.project) throw new Error('Missing path "npm run build --env.project ...."');
    const fullPath = `./src/${env.project}`;
    if (!fs.existsSync(fullPath)) throw new Error('No path exist.');

    return {
      entry: getEntries(env.project, fullPath),
      output: {
        path: path.resolve(__dirname, `src/${env.project}`),
        filename: '[name].min.js',
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false,
          },
        }),
        new LiveReloadPlugin(),
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
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
    };
  } catch (e) {
    throw new Error(e.message);
  }
};
