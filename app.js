var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var index_routes = require('./routes/index.js');

var core = require('./core/core.js');

var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;

var oracleRelease = function (connection) {
    connection.release(function(err) {
      	if (err) {
        	console.error(err.message);
      	}

      	console.log("oracle released!");
	});
};


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

 //     var query = "SELECT A.*, B.CMPNY_NAME FROM PRODUCT A, COMPANY B";
 //     __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log(result.rows)
	//     }
	// });

	// var query = "SELECT A.*, B.CMPNY_NAME, C.EVENT_NAME FROM PRODUCT A, COMPANY B, EVENT C WHERE A.CMPNY_CD = B.CMPNY_CD AND A.EVENT_CD = C.EVENT_CD";

	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("getProductList err: ", err);
	//     } else {
	//     	console.log(result.rows)
	//     }
	// });

     /*테스트*/
   //   core.getEmployeeList({
			// BRCH_CD: '000001'
		 // },
		 // function (data) {
   //       console.log(data);
   //   });
});

// process.stdin.resume();


process.on('SIGINT', function () {
  	oracleRelease(__oracleDB);
  	process.exit();

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

app.use(function(req, res, next) {
	if(req.session) {
		req.session.BRCH_CD = '000001';
		req.session.POS_CD = '00000101';
	} else {
		req.session = {};
		req.session.BRCH_CD = '000001';
		req.session.POS_CD = '00000101';
	}

	next();
});

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
