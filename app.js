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

var async = require('async');

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

 //     var query = "SELECT PRDT_CD FROM PRODUCT";
 //     __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	var BRCH_CD = '000001';
	//     	async.mapSeries(result.rows, function(product, async_cb) {
	//     		var _query = "INSERT INTO STOCK VALUES (To_number(100), '" + product.PRDT_CD + "', '" + BRCH_CD +"')";

	//     		__oracleDB.execute(_query, [], function(err, _result) {  
	// 			    if (err) {  
	// 			       console.log("err: ", err);
	// 			    } else {
	// 			    	console.log("!!!!: ",_result);
	// 			    }
	// 			    async_cb();
	// 			});
	//     	}, function(async_err) {
	//     		console.log("done!!");
	//     	});
	//     }
	// });

	// var query = "SELECT EMP_CD FROM (SELECT EMP_CD FROM EMPLOYEE ORDER BY HIRED_DATE DESC) WHERE ROWNUM=1";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log(result.rows)
	//     }
	// });


	/*var query = "SELECT A.*, B.CMPNY_NAME, C.EVENT_NAME FROM PRODUCT A, COMPANY B, EVENT C WHERE A.CMPNY_CD = B.CMPNY_CD AND A.EVENT_CD = C.EVENT_CD";

	__oracleDB.execute(query, [], function(err, result) {  
	    if (err) {  
	       console.log("getProductList err: ", err);
	    } else {
	    	console.log(result.rows)
	    }
	});*/

	// var query = 'INSERT INTO EMPLOYEE VALUES ("00000120170609000004", "철철박사", "01000000000", "사원", 25, 25, "20170613", "000001")';
	// var query = "INSERT INTO EMPLOYEE VALUES ('00000120170609000004', '철철박사', '01000000000', '사원', 25, 25, TO_DATE('20170613182732','YYYYMMDDHH24MISS'), '000001')";


	// __oracleDB.execute(query, [], {autoCommit:true}, function(err, result) {  
	//     if (err) {  
	//        console.log("test err: ", err);
	//     } else {
	//     	console.log(result)
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

//      core.getPoint({
// 			PHONNO: '01092919986',
// 		 	PW: '8520'
// 		 },
// 		 function (data) {
//
//          console.log(data ? true : false);
//          console.log("dd" , data ? null : 1, typeof data ? undefined :2);
//          console.log(data);
//      });

   //   core.getEmployeeList({
			// BRCH_CD: '000001'
		 // },
		 // function (data) {
   //       console.log(data);
   //   });

    // var query = "SELECT * FROM SELL";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("판매기록: ",result.rows)
	//     }
	// });

	// var query = "SELECT * FROM SOLD_PRODUCT";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("판매상품들: ",result.rows)
	//     }
	// });

	// var query = "SELECT * FROM MONEY_HISTORY";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("자금내역: ",result.rows)
	//     }
	// });

	// var query = "SELECT MNY FROM BRANCH";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("지점의 자금: ",result.rows)
	//     }
	// });

	// var query = "SELECT * FROM MEMBER";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("회원: ",result.rows)
	//     }
	// });

	// var query = "SELECT * FROM POS";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("포스: ",result.rows)
	//     }
	// });


	// var query = "SELECT * FROM STOCK";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("포스: ",result.rows)
	//     }
	// });

	// var query = "SELECT * FROM PRODUCT_ORDER";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("주문: ",result.rows)
	//     }
	// });

	// var query = "SELECT * FROM STORE";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("입고: ",result.rows)
	//     }
	// });

	// var query = "SELECT * FROM ORDERED_PRODUCT";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("주문한상품: ",result.rows)
	//     }
	// });

	// var query = "SELECT * FROM STORED_PRODUCT";
	// __oracleDB.execute(query, [], function(err, result) {  
	//     if (err) {  
	//        console.log("err: ", err);
	//     } else {
	//     	console.log("입고한상품: ",result.rows)
	//     }
	// });
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
