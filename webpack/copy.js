//  Install this:
//  npm i -D copy-webpack-plugin
//
const CopyPlugin = require('copy-webpack-plugin');

module.exports = /**
 * @param {[{from: string, to: string}]} paths
 * @param {any} options
 */
 function (paths, options) {
  return {
    plugins: [
      new CopyPlugin({
        patterns: paths,
        options
      })
    ],
  };
};