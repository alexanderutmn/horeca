const path = require('path');

module.exports = function() {
  return {
    devServer: {
      stats: 'errors-only',
      overlay: true,
      port: 8000,
      contentBase: path.join(__dirname, 'dist'),
    },
  };
};