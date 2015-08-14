var SPMWebpackPlugin = require('./SPMWebpackPlugin');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer-core');
var csswring = require('csswring');

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
        loader: 'style!css!postcss-loader'
      }, {
        test: /\.(png|jpe?g|gif|eot|svg|ttf|woff)$/,
        loader: 'url?limit=10000'
      }, {
        test: /\.less$/,
        loader: 'style!css!postcss-loader!less'
      }]
    },
    externals: {
      jquery: 'jQuery'
    },
    plugins: [
      new SPMWebpackPlugin(opt.base)
    ],
    postcss: function() {
      return [
        autoprefixer({browsers: ['> 1% in CN', 'last 6 versions', 'iOS > 6', 'Android > 4.2']}),
        csswring({preserveHacks: true})
      ];
    }
  };

  if (type === 'dev') {
    base.devtool = '#source-map';
  } else {
    base.plugins.push(new webpack.optimize.OccurenceOrderPlugin(), new webpack.optimize.UglifyJsPlugin({compress: { warnings: false}}));
  }
  
  return webpack(base);
};
