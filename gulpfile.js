var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var spawnSync = require('child_process').spawnSync;
var webpack = require('webpack');
var zip = require('gulp-zip');

var ENVIRONMENT = process.env.NODE_ENV || 'development';
var PRODUCTION = ENVIRONMENT === 'production';

var CHROME_SOURCE_PATH = path.join(__dirname, 'chrome/src');
var CHROME_BUILD_PATH = path.join(__dirname, 'chrome/build');
var CHROME_PACKAGES_PATH = path.join(__dirname, 'chrome/package');

var CHROME_ASSETS_SOURCE_PATH = CHROME_SOURCE_PATH + '/{html/*,img/*,manifest.json}';
var CHROME_SCRIPTS_SOURCE_PATH = path.join(CHROME_SOURCE_PATH, 'js');


var WEBPACK_CONFIG = {
  context: CHROME_SCRIPTS_SOURCE_PATH,
  devtool: PRODUCTION ? null : 'source-map',
  entry: {
    'js/contentscript': './contentscript',
    'js/popup': './popup'
  },
  resolve: {
    root: [__dirname, CHROME_SCRIPTS_SOURCE_PATH]
  },
  output: {
    path: CHROME_BUILD_PATH,
    filename: '[name].js'
  },
  module: {
    loaders: [{
      loader: 'babel',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react'],
        plugins: ['transform-object-rest-spread']
      }
    }, {
      loader: 'json',
      test: /\.json$/
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENVIRONMENT)
      }
    }),
    PRODUCTION && new webpack.optimize.DedupePlugin(),
    PRODUCTION && new webpack.optimize.UglifyJsPlugin()
  ].filter(Boolean)
};

gulp.task('scripts', function(done) {
  webpack(WEBPACK_CONFIG, function(error, stats) {
    if (error) throw new gutil.PluginError('webpack:build', error);

    gutil.log('[webpack:build]', '\n' + stats.toString({ chunks: false, colors: true }));

    done();
  });
});

gulp.task('watch:scripts', function(done) { //eslint-disable-line no-unused-vars
  var config = Object.assign({}, WEBPACK_CONFIG, { watch: true });
  var compiler = webpack(config);

  compiler.watch({}, function(error, stats) {
    if (error) throw new gutil.PluginError('webpack:build', error);

    gutil.log('[webpack:build]', stats.toString({ colors: true }));
    gutil.log('[webpack:build]', 'Built scripts');
  });
});

gulp.task('assets', function() {
  return gulp.src(CHROME_ASSETS_SOURCE_PATH)
    .pipe(gulp.dest(CHROME_BUILD_PATH));
});

gulp.task('watch:assets', function() {
  gulp.watch(CHROME_ASSETS_SOURCE_PATH, ['assets']);
});

gulp.task('clean', function() {
  spawnSync('rm', ['-rf', CHROME_BUILD_PATH]);
});

gulp.task('package', () => {
  var manifestContents = fs.readFileSync(path.join(CHROME_SOURCE_PATH, 'manifest.json'));
  var manifest = JSON.parse(manifestContents);
  var version = manifest.version;
  var name = 'package-' + version + '.zip';

  return gulp.src(CHROME_BUILD_PATH)
    .pipe(zip(name))
    .pipe(gulp.dest(CHROME_PACKAGES_PATH));
});

gulp.task('watch', ['watch:assets', 'watch:scripts']);
gulp.task('build', ['scripts', 'assets']);
