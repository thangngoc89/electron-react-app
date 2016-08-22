/*
 * Bundle all front-end file too app/dist with Webpack
 */

const webpack = require('webpack');

module.exports = config => new Promise((resolve, reject) => {
  webpack(config.webpack).run((err, stats) => {
    if (err) {
      reject(err);
    } else {
      console.log(stats.toString(config.webpack.stats));
      resolve();
    }
  });
});
