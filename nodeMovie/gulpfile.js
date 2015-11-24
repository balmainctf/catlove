/**
 * Created by soraping on 15/11/24.
 */
var gulp = require('gulp');

//GULP搭建的前端服务器
var webserver = require('gulp-webserver');

//压缩JS文件
var uglify = require('gulp-uglify');

//合并Js文件
var concat = require('gulp-concat');

//配置文件
var config = require('./config.json');

//压缩CSS
var minifyCss = require('./gulp-minify-css');

//命令行操作
var sh = require('shelljs');

//重命名
rename = require('gulp-rename');


//压缩javascript 文件，压缩后文件放入build/js下
gulp.task('minifyjs',function(){
    gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./js/min'))
});

//合并build/js文件夹下的所有javascript 文件为一个main.js放入build/js下
gulp.task('alljs', function() {
    gulp.src('./build/js/*.js')
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('./js/min'));
});

gulp.task('run',function(){
    gulp.src('public/js/admin.js')
        .pipe(uglify())
        .pipe(rename('admin.min.js'))
        .pipe(gulp.dest('build/'))
    gulp.src('public/js/detail.js')
        .pipe(uglify())
        .pipe(rename('detail.min.js'))
        .pipe(gulp.dest('build/'))
});

//开启本地 Web 服务器功能
gulp.task('webserver', function() {
    gulp.src( './' )
        .pipe(webserver({
            host: config.localserver.host,
            port: config.localserver.port,
            livereload:       true,
            directoryListing: false
        }));
});

//上传到远程服务器任务
gulp.task('upload', function () {
    return gulp.src('./build/**')
        .pipe(sftp({
            host: config.sftp.host,
            user: config.sftp.user,
            port: config.sftp.port,
            key: config.sftp.key,
            remotePath: config.sftp.remotePath
        }));
});

//开启mongodb
gulp.task('openMongodb',function(){
    sh.exec('mongod --dbpath /Users/soraping/data/db');
});








