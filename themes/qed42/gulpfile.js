/**
 ** Gulp file for qed42 theme.
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var sassGlob = require('gulp-sass-glob');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

/* Gulp task to SASS to CSS compilation for
 * sass folder outside patternlab.
 */

gulp.task('sass:main', function () {
  gulp.src('sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'));
});

/* Gulp task to SASS to CSS compilation for
 * sass folder inside patternlab
 * path -> (patternlab/source/css/style.scss).
 */

gulp.task('sass:patternlab', function () {
  gulp.src('patternlab/source/css/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('patternlab/source/css'))
    .on('end', function() {
      gulp.run('patternlab:generate');
    });
});

/* Gulp task to generate patterns in patternlab. */

gulp.task('patternlab:generate', function () {
  return gulp.src('patternlab/source/_patterns', {read: false})
    .pipe(shell([
      'php patternlab/core/console --generate'
    ]));

});

/* Gulp task to watch changes in scss files
 * in drupal theme and patternlab.
 */

gulp.task('watch:sass', function () {
  gulp.watch('sass/**/**', ['sass:main']);
  gulp.watch(['patternlab/source/**/**.scss'], ['sass:patternlab']);
});

/* Gulp task to watch patterns generated in
 * patternlab.
 */

gulp.task('watch:patternlab', function () {
  gulp.watch('patternlab/source/_patterns/**', ['patternlab:generate']);
});

/* Gulp task to watch changes in
 * scss fles in drupal theme and
 * patterlab along with patterns
 * generated in patternlab.
 */

gulp.task('watch', function(){
  gulp.watch('sass/**/**', ['sass:main']);
  gulp.watch('patternlab/source/**/**.scss', ['sass:patternlab']);
  gulp.watch('patternlab/source/_patterns/**', ['patternlab:generate']);
})
