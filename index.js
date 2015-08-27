var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var url = require('url');
var SPMWebpackPlugin = require('./SPMWebpackPlugin');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer-core');
var cssnano = require('cssnano');
var postcssUrl = require('postcss-url');

var config = {
  src: path.join(process.cwd(), 'src'),
  domain: '//i.epay.126.net/m/f/'
};

function postcssUrlFallback(originUrl) {
    var content = fs.readFileSync(path.resolve(config.src, originUrl));
    var md5 = crypto.createHash('md5').update(content).digest('hex').slice(0, 10);
    return url.resolve(config.domain, originUrl) + '?' + md5;
}

var postcssPluins = exports.postcssPluins = {
  autoprefixer: autoprefixer({browsers: ['> 1% in CN', 'last 15 versions', 'iOS > 6', 'Android > 4.2']}),
  postcssUrl: postcssUrl({url: 'inline', maxSize: 8, fallback: postcssUrlFallback, basePath: config.src}),
  cssnano: cssnano()
}

exports.webpackCompiler = function(opt, type) {
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
        postcssPluins.postcssUrl,
        postcssPluins.autoprefixer
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
