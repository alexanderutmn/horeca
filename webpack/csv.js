//  Install this:
//  npm i -D csv-loader
//
module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(csv)$/,
          use: {
            loader: 'csv-loader',
            options: {
              name: 'csv/[name][hash:6].[ext]'
            }
          },
        },
      ],
    },
  };
};