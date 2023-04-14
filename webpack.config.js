'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const sass = require('./webpack/sass');
const sourceMap = require('./webpack/sourceMap');
const images = require('./webpack/images');
const fonts = require('./webpack/fonts');
const extractCSS = require('./webpack/css.extract');
const devserver = require('./webpack/devserver');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const copy = require('./webpack/copy');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const JavaScriptObfuscator = require('webpack-obfuscator');

const PATHS = {
  source: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist'),
};
const common = merge([
  {
    entry: {
      'main': path.join(PATHS.source,'/client/assets/js/main_new.js'),
    },
    // output: {
    //   path: PATHS.build,
    //   publicPath: '/',
    //   // filename: '[name].[contenthash:4].js',
    //   filename: '[name].js',
    // },
    output: {
        path: path.resolve(__dirname, 'src/client/assets/bundles'),
        publicPath: '/',
        filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@client': path.resolve(__dirname, 'src/client/'),
      }
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            // fallback to style-loader in development
            process.env.NODE_ENV !== 'production'
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css'
      }),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          'common': {
            minChunks: 2,
            chunks: 'all',
            name: 'common',
            priority: 10,
            enforce: true,
          },
        },
      },
    },
  },
]);

module.exports = function(env, argv) {
  if (argv.mode === 'production') {
    return merge([
      common,
      extractCSS(),
      {
        optimization: {
          minimizer: [
            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              uglifyOptions: {
                output: {
                  comments: false
                }
              }
            }),
          ]
        }
      }
    ]);
  }
  if (argv.mode === 'development') {
    return merge([
      common,
      argv.devserver && devserver(),
      extractCSS(),
      sourceMap(),
    ]);
  }
};


// 'use strict';
// const path = require('path');
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const merge = require('webpack-merge');
// const sass = require('./webpack/sass');
// const sourceMap = require('./webpack/sourceMap');
// const images = require('./webpack/images');
// const fonts = require('./webpack/fonts');
// const extractCSS = require('./webpack/css.extract');
// const devserver = require('./webpack/devserver');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const copy = require('./webpack/copy');
// // const JavaScriptObfuscator = require('webpack-obfuscator');
//
// const PATHS = {
//   source: path.join(__dirname, 'src'),
//   build: path.join(__dirname, 'dist'),
// };
// const common = merge([
//   {
//     entry: {
//       'index': path.join(PATHS.source,'/client/assets/js/main.js'),
//       'reservation': path.join(PATHS.source,'/client/assets/js/reservation.js'),
//       'payment': path.join(PATHS.source,'/client/assets/js/payment.js'),
//
//       // 'cart': path.join(PATHS.source,'location_file')
//     },
//     output: {
//       path: PATHS.build,
//       publicPath: '/',
//       // filename: '[name].[contenthash:4].js',
//       filename: '[name].js',
//     },
//     resolve: {
//       extensions: ['.js'],
//       alias: {
//         '@': path.resolve(__dirname, 'src'),
//         '@client': path.resolve(__dirname, 'src/client/'),
//       }
//     },
//     devtool: 'source-map',
//     plugins: [
//       // new HtmlWebpackPlugin({
//       //   filename: 'main.html',
//       //   inject: 'body',
//       //   chunks: ['index', 'common'],
//       //   template: path.join(PATHS.source,'client/index.html'),
//       //   favicon: path.join(PATHS.source,'client/favicon.ico')
//       // }),
//       // new HtmlWebpackPlugin({
//       //   filename: 'cart.html',
//       //   inject: 'body',
//       //   chunks: ['index', 'common'],
//       //   template: path.join(PATHS.source,'client/cart.html'),
//       //   favicon: path.join(PATHS.source,'client/favicon.ico')
//       // }),
//       // new HtmlWebpackPlugin({
//       //   filename: 'order.html',
//       //   inject: 'body',
//       //   chunks: ['index', 'common'],
//       //   template: path.join(PATHS.source,'client/order.html'),
//       //   favicon: path.join(PATHS.source,'client/favicon.ico')
//       // }),
//       // new HtmlWebpackPlugin({
//       //   filename: 'create_order.html',
//       //   inject: 'body',
//       //   chunks: ['index', 'common'],
//       //   template: path.join(PATHS.source,'client/create_order.html'),
//       //   favicon: path.join(PATHS.source,'client/favicon.ico')
//       // }),
//       // new HtmlWebpackPlugin({
//       //   filename: 'reservation.html',
//       //   inject: 'body',
//       //   chunks: ['reservation', 'common'],
//       //   template: path.join(PATHS.source,'client/reservation.html'),
//       //   favicon: path.join(PATHS.source,'client/favicon.ico')
//       // }),
//       // new HtmlWebpackPlugin({
//       //   filename: 'payment.html',
//       //   inject: 'body',
//       //   chunks: ['payment', 'common'],
//       //   template: path.join(PATHS.source,'client/payment.html'),
//       //   favicon: path.join(PATHS.source,'client/favicon.ico')
//       // }),
//       // new CleanWebpackPlugin(),
//
//       // new JavaScriptObfuscator({
//       //       rotateStringArray: true
//       //   }, ['index.[contenthash:4].js'])
//       // new JscramblerWebpack({
//       //   enable: true, // optional, defaults to true
//       //   chunks: ['index'], // optional, defaults to all chunks
//       //   params: [],
//       //   applicationTypes: {},
//       //   accessKey: "sadasdasd",
//       //   applicationId: "00c8f01e1a3b00011234f005",
//       //   // and other jscrambler configurations
//       // })
//       // new WebpackObfuscator({
//       //       rotateStringArray: true
//       //   }, ['index.[contenthash:4].js'])
//     ],
//     // webpack loader rules array
//     // rules: [
//     //     {
//     //         test: /\.js$/,
//     //         exclude: [
//     //             path.join(PATHS.source,'/client/assets/js/main.js')
//     //         ],
//     //         enforce: 'post',
//     //         use: {
//     //             loader: JavaScriptObfuscator.loader,
//     //             options: {
//     //                 rotateStringArray: true
//     //             }
//     //         }
//     //     }
//     // ],
//     optimization: {
//       splitChunks: {
//         cacheGroups: {
//           'common': {
//             minChunks: 2,
//             chunks: 'all',
//             name: 'common',
//             priority: 10,
//             enforce: true,
//           },
//         },
//       },
//     },
//   },
//   // images(),
//   // fonts(),
//   // copy([
//   //   {
//   //     from: path.join(PATHS.source, 'client/assets/js/lib'),
//   //     to: path.join(PATHS.build, 'assets/js/')
//   //   },
//   //   {
//   //     from: path.join(PATHS.source, 'client/assets/vendor'),
//   //     to: path.join(PATHS.build, 'assets/vendor')
//   //   },
//   //   {
//   //     from: path.join(PATHS.source, 'client/assets/fonts'),
//   //     to: path.join(PATHS.build, 'assets/fonts')
//   //   },
//   //   {
//   //     from: path.join(PATHS.source, 'client/assets/images'),
//   //     to: path.join(PATHS.build, 'assets/images')
//   //   },
//   //   {
//   //     from: path.join(PATHS.source, 'client/assets/css'),
//   //     to: path.join(PATHS.build, 'assets/css')
//   //   },
//   // ])
// ]);
//
// module.exports = function(env, argv) {
//   if (argv.mode === 'production') {
//     return merge([
//       common,
//       extractCSS(),
//       {
//         optimization: {
//           minimizer: [
//             new UglifyJsPlugin({
//               cache: true,
//               parallel: true,
//               uglifyOptions: {
//                 output: {
//                   comments: false
//                 }
//               }
//             }),
//           ]
//         }
//       }
//     ]);
//   }
//   if (argv.mode === 'development') {
//     return merge([
//       common,
//       argv.devserver && devserver(),
//       extractCSS(),
//       sourceMap(),
//     ]);
//   }
// };
