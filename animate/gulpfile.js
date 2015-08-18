/**
 * Created by root on 15-8-17.
 */
var gulp = require('gulp');
var sh = require('shelljs');
var fs = require('fs');
var bower = require('bower');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

//使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        port: 5858,
        root: 'www',
        livereload: true
    });
});

//运行Gulp时，默认的Task
gulp.task('default', ['connect']);