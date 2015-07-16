var SPMWebpackPlugin = require('./SPMWebpackPlugin');
var path = require('path');
module.exports = function(opt) {
  return {
    entry: opt.entry,
    output: {
      path: opt.outputPath,
      filename: opt.filename,
      sourceMapFilename: '[file].map'
    },
    module: {
      loaders: [{
        test: /\.css$/,
        loader: 'style!css'
      }, {
        test: /\.(png|jpe?g|gif|eot|svg|ttf|woff)$/,
        loader: 'url?limit=10000'
      }]
    },
    externals: {
      jquery: 'jQuery'
    },
    plugins: [
      new SPMWebpackPlugin(opt.base),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })],
    devtool: '#source-map'
  }
};
