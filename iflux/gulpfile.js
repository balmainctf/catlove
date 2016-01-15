/**
 * Created by Administrator on 2015/9/18.
 */
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var connect = require('gulp-connect');
var config = require('./webpack.config');
var port = process.env.port || 5000;

gulp.task('webpack',function(){
    gulp.src('./js/app.js')
        .pipe(webpack(config))
        .pipe(gulp.dest('./build'))
});

gulp.task('watch',function(){
    gulp.watch('./js/*.js',['webpack']);
});

gulp.task('server',function(){
    connect.server({
        port: port,
        livereload: true
    })
});

gulp.task('default',['webpack','watch','server']);