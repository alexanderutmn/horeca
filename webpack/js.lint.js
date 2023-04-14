//  Install this:
//  npm i -D eslint-loader
//
module.exports = function({ paths, options }) {
  return {
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|jsx)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)|(moment)/,
          include: paths,
          options: options,
        },
      ],
    },
  };
};