//  Install this:
//  npm i -D css-loader sass-loader mini-css-extract-plugin
//
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(sc|sa|c)ss$/,
          // include: paths,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1 }
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    ]
  };
};