/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util');
    sourcemaps = require('gulp-sourcemaps');
    concat = require('gulp-concat');
	minifyCSS = require('gulp-minify-css');
	rename = require('gulp-rename');

// create a default task and just log a message
// gulp.task('default', function(){
// return gutil.log('gulp running');
// });

// gulp.task('default', ['build-css']);

gulp.task('build-css',function(){
	return gulp.src('views/*.css')
		.pipe(minifyCSS())
		.pipe(concat("main.css"))
		// .pipe(rename('main.css'))
		.pipe(gulp.dest('gulpdest/'));
});

gulp.task('default', function() {
  gulp.run('build-css');
  gulp.watch('views/*.css', function() {
    gulp.run('build-css');
  });
});