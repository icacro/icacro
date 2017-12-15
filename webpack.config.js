const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const fs = require('fs');
const webpack = require('webpack');

module.exports = (env) => {
  try {
    if (!env || !env.project) throw new Error('Missing path "npm run build --env.project ...."');
    const fullPath = `./src/${env.project}`;
    if (!fs.existsSync(fullPath)) throw new Error('No path exist.');
    return {
      entry: path.join(path.resolve(__dirname, fullPath), 'variant.js'),
      output: {
        path: path.resolve(__dirname, `src/${env.project}`),
        filename: 'variant.min.js',
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
