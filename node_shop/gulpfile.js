/**
 * Created by soraping on 2015/11/24.
 */
var gulp = require('gulp');

var sh = require('shelljs');

gulp.task('mongodb',function(){
    sh.exec("mongod --dbpath=e:\\server\\mongodb\\db");
});