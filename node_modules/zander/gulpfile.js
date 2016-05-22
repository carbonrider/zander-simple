var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var fs = require('fs');
var del = require('del');

var runSequence = require('run-sequence');

var tsProject = ts.createProject('tsconfig.json');


gulp.task('clean', function(){
  return del(['build/**']);
});

gulp.task('transpile', function () {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))
    .js
    .pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: function (file) {
        //return file.cwd;
        var sourceFile = path.join(file.cwd, file.sourceMap.file);
        return path.join("../", path.relative(path.dirname(sourceFile), file.cwd));
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
  gulp.watch(['app.ts', '**/*.ts', '!node_modules', '!typings'], ['transpile']);
});

gulp.task('default', function(){
  runSequence('clean', 'transpile', 'watch');
});