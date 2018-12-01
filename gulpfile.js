"use strict";

var gulp        = require('gulp'),
  plumber       = require('gulp-plumber'),
  concat        = require('gulp-concat'),
  rename        = require('gulp-rename'),
  less         =  require('gulp-less'),
  // sass          = require('gulp-sass'),
  autoprefixer  = require('gulp-autoprefixer'),
  cssMinify     = require('gulp-clean-css'),
  packer        = require('gulp-uglify'),
  hb            = require('gulp-hb'),
  sourcemaps    = require('gulp-sourcemaps'),
  imagemin      = require('gulp-imagemin'),
  browserSync   = require("browser-sync").create(),
  del           = require('del'),
  reload        = browserSync.reload;

var paths = {
  deploy:     'deploy',
  build:      'build',
  source:     'src',
  html:       'src/html/',
  // style:      'src/sass/main.scss',
  style:      'src/less/main.less',
  js:         'src/js/*.js',
  images:     'src/img/**/*',
  fonts:      'src/fonts/**/*'
};

var watch = {
  html:       'src/html/**/*',
  // style:      'src/sass/**/*',
  style:      'src/less/**/*',
  js:         'src/js/**/*',
  images:     'src/img/**/*'
};

var cssLibs = [
  // 'src/sass/vendor/slick.css',
  // 'src/sass/vendor/slick-lightbox.css',
];

var jsLibs = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  // 'src/js/vendor/collapse.js',
  // 'src/js/vendor/dropdown.js',
  // 'src/js/vendor/slick.min.js',
  // 'src/js/vendor/slick-lightbox.js',
  // 'node_modules/bootstrap/dist/js/bootstrap.min.js'
];

var jsMain = [
  paths.source + '/js/main.js'
];



// ===============================================
// BUILD
// ===============================================

// Build HTML
// -----------------------------------------------
gulp.task('build-html', function() {
  var hbStream = hb()
    // Partials
    .partials(paths.html + 'partials/*.hbs')
    // Helpers
    .helpers(require('handlebars-helpers'))
  return gulp
    .src(paths.html + 'pages/*.hbs')
    .pipe(plumber())
    .pipe(hbStream)
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(paths.build));
});


// Build CSS
// -----------------------------------------------
gulp.task('build-css', ['build-vendor-css'], function() {
  return gulp
    .src(paths.style)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    // .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    // .pipe(cssMinify())
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.build + '/assets/css'));
});


// Build Vendor CSS
// -----------------------------------------------
gulp.task('build-vendor-css', function() {
  return gulp
    .src(cssLibs)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    // .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    // .pipe(cssMinify())
    .pipe(concat('vendor.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.build + '/assets/css'));
});


// Build JavaScript
// -----------------------------------------------

// Build JS
gulp.task('build-js', ['build-vendor-js'], function() {
  return gulp
    .src(jsMain)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    // .pipe(packer())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.build + '/assets/js'));
});

// Build Vendor JS
gulp.task('build-vendor-js', function() {
  return gulp
    .src(jsLibs)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    // .pipe(packer())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.build + '/assets/js'));
});


// Build Images
// -----------------------------------------------

// Minify Images
gulp.task('build-img', function() {
  return gulp
    .src(paths.images + '.{jpg,png,svg,gif,ico}')
    .pipe(plumber())
    // .pipe(imagemin())
    .pipe(gulp.dest(paths.build + '/assets/img'));
});


// Copy Fonts
// -----------------------------------------------
gulp.task('build-fonts', function() {
  return gulp
    .src(paths.fonts)
    .pipe(plumber())
    .pipe(gulp.dest(paths.build + '/assets/fonts'));
});


// Clean Build
// -----------------------------------------------
gulp.task('clean', function() {
  del.sync(paths.build);
});



// ===============================================
// DEPLOY
// ===============================================

// Deploy HTML
// -----------------------------------------------
gulp.task('deploy-html', function() {
  var hbStream = hb()
    // Partials
    .partials(paths.html + 'partials/*.hbs')
    // Helpers
    .helpers(require('handlebars-helpers'))
  return gulp
    .src(paths.html + 'pages/*.hbs')
    .pipe(plumber())
    .pipe(hbStream)
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(paths.deploy));
});


// Deploy CSS
// -----------------------------------------------
gulp.task('deploy-css', ['deploy-vendor-css'], function() {
  return gulp
    .src(paths.style)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    // .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssMinify())
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.deploy + '/assets/css'));
});


// Deploy Vendor CSS
// -----------------------------------------------
gulp.task('deploy-vendor-css', function() {
  return gulp
    .src(cssLibs)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less())
    // .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssMinify())
    .pipe(concat('vendor.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.deploy + '/assets/css'));
});


// Deploy JavaScript
// -----------------------------------------------

// Deploy JS
gulp.task('deploy-js', ['deploy-vendor-js'], function() {
  return gulp
    .src(paths.js)
    .pipe(plumber())
    .pipe(concat('script.js'))
    .pipe(packer())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.deploy + '/assets/js'));
});

// Deploy Vendor JS
gulp.task('deploy-vendor-js', function() {
  return gulp
    .src(jsLibs)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(packer())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.deploy + '/assets/js'));
});


// Deploy Images
// -----------------------------------------------

// Minify Images
gulp.task('deploy-img', function() {
  return gulp
    .src(paths.images + '.{jpg,png,svg,gif,ico}')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(paths.deploy + '/assets/img'));
});


// Deploy Fonts
// -----------------------------------------------
gulp.task('deploy-fonts', function() {
  return gulp
    .src(paths.fonts)
    .pipe(plumber())
    .pipe(gulp.dest(paths.deploy + '/assets/fonts'));
});



// ===============================================
// WATCH
// ===============================================

// Watch HTML
// -----------------------------------------------
gulp.task('html-watch', ['build-html'], function(done) {
  browserSync.reload();
  done();
});

// Watch CSS
// -----------------------------------------------
gulp.task('css-watch', ['build-css'], function(done) {
  browserSync.reload();
  done();
});

// Watch JS
// -----------------------------------------------
gulp.task('js-watch', ['build-js'], function(done) {
  browserSync.reload();
  done();
});

// Watch Images
// -----------------------------------------------
gulp.task('img-watch', ['build-img'], function(done) {
  browserSync.reload();
  done();
});



// ===============================================
// TASKS
// ===============================================

// Default Task
// -----------------------------------------------

// browser-sync
gulp.task('default', ['build'],
  function() {
    browserSync.init({
      ghostMode: {
        clicks: false,
        forms: false,
        scroll: false
      },
      reloadDelay: 1000,
      notify: false,
      server: {
        baseDir: paths.build
      },
      open: false
    });

    gulp.watch(watch.html, ['html-watch']);

    gulp.watch(watch.style, ['css-watch']);

    gulp.watch(watch.js, ['js-watch']);

    gulp.watch(watch.images, ['img-watch']);
  });


// Build Task
// -----------------------------------------------
gulp.task('build', ['build-html', 'build-css', 'build-js', 'build-img', 'build-fonts']);


// Deploy Task
// -----------------------------------------------
gulp.task('deploy', ['deploy-html', 'deploy-css', 'deploy-js', 'deploy-img', 'deploy-fonts']);
