
var async = require('async');


// 판매하기
exports.doSell = function(options, callback) {
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth()+1;
	var day = today.getDate();

	if(month < 10) {
		month = '0' + month;
	}

	if(day < 10) {
		day = '0' + day;
	}

	var codeDate = year.toString() + month.toString() + day.toString();

	__oracleDB.execute("SELECT SELL_CD FROM SELL ORDER BY SELL_DATE DESC LIMIT 1", [], function(err, result) {
	    if (err) {
	       console.error(err.message);
	       callback(null);
	    } else {
	    	var SELL_CD = BRCH_CD + codeDate;
	    	if(result.rows && result.rows.length) {
	    		var recentSell = result.rows[0];
	    		var SEQ = recentSell.SELL_CD.substring(14, 20);
	    		SELL_CD += SEQ;
	    	} else {
	    		SELL_CD += '000001';
	    	}

	    	var sellCreateQuery = "INSERT INTO SELL VALUES ('" + SELL_CD + "', '" + options.POS_CD + "', )";
	    	// __oracleDB.execute("INSERT INTO SELL", [], function(err, result) {


	    	callback(null);
	    }
	});	
	

	// LIST: [{
	//     PRDT_CD: String,
	//     PRDT_CNT: Number,
	//     EVENT_APPLY: String,
	//     EVENT_CD: String,
	//     REG_PRICE: Number,
	//     SELL_PRICE: Number
	// }],

	// SELL_CD ~~
	// POS_CD 
	// AGE: String,
	// SEX: String,
	// TOTAL_SELL_PRICE: Number,
	// PAYMENT_WAY: String,
	// MEMBER_USE_PHONNO: String,
	// MEMBER_SAVE_PHONNO: String,
	// MEMBER_USE_POINT: Number,
	// MEMBER_SAVE_POINT: Number
};

// 판매취소하기
// exports.cancelSell = function(options, callback) {

// };

// 판매기록 가져오기
exports.getSellList = function(options, callback) {
	var POS_CD = options.POS_CD;

	var query = "SELECT * FROM SELL WHERE POS_CD='" + POS_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getSellList err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 판매정보 확인하기
exports.getSoldProduct = function(options, callback) {
	var SELL_CD = options.SELL_CD;

	var query = "SELECT A.*, B.PRDT_NAME, FROM SOLD_PRODUCT A, PRODUCT B WHERE A.PRDT_CD = B.PRDT_CD AND A.SELL_CD='" + SELL_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getSell err: ", err);
	       callback(null);
	    } else {
	    	if(result.rows && result.rows.length) {
	    		async.mapSeries(result.rows, function(sold, async_cb) {
	    			if(!sold.EVENT_CD) {
	    				sold.EVENT_NAME = null;
	    				async_cb();
	    			} else {
		    			__oracleDB.execute("SELECT EVENT_NAME FROM EVENT WHERE EVENT_CD='" + sold.EVENT_CD + "'", [], function(_err, _result) {
		    				sold.EVENT_NAME = _result.rows[0].EVENT_NAME;
		    				async_cb();
		    			});
		    		}
	    		}, function(async_err) {
	    			callback({
			    		LIST: result.rows
			    	});
	    		});
	    	} else {
	    		callback({
		    		LIST: []
		    	});
	    	}
	    }
	});
};

// 재고목록 가져오기
exports.getStockList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;

	var query = "SELECT A.*, B.*, C.CMPNY_NAME FROM STOCK A, PRODUCT B, COMPANY C WHERE A.PRDT_CD = B.PRDT_CD AND B.CMPNY_CD = C.CMPNY_CD AND A.BRCH_CD='" + BRCH_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getStockList err: ", err);
	       callback(null);
	    } else {
	    	if(result.rows && result.rows.length) {
	    		async.mapSeries(result.rows, function(stock, async_cb) {
	    			if(!stock.EVENT_CD) {
	    				stock.EVENT_NAME = null;
	    				async_cb();
	    			} else {
		    			__oracleDB.execute("SELECT EVENT_NAME FROM EVENT WHERE EVENT_CD='" + stock.EVENT_CD + "'", [], function(_err, _result) {
		    				stock.EVENT_NAME = _result.rows[0].EVENT_NAME;
		    				async_cb();
		    			});
		    		}
	    		}, function(async_err) {
	    			callback({
			    		LIST: result.rows
			    	});
	    		});
	    	} else {
	    		callback({
		    		LIST: []
		    	});
	    	}
	    }
	});
};

// 상품정보기 가져오기
exports.getProduct = function(options, callback) {
	var PRDT_CD = options.PRDT_CD;

	var query = "SELECT A.*, B.CMPNY_NAME, C.STOCK_CNT FROM PRODUCT A, COMPANY B, STOCK C WHERE A.CMPNY_CD = B.CMPNY_CD AND A.PRDT_CD = C.PRDT_CD AND A.PRDT_CD='" + PRDT_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getProduct err: ", err);
	       callback(null);
	    } else {
	    	if(result.rows && result.rows.length) {
	    		var product = result.rows[0];
    			if(!product.EVENT_CD) {
    				product.EVENT_NAME = null;
    				callback(product);
    			} else {
	    			__oracleDB.execute("SELECT EVENT_NAME FROM EVENT WHERE EVENT_CD='" + product.EVENT_CD + "'", [], function(_err, _result) {
	    				product.EVENT_NAME = _result.rows[0].EVENT_NAME;
	    				callback(product);
	    			});
	    		}
	    	} else {
	    		callback(null);
	    	}
	    }
	});
};

// 상품목록 가져오기
exports.getProductList = function(callback) {
	var query = "SELECT A.*, B.CMPNY_NAME FROM PRODUCT A, COMPANY B WHERE A.CMPNY_CD = B.CMPNY_CD";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getProductList err: ", err);
	       callback(null);
	    } else {
	    	if(result.rows && result.rows.length) {
	    		async.mapSeries(result.rows, function(product, async_cb) {
	    			if(!product.EVENT_CD) {
	    				product.EVENT_NAME = null;
	    				async_cb();
	    			} else {
		    			__oracleDB.execute("SELECT EVENT_NAME FROM EVENT WHERE EVENT_CD='" + product.EVENT_CD + "'", [], function(_err, _result) {
		    				product.EVENT_NAME = _result.rows[0].EVENT_NAME;
		    				async_cb();
		    			});
		    		}
	    		}, function(async_err) {
	    			callback({
			    		LIST: result.rows
			    	});
	    		});
	    	} else {
	    		callback({
		    		LIST: []
		    	});
	    	}
	    }
	});
};

// 주문하기
exports.doOrder = function(options, callback) {

};

// 주문 취소하기
exports.cancelOrder = function(options, callback) {
	var ORDER_CD = options.ORDER_CD;

	var query = "DELETE FROM PRODUCT_ORDER WHERE ORDER_CD='" + ORDER_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("cancelOrder err: ", err);
	       callback(null);
	    } else {
	    	var _query = "DELETE FROM ORDERED_PRODUCT WHERE ORDER_CD='" + ORDER_CD + "'";
	    	__oracleDB.execute(_query, [], function(_err, _result) {
			    if (_err) {
			       console.log("cancelOrder2 err: ", _err);
			       callback(null);
			    } else {
			    	callback(true);
			    }
			});
	    }
	});
};

// 주문정보 확인하기
exports.getOrder = function(options, callback) {
	var ORDER_CD = options.ORDER_CD;

	var query = "SELECT A.PRDT_CD AS PRDT_CD, B.PRDT_NAME AS PRDT_NAME, A.PRDT_CNT AS PRDT_CNT FROM ORDERED_PRODUCT A, PRODUCT B WHERE A.PRDT_CD = B.PRDT_CD AND A.ORDER_CD='" + ORDER_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getOrder err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 주문목록 가져오기
exports.getOrderList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;

	var query = "SELECT * FROM PRODUCT_ORDER WHERE BRCH_CD='" + BRCH_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getOrderList err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 입고 확정하기
exports.doStore = function(options, callback) {

};

// 입고목록 가져오기
exports.getStoreList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;

	var query = "SELECT * FROM STORE WHERE BRCH_CD='" + BRCH_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getStoreList err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 입고정보 확인하기
exports.getStore = function(options, callback) {
	var STORE_CD = options.STORE_CD;

	var query = "SELECT A.*, B.CMPNY_NAME, C.PRDT_NAME FROM STORED_PRODUCT A, COMPANY B, PRODUCT C WHERE A.CMPNY_CD = B.CMPNY_CD AND A.PRDT_CD = C.PRDT_CD AND A.STORE_CD = '" + STORE_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getStore err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 환불하기
exports.doRefund = function(options, callback) {

};

// 환불 취소하기
// exports.cancelRefund = function(options, callback) {
// 	var REFUND_CD = options.REFUND_CD;

// 	var query = "DELETE FROM REFUND WHERE REFUND_CD='" + REFUND_CD + "'";

// 	__oracleDB.execute(query, [], function(err, result) {
// 	    if (err) {
// 	       console.log("cancelRefund err: ", err);
// 	       callback(null);
// 	    } else {
// 	    	callback(true);
// 	    }
// 	});
// };

// 환불기록 가져오기
exports.getRefundList = function(options, callback) {
	var POS_CD = options.POS_CD;

	var query = "SELECT * FROM REFUND WHERE POS_CD='" + POS_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getRefundList err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 반품하기
exports.doReturn = function(options, callback) {

};

// 반품 취소하기
// exports.cancelReturn = function(options, callback) {
// 	var RET_CD = options.RET_CD;

// 	var query = "DELETE FROM RETURN WHERE RET_CD='" + RET_CD + "'";

// 	__oracleDB.execute(query, [], function(err, result) {
// 	    if (err) {
// 	       console.log("cancelReturn err: ", err);
// 	       callback(null);
// 	    } else {
// 	    	var _query = "DELETE FROM RETURNED_PRODUCT WHERE RET_CD='" + RET_CD + "'";
// 	    	__oracleDB.execute(_query, [], function(_err, _result) {
// 			    if (_err) {
// 			       console.log("cancelReturn2 err: ", _err);
// 			       callback(null);
// 			    } else {
// 			    	callback(true);
// 			    }
// 			});
// 	    }
// 	});
// };

// 반품기록 가져오기
exports.getReturnList = function(options, callback) {
	var BRCH_CD = BRCH_CD;

	var query = "SELECT * FROM RETURN WHERE BRCH_CD='" + BRCH_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getReturnList err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 반품정보 확인하기
exports.getReturn = function(options, callback) {
	var RET_CD = options.RET_CD;

	var query = "SELECT A.*, B.PRDT_NAME FROM RETURNED_PRODUCT A, PRODUCT B WHERE A.PRDT_CD = B.PRDT_CD AND A.RET_CD='" + RET_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
	    if (err) {
	       console.log("getReturn err: ", err);
	       callback(null);
	    } else {
	    	callback(result.rows[0]);
	    }
	});
};

// 손실 등록하기
exports.doLoss = function(options, callback) {

};

// 손실 취소하기
// exports.cancelLoss = function(options, callback) {

// };

// 손실목록 가져오기
exports.getLossList = function(options, callback) {
	var query = "SELECT * FROM LOSS";

    __oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getLossList err: ", err);
            callback(null);
        } else {
            callback({
	    		LIST: result.rows
	    	});
        }
    });
};

// 폐기하기
exports.doDiscard = function(options, callback) {

};

// 폐기 취소하기
// exports.cancelDiscard = function(options, callback) {

// };

// 폐기목록 가져오기
exports.getDiscardList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;

	var query = "SELECT * FROM DISCARD WHERE BRCH_CD='" + BRCH_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getDiscardList err: ", err);
            callback(null);
        } else {
            callback({
	    		LIST: result.rows
	    	});
        }
    });
};

// 회원 등록하기
exports.addMember = function(options, callback) {

};

// 회원목록 가져오기
exports.getMemberList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var query = "SELECT PHONNO, POINT, JOIN_DATE FROM MEMBER WHERE BRCH_CD = '" + BRCH_CD + "'";

    __oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getMemberList err: ", err);
            callback(null);
        } else {
            callback({
	    		LIST: result.rows
	    	});
        }
    });
};

// 회원 삭제하기
exports.deleteMember = function(options, callback) {
	var PHONNO = options.PHONNO;
	var query = "DELETE FROM MEMBER WHERE PHONNO='" + PHONNO + "'";

	__oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("delteMember err: ", err);
            callback(null);
        } else {
            callback(true);
        }
    });
};

// 마일리지 조회하기
exports.getPoint = function(options, callback) {
	var PHONNO = options.PHONNO;
	var PW = options.PW;
	var query = "SELECT POINT FROM MEMBER WHERE PHONNO = " + "'" + PHONNO + "'" + " AND PW = " + "'" + PW + "'";
    __oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getPoint err: ", err);
            callback(null);
        } else {
            callback(result.rows[0]);
        }
    });
};

// 생활서비스 등록하기
exports.addCvs = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var CVS_CD = options.CVS_CD;

	var query = "INSERT INTO CVS VALUES ('" + BRCH_CD + "', '" + CVS_CD + "')";

	__oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("addCvs err: ", err);
            callback(null);
        } else {
            callback(true);
        }
    });
};

// 생활서비스 등록 해제하기
exports.deleteCvs = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var CVS_CD = options.CVS_CD;

	var query = "DELETE FROM CVS WHERE BRCH_CD='" + BRCH_CD + "' AND CVS_CD='" + CVS_CD + "'";
	__oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("deleteCvs err: ", err);
            callback(null);
        } else {
            callback(true);
        }
    });
};

// 전체 생활서비스 목록 가져오기
exports.getCvsList = function(options, callback) {

	var query = "SELECT * FROM CVS_TYPE";

    __oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getCvsList err: ", err);
            callback(null);
        } else {
            callback({
	    		LIST: result.rows
	    	});
        }
    });
};

// 지점의 생활서비스 목록 가져오기
exports.getCvsListBranch = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var query = "SELECT T.CVS_CD, PRVD_CMPNY, CVS_NAME, DESCR " +
				"FROM CVS_TYPE T, CVS C " +
   				"WHERE C.CVS_CD = T.CVS_CD AND BRCH_CD = '" + BRCH_CD + "'";
    __oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getCvsListBranch err: ", err);
            callback(null);
        } else {
            callback({
	    		LIST: result.rows
	    	});
        }
    });
};

// 자금내역 가져오기
exports.getBranchMoney = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var IO_TYPE = options.IO_TYPE;

	var query = "SELECT * FROM MONEY_HISTORY WHERE BRCH_CD='" + BRCH_CD + "' AND IO_TYPE='" + IO_TYPE + "'";

	__oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getBranchMoney err: ", err);
            callback(null);
        } else {
            callback({
	    		LIST: result.rows
	    	});
        }
    });
};

// 이벤트 정보 가져오기
exports.getEvent = function(options, callback) {
	var EVENT_CD = options.EVENT_CD;
	console.log(EVENT_CD);
	var query = "SELECT * FROM EVENT WHERE EVENT_CD = " + "'" + EVENT_CD + "'";

    __oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getEvent err: ", err);
            callback(null);
        } else {
            callback(result.rows[0]);
        }
    });
};

// 이벤트목록 가져오기
exports.getEventList = function(options, callback) {
	var query = "SELECT * FROM EVENT";

    __oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getEventList err: ", err);
            callback(null);
        } else {
            callback({
	    		LIST: result.rows
	    	});
        }
    });
};

// 지점 정보 가져오기
exports.getBranch = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var query = "SELECT * FROM BRANCH WHERE BRCH_CD = '" + BRCH_CD + "'";

    __oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getBranch err: ", err);
            callback(null);
        } else {
            callback(result.rows[0]);
        }
    });
};

// 마진 지불하기
exports.payMargin = function(options, callback) {

};

// 직원 등록하기
exports.addEmployee = function(options, callback) {

};

// 직원 삭제하기
exports.deleteEmployee = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var EMP_CD = options.EMP_CD;

	var query = "DELETE FROM EMPLOYEE WHERE BRCH_CD = '" + BRCH_CD + "' AND EMP_CD = '" + EMP_CD + "'";

	__oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("deleteEmployee err: ", err);
            callback(null);
        } else {
            callback(true);
        }
    });
};

// 직원목록 가져오기
exports.getEmployeeList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var query = "SELECT * FROM EMPLOYEE WHERE BRCH_CD = '" + BRCH_CD + "'";

    __oracleDB.execute(query, [], function(err, result) {
        if (err) {
            console.log("getEmployeeList err: ", err);
            callback(null);
        } else {
            callback({
	    		LIST: result.rows
	    	});
        }
    });
};
