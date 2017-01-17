var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var spawnSync = require('child_process').spawnSync;
var url = require('url');
var webpack = require('webpack');

var ENVIRONMENT = process.env.NODE_ENV || 'development';
var PRODUCTION = ENVIRONMENT === 'production';

var CHROME_BUILD_PATH = 'chrome/build';
var CHROME_ASSETS_SOURCE_PATH = 'chrome/src/{html/*,img/*,manifest.json}';

var WEBPACK_CONFIG = {
  devtool: PRODUCTION ? null : 'source-map',
  entry: {
    'js/index': './chrome/src/js/index'
  },
  output: {
    path: CHROME_BUILD_PATH,
    filename: '[name].js'
  },
  module: {
    loaders: [{
      loader: 'babel',
      test: /.jsx?$/,
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react'],
        plugins: ['transform-object-rest-spread']
      }
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
}

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

gulp.task('styles', function() {
  var isDevelopment = config.environment !== 'production';
  var src = path.join(config.less.src, '**/[^_]*.less');

  return gulp.src(src)
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(less({
      paths: config.less.paths
    }).on('error', function(error) {
      gutil.log('[less:build]', '[ERROR]', error.message);

      this.emit('end', new gutil.PluginError('styles', error, {
        showStack: true
      }));
    }))
    .pipe(autoprefixer())
    .pipe(gulpIf(!isDevelopment, cssnano({ zindex: false })))
    .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
    .pipe(gulp.dest(config.less.dest));
});

gulp.task('assets', function() {
  return gulp.src(CHROME_ASSETS_SOURCE_PATH)
    .pipe(gulp.dest(CHROME_BUILD_PATH));
});

gulp.task('watch:assets', function() {
  gulp.watch(CHROME_ASSETS_SOURCE_PATH, ['assets']);
});

gulp.task('watch:styles', function() {
  gulp.watch(path.join(__dirname, '../../**/*.less'), ['styles']);
});

gulp.task('clean', function() {
  spawnSync('rm', ['-rf', CHROME_BUILD_PATH]);
});

gulp.task('watch', ['watch:scripts', 'watch:styles', 'watch:assets']);
gulp.task('build', ['scripts', 'styles', 'assets']);
