// Gulp workflow for ZMA site

// Include gulp
var gulp = require('gulp');

// Include plugins
var jshint = require('gulp-jshint');
var jshintStylish = require ('jshint-stylish')
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var pump = require('pump');
var del = require('del');
var rename = require("gulp-rename");
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant')
var imageminJpegRecompress = require('imagemin-jpeg-recompress')
var cache = require('gulp-cached');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var notify = require("gulp-notify");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var minifyCSS = require("gulp-minify-css");
var zip = require("gulp-zip")

// Path variables
var IMAGES_PATH = 'public/assets/img/**/*.{png,jpeg,jpg,svg,gif}';
var IMAGES_DEST = 'public/assets/dist/img';
var DIST_PATH = 'public/assets/dist';

// Compress images
 gulp.task('images', function() {
	console.log('Starting Images Task')
  	return gulp.src(IMAGES_PATH)
    .pipe(imagemin(
  	[
		imagemin.gifsicle(),
		imagemin.jpegtran(),
		imagemin.optipng(),
		imagemin.svgo(),
		imageminPngquant(),
		imageminJpegRecompress()
	]
  ))
    .pipe(gulp.dest(IMAGES_DEST))
	.pipe(notify({ title: "Gulp Recipes", message: "Image Optimize: Success", onLast: true }));
});


// STYLES: Concat, List Errors, Minify, create Source Maps
gulp.task('styles', function() {
	console.log('Starting Styles Task')
	return gulp.src(['public/assets/css/normalize.css', 'public/assets/css/hamburger.css', 'public/assets/css/animate.css', 'public/assets/css/main.css'])
		.pipe(plumber(function (err){
			console.log('Styles Task Error');
			console.log(err);
			this.emit('end');
	}))
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(concat('styles.css'))  //Concats to this file
		.pipe(minifyCSS())
		.pipe(sourcemaps.write())  //Create sourcemaps after concatenation
	    .pipe(rename({ suffix: ".min" }))  //Adds .min suffix
		.pipe(gulp.dest('public/assets/dist/css'))
		.pipe(notify({ title: "Gulp Recipes", message: "Styles Task: Success!", onLast: true }));
});


// SCRIPTS: Concat, List Errors, Minify, create Source Maps
gulp.task('scripts', function() {
	console.log('Starting Scripts Task')
	return gulp.src(['public/assets/js/*.js', '!public/assets/js/**/*.min.js', '!public/assets/js/**/*-min.js'])
		.pipe(plumber(function (err){
			console.log('Scripts Task Error');
			console.log(err);
			this.emit('end');
	}))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: ".min" }))
		.pipe(gulp.dest('public/assets/dist/js'))
		.pipe(notify({ title: "Gulp Recipes", message: "Scripts Task: Success!", onLast: true }));
});


// Initiate BrowserSync, set up base directory, select Chrome browser
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './public'
    },
	  browser: "google chrome"
  })
});


// Set up Watched files for BrowserSync
gulp.task('watch', ['browserSync'], function () {
  console.log('Starting Watch Tasks')
  // Reloads the browser whenever CSS files change
  gulp.watch('public/assets/css/**/*.css', ['styles:reload']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('public/assets/**/*.html', browserSync.reload); 
  gulp.watch('public/assets/js/**/*.js', ['scripts:reload']);
  gulp.watch('public/assets/img/**', ['images:reload']);
});

gulp.task('styles:reload', ['styles'], function () {
    browserSync.reload();
});

gulp.task('scripts:reload', ['scripts'], function() {
	browserSync.reload();
});

gulp.task('images:reload', ['images'], function() {
	browserSync.reload();
});


// Delete existing files in Dist folder before running Gulp tasks
gulp.task('clean:dist', function() {
  console.log('Starting Clean:Dist Task')
  return del.sync([
	  DIST_PATH
  ]);
});



// Default production build task
gulp.task('default', function (callback) {
  runSequence('clean:dist', ['images', 'styles', 'scripts'], 'watch', callback)
});



// Check all javascript files for errors
gulp.task('jshint', function() {
  return gulp.src('public/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
	.pipe(notify({ message: "JShint: Finished", onLast: true }));
});


// Export site to zipped file
gulp.task('export', function() { 
	return gulp.src(['public/**', '!./{node_modules,node_modules/**}'])
		.pipe(zip('zma_site.zip'))
		.pipe(gulp.dest('public'))
		.pipe(notify({ title: "Gulp Recipes", message: "Project zipped file: Success!", onLast: true }));
});





// OLD TASKS ARCHIVE BELOW -- KEEP

// Old task - don't use
gulp.task('old', function (callback) {
  runSequence(['styles', 'browserSync', 'watch'],
    callback
  )
});


// Alternative gulp task runners below, not using runSequence, but instead running the tasks in brackets first. Keep for reference, don't use since tasks need to be run in particular sequence.

// Default task
gulp.task('production-NA', ['clean:dist', 'images', 'styles', 'scripts'], function () {
  console.log('Starting default task')
});


// Default task
gulp.task('default-NA', ['clean', 'styles', 'scripts', 'watch'], function () {
  console.log('Starting default task')
});


// Concatenate and minify JS files
////gulp.task('useref', function(){
////  return gulp.src('index.html')
////    .pipe(useref())
////    // Minifies only if it's a JavaScript file
////    .pipe(gulpIf('*.js', uglify()))
////    // Minifies only if it's a CSS file
////    .pipe(gulpIf('*.css', cleanCSS({compatibility: '*'})))
////    .pipe(gulp.dest('dist'));
////});

