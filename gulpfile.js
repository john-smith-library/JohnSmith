var gulp = require('gulp'),
    typescript = require('gulp-tsc'),
    concat = require('gulp-concat'),
    wrap = require("gulp-wrap"),
    path = require('path'),
    fs = require('fs-extra'),
    vm = require('vm'),
    util = require('util'),
    exec = require('gulp-exec'),
    rename = require("gulp-rename");

var config = {};
config.src = 'src';
config.srcTypeScript = path.join(config.src, '**/*.ts');
config.srcWrapper = path.join(config.src, 'templates/wrapper._ts');
config.out = 'out/';
config.outAllSrc = "john-smith-latest.ts";
config.outLatestName = "john-smith-latest.js";
config.outLatestMinName = "john-smith-latest-min.js";

gulp.task('join', function() {
    return gulp.src([config.srcTypeScript])
        .pipe(concat(config.outAllSrc))
        .pipe(wrap({ src: config.srcWrapper }))
        .pipe(gulp.dest(config.out));
});

gulp.task('compileJoined', ['join'], function() {
    return gulp.src([path.join(config.out, config.outAllSrc)])
        .pipe(typescript({emitError: false, declaration:true}))
        .pipe(gulp.dest(config.out));
});

gulp.task('minify', ['compileJoined'], function(){
    var options = {
        outFile: path.join(config.out, config.outLatestMinName)
    };

    return gulp.src(config.out + config.outLatestName).pipe(exec('ccjs <%= file.path %> > <%= options.outFile %> --language_in=ECMASCRIPT5_STRICT', options));
});

gulp.task('tag', ['minify'], function() {
    var packageConfig = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var version = packageConfig.version;

    return gulp.src(path.join(config.out, '*-latest*.js'))
        .pipe(rename(function (path) {
            path.basename = path.basename.replace('latest', version);
        }))
        .pipe(gulp.dest(config.out));
});

gulp.task('sanitizeDeclarations', ['compileJoined'], function() {
    var declarationContent = fs.readFileSync('out/john-smith-latest.d.ts', 'utf-8');

    declarationContent = declarationContent.replace(/private _.*;/g, '/* removed*/');
    fs.outputFileSync('out/john-smith-latest.d.ts', declarationContent);
});

gulp.task('fullBuild', ['tag', 'sanitizeDeclarations'], function(){});

gulp.task('watch', function() {
    return gulp.watch('src/**/*.ts', ['compileJoined']);
});