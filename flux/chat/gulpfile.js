'use strict';
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var config = require('./webpack.config.js');
var connect = require('gulp-connect');
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
gulp.task('default',['webpack','connect']);