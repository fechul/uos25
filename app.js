var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var index_routes = require('./routes/index.js');
var example = require('./core/example.js');

var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;
  
oracledb.getConnection({
     user: "uosconv",  
     password: "123123a!",  
     connectString: "uosconv.c1mptlep5hm6.ap-northeast-2.rds.amazonaws.com:1521/ORCL"  
}, function(err, oracleConnection) {  
     if (err) {
          console.error("oracledb connection err: ", err.message);  
          return;  
     }
     console.log("oracledb connected!");

     global.__oracleDB = oracleConnection;

     // test code
     example.example({}, function(result) {
     	console.log(result)
     });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routing
app.use('/', index_routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send('error');
});

module.exports = app;
