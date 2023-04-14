//  Install this:
//  npm i -D xml-loader
//
module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(xml)$/,
          use: {
            loader: 'xml-loader',
            options: {
              name: 'xml/[name][hash:6].[ext]'
            }
          },
        },
      ],
    },
  };
};