//  Install this:
//  npm i -D css-loader style-loader mini-css-extract-plugin
//
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          // include: paths,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[id].css'
      })
    ]
  };
};