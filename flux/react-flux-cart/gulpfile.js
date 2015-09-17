/**
 * Created by Administrator on 2015/9/17.
 */
var gulp = require('gulp');
var connect = require('gulp-connect');
var webpack = require('gulp-webpack');
var config = require('./webpack.config');
var port = process.env.port || 5000;

gulp.task('webpack',function(){
    gulp.src('./js/app.js')
    .pipe(webpack(config))
    .pipe(gulp.dest('./build'));
});

gulp.task('connect',function(){
    connect.server({
        port: port,
        livereload: true
    })
});

gulp.task('watch',function(){
    //gulp.watch('./js/*.js',['webpack']);
    gulp.watch('./js/**/*.js',['webpack']);
});

gulp.task('default',['webpack','connect','watch']);