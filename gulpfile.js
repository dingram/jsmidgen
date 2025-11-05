var gulp = require('gulp');
var tape = require('gulp-tape');

gulp.task('test', function() {
	return gulp.src(['test/file-test.js', 'test/midi-util-test.js'])
		.pipe(tape());
});

gulp.task('default', gulp.parallel('test'));
