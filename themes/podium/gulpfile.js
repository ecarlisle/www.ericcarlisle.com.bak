/*jslint node: true */
"use strict";

var addsrc = require('gulp-add-src');
var argv = require('yargs').argv;
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var clean = require('del');
var cleancss = require('gulp-clean-css');
var connect = require('gulp-connect');
var debug = require('gulp-debug');
var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var order = require('gulp-order');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');


gulp.task('clean', function(){
  return del.sync('assets/**/*');
});

gulp.task('styles', function() {
  return gulp.src([
    'node_modules/normalize-css/normalize.css',
    'node_modules/featherlight/src/featherlight.css',
    'node_modules/featherlight/src/featherlight.gallery.css',
    'src/assets/scss/main.scss'
  ])
//  .pipe(sourcemaps.init())
  .pipe(debug({
    title: 'Styles'
  }))
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(order([
    'normalize.css',
    'featherlight.css',
    'featherlight.gallery.css',
    'main.scss'
  ]))
  .pipe(concat('main.css'))
  .pipe(autoprefixer({ browsers: ['> 5%','last 2 versions'] }))
  .pipe(gulpif(argv.prod, cleancss()))
//  .pipe(sourcemaps.write())
  .pipe(gulp.dest('static/assets/css'))
  .pipe(livereload());
});

gulp.task('images', function() {
  return gulp.src([
      'src/assets/img/**/*',
    ])
    .pipe(debug({
      title: 'Images'
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img/'));
});

gulp.task('scripts', function() {
  return gulp.src(['src/assets/js/main.js'])
    .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(addsrc([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/featherlight/src/featherlight.js',
        'node_modules/featherlight/src/featherlight.gallery.js'
      ]))
    .pipe(debug({
      title: 'Scripts'
    }))
    .pipe(order([
      'jquery.js',
      'featherlight.js',
      'featherlight.gallery.js',
      'main.js'
    ]))
    .pipe(concat('main.js'))
    .pipe(gulpif(argv.prod, uglify()))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('static/assets/js'))
    .pipe(livereload());
});

gulp.task('html', function() {
  return livereload();
});

gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(webserver({
      livereload: true,
      open: false,
      directoryListing: true,
    }));
});

// Watchers
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/assets/js/*.js', ['js','scripts']);
  gulp.watch('src/assets/scss/**/*.scss', ['styles']);
  gulp.watch('src/assets/img/**/*', ['images']);
  // gulp.watch('**/*.html', ['html']);
});

// Default (Build) Task
gulp.task('default', ['clean', 'styles', 'scripts', 'images', 'watch']);





