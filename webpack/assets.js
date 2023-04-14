//  Install this:
//  npm i -D add-asset-html-webpack-plugin
//
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = path => ({
  plugins: [
    new AddAssetHtmlPlugin(path.map( v => ({ filepath: require.resolve(v) }))),
  ],
});