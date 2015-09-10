/**
 * Created by catlove on 2015/9/8.
 */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var minify = require('gulp-minify-css');
var port = process.env.port || 5000;

//检测代码
gulp.task('lint', function() {
    gulp.src('./app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//将js代码按照react风格压缩,并将压缩文件指定到相应目录
gulp.task('browserify',function(){
	gulp.src('./app/js/main.js')
	.pipe(browserify({
		transform: 'reactify'
	}))
	.pipe(gulp.dest('./dist/js'))
	.pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('ugCss',function(){
	gulp.src('./app/css/*.css')
	.pipe(rename('style.min.css'))
	.pipe(minify())
	.pipe(gulp.dest('./dist/css'));
});

//reload
gulp.task('connect',function(){
    connect.server({
        port: port,
        livereload: true
    })
});

//reload js
gulp.task('js',function(){
	gulp.src('./dist/js/*.js')
	.pipe(connect.reload())
});

gulp.task('css',function(){
	gulp.src('./dist/css/*.css')
	.pipe(connect.reload())
});

gulp.task('watch',function(){
	gulp.watch('./dist/js/*.js',['js']);
	gulp.watch('./dist/css/*.css',['css']);
	gulp.watch('./app/js/**/*.js',['browserify']);
});

gulp.task('default',['browserify']);

gulp.task('serve',['ugCss','browserify','connect','watch']);