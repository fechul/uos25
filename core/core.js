
// test code
exports.example = function(options, callback) {
	__oracleDB.execute("SELECT * FROM BRANCH", [], function(err, result) {  
	    if (err) {  
	       console.error(err.message);
	       // doRelease(connection);  
	       return;  
	    }  
	    callback(result.rows);
	    // doRelease(connection);  
	});
};

// 판매하기
exports.doSell = function(options, callback) {

};

// 판매취소하기
// exports.cancelSell = function(options, callback) {

// };

// 판매기록 가져오기
exports.getSellList = function(options, callback) {
	var POS_CD = options.POS_CD;

	var query = "SELECT * FROM SELL WHERE POS_CD='" + POS_CD + "'";
	var DATA = {};
	
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

	var query = "SELECT A.*, B.PRDT_NAME, C.EVENT_NAME FROM SOLD_PRODUCT A, PRODUCT B, EVENT C WHERE A.PRDT_CD = B.PRDT_CD AND A.EVENT_CD = C.EVENT_CD AND SELL_CD='" + SELL_CD + "'";
	var DATA = {};

	__oracleDB.execute(query, [], function(err, result) {  
	    if (err) {  
	       console.log("getSell err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 재고목록 가져오기
exports.getStockList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;

	var query = "SELECT A.*, B.*, C.CMPNY_NAME, D.EVENT_NAME FROM STOCK A, PRODUCT B, COMPANY C, EVENT D WHERE A.PRDT_CD = B.PRDT_CD AND B.CMPNY_CD = C.CMPNY_CD AND B.EVENT_CD = D.EVENT_CD AND A.BRCH_CD='" + BRCH_CD + "'";
	var DATA = {};

	__oracleDB.execute(query, [], function(err, result) {  
	    if (err) {  
	       console.log("getStockList err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 상품정보기 가져오기
exports.getProduct = function(options, callback) {
	var PRDT_CD = options.PRDT_CD;

	var query = "SELECT A.*, B.CMPNY_NAME, C.EVENT_NAME FROM PRODUCT A, COMPANY B, EVENT C WHERE A.CMPNY_CD = B.CMPNY_CD AND A.EVENT_CD = C.EVENT_CD AND A.PRDT_CD='" + PRDT_CD + "'";
	var DATA = {};

	__oracleDB.execute(query, [], function(err, result) {  
	    if (err) {  
	       console.log("getProduct err: ", err);
	       callback(null);
	    } else {
	    	callback(result.rows[0]);
	    }
	});
};

// 상품목록 가져오기
exports.getProductList = function(callback) {
	var query = "SELECT A.*, B.CMPNY_NAME, C.EVENT_NAME FROM PRODUCT A, COMPANY B, EVENT C WHERE A.CMPNY_CD = B.CMPNY_CD AND A.EVENT_CD = C.EVENT_CD";
	var DATA = {};

	__oracleDB.execute(query, [], function(err, result) {  
	    if (err) {  
	       console.log("getProductList err: ", err);
	       callback(null);
	    } else {
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 주문하기
exports.doOrder = function(options, callback) {
	
};

// 주문 취소하기
exports.cancelOrder = function(options, callback) {
	
};

// 주문정보 확인하기
exports.getOrder = function(options, callback) {
	var ORDER_CD = options.ORDER_CD;

	var query = "SELECT A.PRDT_CD AS PRDT_CD, B.PRDT_NAME AS PRDT_NAME, A.PRDT_CNT AS PRDT_CNT FROM ORDERED_PRODUCT A, PRODUCT B WHERE A.PRDT_CD = B.PRDT_CD AND A.ORDER_CD='" + ORDER_CD + "'";
	var DATA = {};

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
	var DATA = {};

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
	var DATA = {};

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
	var DATA = {};

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
exports.cancelRefund = function(options, callback) {

};

// 환불기록 가져오기
exports.getRefundList = function(options, callback) {
	var POS_CD = options.POS_CD;

	var query = "SELECT * FROM REFUND WHERE POS_CD='" + POS_CD + "'";
	var DATA = {};
	
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
exports.cancelReturn = function(options, callback) {
	
};

// 반품기록 가져오기
exports.getReturnList = function(options, callback) {
	var BRCH_CD = BRCH_CD;

	var query = "SELECT * FROM RETURN WHERE BRCH_CD='" + BRCH_CD + "'";
	var DATA = {};
	
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
	var DATA = {};
	
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
exports.cancelLoss = function(options, callback) {
	
};

// 손실목록 가져오기
exports.getLossList = function(options, callback) {
	var query = "SELECT * FROM LOSS";
	var DATA = {};

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
exports.cancelDiscard = function(options, callback) {

};

// 폐기목록 가져오기
exports.getDiscardList = function(options, callback) {

};

// 회원 등록하기
exports.addMember = function(options, callback) {
	
};

// 회원목록 가져오기
exports.getMemberList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var query = "SELECT PHONNO, POINT, JOIN_DATE FROM MEMBER WHERE BRCH_CD = " + BRCH_CD;
	var DATA ={};

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
	
};

// 마일리지 조회하기
exports.getPoint = function(options, callback) {
	var PHONNO = options.PHONNO;
	var PW = options.PW;
	var query = "SELECT POINT FROM MEMBER WHERE PHONNO = " + "'" + PHONNO + "'" + " AND PW = " + "'" + PW + "'";
	var DATA = {};
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
	
};

// 생활서비스 등록 해제하기
exports.deleteCvs = function(options, callback) {
	
};

// 전체 생활서비스 목록 가져오기
exports.getCvsList = function(options, callback) {

	var query = "SELECT * FROM CVS_TYPE";
	var DATA = {};

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
   				"WHERE C.CVS_CD = T.CVS_CD AND BRCH_CD = " + BRCH_CD;
	var DATA = {};
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

};

// 이벤트 정보 가져오기
exports.getEvent = function(options, callback) {
	var EVENT_CD = options.EVENT_CD;
	console.log(EVENT_CD);
	var query = "SELECT * FROM EVENT WHERE EVENT_CD = " + "'" + EVENT_CD + "'";
	var DATA = {};

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
	var DATA = {};

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
	var query = "SELECT * FROM BRANCH WHERE BRCH_CD = " + BRCH_CD;
	var DATA = {};

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
	
};

// 직원목록 가져오기
exports.getEmployeeList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var query = "SELECT * FROM EMPLOYEE WHERE BRCH_CD = " + BRCH_CD;
	var DATA = {};

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


