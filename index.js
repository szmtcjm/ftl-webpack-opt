var SPMWebpackPlugin = require('./SPMWebpackPlugin');
var path = require('path');
var webpack = require('webpack');

module.exports = function(opt, type) {
  var base = {
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
      }, {
        test: /\.less$/,
        loader: 'style!css!less'
      }]
    },
    externals: {
      jquery: 'jQuery'
    },
    plugins: [
      new SPMWebpackPlugin(opt.base)
    ]
  };

  if (type === 'dev') {
    base.devtool = '#source-map';
  } else {
    opt.plugins.push(new webpack.optimize.OccurenceOrderPlugin(), new webpack.optimize.UglifyJsPlugin({compress: { warnings: false}}));
  }

  return base;
};
