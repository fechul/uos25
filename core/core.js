
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
	LIST: [{
	    PRDT_CD: String,
	    PRDT_CNT: Number,
	    EVENT_APPLY: String,
	    EVENT_CD: String,
	    REG_PRICE: Number,
	    SELL_PRICE: Number
	}],
	AGE: String,
	SEX: String,
	TOTAL_SELL_PRICE: Number,
	PAYMENT_WAY: String,
	MEMBER_PHONNO: String,
	MEMBER_USE_POINT: Number,
	MEMBER_SAVE_POINT: Number
};

// 판매취소하기
// exports.cancelSell = function(options, callback) {

// };

// 판매기록 가져오기
exports.getSellList = function(options, callback) {
	var POS_CD = options.POS_CD;

	var query = "SELECT * FROM SELL WHERE POS_CD=" + POS_CD;
	var DATA = {};
	
	__oracleDB.execute(query, [], function(err, result) {  
	    if (err) {  
	       console.log("getSellList err: ", err);
	       callback(null);
	    } else {
	    	DATA.LIST = result.rows;
	    	callback(DATA);
	    }
	});	
};

// 판매정보 확인하기
exports.getSell = function(options, callback) {
	var SELL_CD = options.SELL_CD;

	var query = "SELECT * FROM SOLD_PRODUCT WHERE SELL_CD=" + SELL_CD;
	var DATA = {};

	__oracleDB.execute(query, [], function(err, result) {  
	    if (err) {  
	       console.log("getSell err: ", err);
	       callback(null);
	    } else {
	    	DATA.LIST = result.rows;
	    	callback(DATA);
	    }
	});	
};

// 재고목록 가져오
exports.getStockList = function(options, callback) {
	
};

// 상품정보기 가져오기
exports.getProduct = function(options, callback) {

};

// 상품목록 가져오기
exports.getProductList = function(options, callback) {
	
};

// 주문하기
exports.doOrder = function(options, callback) {
	
};

// 주문 취소하기
exports.cancelOrder = function(options, callback) {
	
};

// 주문정보 확인하기
exports.getOrder = function(options, callback) {
	
};

// 주문목록 가져오기
exports.getOrderList = function(options, callback) {

};

// 입고 확정하기
exports.doStore = function(options, callback) {
	
};

// 입고목록 가져오기
exports.getStoreList = function(options, callback) {
	
};

// 입고정보 확인하기
exports.getStore = function(options, callback) {
	
};

// 환불하기
exports.doRefund = function(options, callback) {
	
};

// 환불 취소하기
exports.cancelRefund = function(options, callback) {

};

// 환불기록 가져오기
exports.getRefundList = function(options, callback) {
	
};

// 반품하기
exports.doReturn = function(options, callback) {
	
};

// 반품 취소하기
exports.cancelReturn = function(options, callback) {
	
};

// 반품기록 가져오기
exports.getReturnList = function(options, callback) {
	
};

// 반품정보 확인하기
exports.getReturn = function(options, callback) {

};

// 손실 등록하기
exports.doLoss = function(options, callback) {
	
};

// 손실 취소하기
exports.cancelLoss = function(options, callback) {
	
};

// 손실목록 가져오기
exports.getLossList = function(options, callback) {
	
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
	
};

// 회원 삭제하기
exports.deleteMember = function(options, callback) {
	
};

// 마일리지 조회하기
exports.getPoint = function(options, callback) {

};

// 생활서비스 등록하
exports.addCvs = function(options, callback) {
	
};

// 생활서비스 등록 해제하기
exports.deleteCvs = function(options, callback) {
	
};

// 전체 생활서비스 목록 가져오기
exports.getCvsList = function(options, callback) {
	
};

// 지점의 생활서비스 목록 가져오기
exports.getCvsListBranch = function(options, callback) {
	
};

// 자금내역 가져오기
exports.getBranchMoney = function(options, callback) {

};

// 이벤트 정보 가져오기
exports.getEvent = function(options, callback) {
	
};

// 이벤트목록 가져오기
exports.getEventList = function(options, callback) {
	
};

// 지점 정보 가져오기
exports.getBranch = function(options, callback) {
	
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

};


