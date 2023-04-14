const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = function() {
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].[hash:4].css' : '[name].[hash:8].css',
        chunkFilename: devMode ? '[id].[hash:4].css' : '[id].[hash:8].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: devMode,
              },
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer(),
                  cssnano({
                    preset: [
                      'default', {
                        discardComments: {
                          removeAll: true,
                        }
                      }
                    ]
                  })
                ]
              }
            }
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserJSPlugin({}),
        new OptimizeCSSAssetsPlugin({})
      ],
    }
  };
};