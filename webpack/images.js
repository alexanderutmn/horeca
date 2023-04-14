//  Install this:
//  npm i -D file-loader
//
module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'images/[name][hash:4].[ext]'
            }
          },
        },
      ],
    },
  };
};