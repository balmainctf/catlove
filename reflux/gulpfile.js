var gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  reactify = require('reactify'),
  cssify = require('cssify'),
  sass = require('gulp-sass'),
  argv = require('yargs').argv,
  babelify = require("babelify");

var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/,
  rename: {
    'gulp-html-replace': 'htmlreplace'
  } // a mapping of plugins to rename
});

// path config
var path = {
  ENTRY_POINT: './src/js/main.js',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'app',
  DEST_BUILD: 'app/build',
  DEST_SRC: 'app/js',
  HTML: 'src/index.html',
  SCSS: ['./src/scss/**/**/*.scss', './src/scss/*.scss'],
};

// pass in dev server port
var defaultPort = 8080;
if (argv.port) {
  defaultPort = argv.port;
}

// COPY
gulp.task('copy', function() {
  gulp.src(path.HTML)
    .pipe(plugins.connect.reload())
    .pipe(gulp.dest(path.DEST));
});

// REPLACE HTML
gulp.task('replaceHTML', function() {
  gulp.src(path.HTML)
    .pipe(plugins.connect.reload())
    .pipe(plugins.htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});

// STYLES
gulp.task('styles', function() {
  gulp.src(path.SCSS)
    .pipe(plugins.connect.reload())
    .pipe(plugins.sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./' + path.DEST + '/css'));
});

// WATCH
gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copy']);

  gulp.watch(path.SCSS, ['styles']);

  var bundler = browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify, cssify, babelify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  var watcher = watchify(bundler);

  return watcher.on('update', function() {
      var stream = watcher.bundle();
      stream.on('error', function(err) {
        console.error(err);
      });
      stream.pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC))
        .pipe(plugins.connect.reload());
      console.log('Updated');
    })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});

// SERVER
gulp.task('dev-server', function() {
  plugins.connect.server({
    root: 'app',
    livereload: true,
    port: defaultPort
  });
});

// COMPILE JS
gulp.task('compile-js', function() {
  // todo: DRY tidy
  browserify({
      entries: [path.ENTRY_POINT],
      transform: [reactify, cssify, babelify],
      debug: true,
      cache: {},
      packageCache: {},
      fullPaths: true
    })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC))
    .pipe(plugins.connect.reload());
});

// BUILD
gulp.task('production', function() {
  browserify({
      entries: [path.ENTRY_POINT],
      transform: [reactify, cssify, babelify]
    })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(plugins.streamify(plugins.uglify(path.MINIFIED_OUT)))
    .pipe(gulp.dest(path.DEST_BUILD));
});

// DEFAULT
gulp.task('default', ['watch', 'dev-server', 'copy', 'styles', 'compile-js']);

// PRODUCTION
gulp.task('build', ['replaceHTML', 'production', 'styles']);
