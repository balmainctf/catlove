var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index.js');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());


//app.use('/', routes);
//app.use('/users', users);


app.use(bodyParser.json({limit: '1mb'}));  //这里指定参数使用 json 格式
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

app.get('/',routes.index);

app.get('/add',routes.add);

app.post('/create',routes.create);

app.post('/del',routes.delById);
//
app.get('/modify/:id',routes.upd);
//
app.post('/update',routes.update);


// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});
//
//// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});


module.exports = app;
