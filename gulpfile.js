var gulp = require('gulp'),
    typescript = require('gulp-tsc');

gulp.task('compile', function() {
    console.log('rebuild');
    gulp.src(['src/**/*.ts'])
        .pipe(typescript({emitError: false}))
        .pipe(gulp.dest('out/'));
});


gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', ['compile']);
});
