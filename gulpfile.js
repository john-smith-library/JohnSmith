var gulp = require('gulp'),
    typescript = require('gulp-tsc'),
    concat = require('gulp-concat'),
    wrap = require("gulp-wrap"),
    path = require('path'),
    fs = require('fs-extra'),
    vm = require('vm'),
    util = require('util'),
    jasmineSeed = require('./libs/jasmine-seed.js'),
    endOfLine = require('os').EOL;

var config = {};
config.src = 'src';
config.srcTypeScript = path.join(config.src, '**/*.ts');
config.srcWrapper = path.join(config.src, 'templates/wrapper._ts');
config.out = 'out/';
config.outAllSrc = "john-smith-latest.ts";

gulp.task('join', function() {
    return gulp.src([config.srcTypeScript])
        .pipe(concat(config.outAllSrc))
        .pipe(wrap({ src: config.srcWrapper }))
        .pipe(gulp.dest(config.out));
});

gulp.task('compileJoined', ['join'], function() {
    return gulp.src([path.join(config.out, config.outAllSrc)])
        .pipe(typescript({emitError: false}))
        .pipe(gulp.dest(config.out));
});

gulp.task('watch', function() {
    return gulp.watch('src/**/*.ts', ['compileJoined']);
});