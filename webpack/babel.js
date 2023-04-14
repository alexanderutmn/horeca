//  Install this:
//  npm i -D babel-loader
//
module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules(?:\/components|\/CustomLib)|bower_components)/,
          // /(node_modules[\/\\](?:components|CustomLib|react)|bower_components)/ linux?
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/env",
              "@babel/react"
            ]
          }
        },
      ],
    },
  };
};
