
var async = require('async');

var getDateFormat = function() {
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth()+1;
	var day = today.getDate();
	// var hour = today.getHours();
	// var minute = today.getMinutes();
	// var second = today.getSeconds();

	if(month < 10) {
		month = '0' + month;
	}

	if(day < 10) {
		day = '0' + day;
	}

	// if(hour < 10) {
	// 	hour = '0' + hour;
	// }

	// if(minute < 10) {
	// 	minute = '0' + minute;
	// }

	// if(second < 10) {
	// 	second = '0' + second;
	// }

	year = year.toString();
	month = month.toString();
	day = day.toString();
	// hour = hour.toString();
	// minute = minute.toString();
	// second = second.toString();

	return year + month + day;
};

var getTimeFormat = function() {
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth()+1;
	var day = today.getDate();
	var hour = today.getHours();
	var minute = today.getMinutes();
	var second = today.getSeconds();

	if(month < 10) {
		month = '0' + month;
	}

	if(day < 10) {
		day = '0' + day;
	}

	if(hour < 10) {
		hour = '0' + hour;
	}

	if(minute < 10) {
		minute = '0' + minute;
	}

	if(second < 10) {
		second = '0' + second;
	}

	year = year.toString();
	month = month.toString();
	day = day.toString();
	hour = hour.toString();
	minute = minute.toString();
	second = second.toString();

	return year + month + day + hour + minute + second;
};

var getNextSeq = function(recentSeq) {
	recentSeq = parseInt(recentSeq);
	var nextSeq = recentSeq + 1;
	nextSeq = nextSeq.toString();

	if(nextSeq.length == 1) {
		nextSeq = '00000' + nextSeq;
	} else if(nextSeq.length == 2) {
		nextSeq = '0000' + nextSeq;
	} else if(nextSeq.length == 3) {
		nextSeq = '000' + nextSeq;
	} else if(nextSeq.length == 4) {
		nextSeq = '00' + nextSeq;
	} else if(nextSeq.length == 5) {
		nextSeq = '0' + nextSeq;
	}

	return nextSeq;
};

// 판매하기
exports.doSell = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var POS_CD = options.POS_CD;
	var dateFormat = getDateFormat();
	var timeFormat = getTimeFormat();

	var LIST = options.LIST;
	var AGE = options.AGE;
	var SEX = options.SEX;
	var TOTAL_SELL_PRICE = options.TOTAL_SELL_PRICE;
	var PAYMENT_WAY = options.PAYMENT_WAY;
	var MEMBER_PHONNO = options.MEMBER_PHONNO;
	var MEMBER_USE_POINT = options.MEMBER_USE_POINT;
	var MEMBER_SAVE_POINT = options.MEMBER_SAVE_POINT;

	// CODE
	var SELL_CD = BRCH_CD + dateFormat;
	var MNY_HIS_CD = BRCH_CD + dateFormat;

	async.waterfall([
		// make SELL_CD
	    function(callback){
	    	var query = "SELECT SELL_CD FROM (SELECT SELL_CD FROM SELL ORDER BY SELL_DATE DESC) WHERE ROWNUM=1";
	    	__oracleDB.execute(query, [], function(err, result) {
	    		if (err) {
			       callback("make SELL_CD err: " + err);
			    } else {
			    	if(result.rows && result.rows.length) {
			    		var recentSell = result.rows[0];
			    		var SELL_SEQ = getNextSeq(recentSell.SELL_CD.substring(14, 20));
			    		SELL_CD += SELL_SEQ;
			    	} else {
			    		SELL_CD += '000001';
			    	}
			    	callback(null);
			    }
	    	});
	    },
	    // insert SELL
	    function(callback){
	    	var sellInsertQuery = "INSERT INTO SELL " +
	    		"VALUES ('" + SELL_CD + "', TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), " + TOTAL_SELL_PRICE + ", '" + PAYMENT_WAY + "', '" + POS_CD + "', '" + AGE + "', '" + SEX + "'";
    		if(MEMBER_PHONNO) {
    			sellInsertQuery += ", '" + MEMBER_PHONNO + "'";
    		} else {
    			sellInsertQuery += ", null";
    		}
    		if(MEMBER_USE_POINT) {
    			sellInsertQuery += ", " + MEMBER_USE_POINT;
    		} else {
    			sellInsertQuery += ", null";
    		}
    		if(MEMBER_SAVE_POINT) {
    			sellInsertQuery += ", " + MEMBER_SAVE_POINT;
    		} else {
    			sellInsertQuery += ", null";
    		}
    		sellInsertQuery += ")";
	    	__oracleDB.execute(sellInsertQuery, [], {autoCommit:true}, function(err, result) {
	    		if(err) {
	    			callback("insert SELL err: " + err);
	    		} else {
	    			callback(null);
	    		}
	    	});
	    },
	    // make MNY_HIS_CD
	    function(callback){
	    	__oracleDB.execute("SELECT MNY_HIS_CD FROM (SELECT MNY_HIS_CD FROM MONEY_HISTORY ORDER BY HISTORY_DATE DESC) WHERE ROWNUM=1", [], function(err, result) {
	    		if(err) {
	    			callback("make MNY_HIS_CD err: " + err);
	    		} else {
					if(result.rows && result.rows.length) {
			    		var recentHistory = result.rows[0];
			    		var MNY_HIS_SEQ = getNextSeq(recentHistory.MNY_HIS_CD.substring(14, 20));
			    		MNY_HIS_CD += MNY_HIS_SEQ;
			    	} else {
			    		MNY_HIS_CD += '000001';
			    	}
			    	callback(null);
			    }
		    });
	    },
	    // insert MONEY_HISTORY
	    function(callback) {
	    	var insertMnyHistoryQuery = "INSERT INTO MONEY_HISTORY VALUES('" + MNY_HIS_CD + "', 'I', " + TOTAL_SELL_PRICE + ", TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + BRCH_CD + "')";
	    	__oracleDB.execute(insertMnyHistoryQuery, [], {autoCommit:true}, function(err, result) {
	    		if(err) {
	    			callback("insert MONEY_HISTORY err: " + err);
	    		} else {
	    			callback(null);
	    		}
	    	});
	    },
	    // update Branch Money
	    function(callback) {
	    	var updateBrchMnyQuery = "UPDATE BRANCH SET MNY=MNY+" + TOTAL_SELL_PRICE + " WHERE BRCH_CD='" + BRCH_CD + "'";
	    	__oracleDB.execute(updateBrchMnyQuery, [], {autoCommit:true}, function(err, result) {
	    		if(err) {
	    			callback("update Branch Money err: " + err);
	    		} else {
	    			callback(null);
	    		}
	    	});
	    },
	    // update POS Cash
	    function(callback) {
	    	if(PAYMENT_WAY == 'CASH') {
				var updatePosQuery = "UPDATE POS SET POSSESS_CASH=POSSESS_CASH+" + TOTAL_SELL_PRICE + " WHERE POS_CD='" + POS_CD + "'";
				__oracleDB.execute(updatePosQuery, [], {autoCommit:true}, function(err, result) {
					if(err) {
						callback("update POS Cash err: " + err);
					} else {
						callback(null);
					}
				});
			} else {
				callback(null);
			}
	    },
	    // insert SELL_LIST / update STOCK
	    function(callback) {
	    	async.map(LIST, function(eachSell, async_cb) {
	    		var insertSoldPdtQuery = "INSERT INTO SOLD_PRODUCT VALUES(";
	    		if(eachSell.EVENT_APPLY == 'y') {
	    			insertSoldPdtQuery += "'y', ";
	    		} else {
	    			insertSoldPdtQuery += "'n', ";
	    		}
	    		insertSoldPdtQuery += eachSell.PRDT_CNT + ", ";
	    		insertSoldPdtQuery += eachSell.REG_PRICE + ", ";
	    		insertSoldPdtQuery += eachSell.SELL_PRICE + ", ";
	    		insertSoldPdtQuery += "'" + SELL_CD + "', ";
	    		if(eachSell.EVENT_CD) {
	    			insertSoldPdtQuery += "'" + eachSell.EVENT_CD + "', ";
	    		} else {
	    			insertSoldPdtQuery += "null, ";
	    		}
	    		insertSoldPdtQuery += "'" + eachSell.PRDT_CD + "'";
	    		insertSoldPdtQuery += ")";

				__oracleDB.execute(insertSoldPdtQuery, [], {autoCommit:true}, function(err, result) {
					var query = "UPDATE STOCK SET STOCK_CNT=STOCK_CNT-" + eachSell.PRDT_CNT + " WHERE BRCH_CD='" + BRCH_CD + "' AND PRDT_CD='" + eachSell.PRDT_CD + "'";
					__oracleDB.execute(query, [], {autoCommit:true}, function(err, result) {
						async_cb();
					});
				});
			}, function(async_err) {
				callback(null);
			});
	    },
	    // update USE POINT
	    function(callback) {
	    	if(MEMBER_PHONNO && MEMBER_USE_POINT) {
	    		var updateUsePointQuery = "UPDATE MEMBER SET POINT=POINT-" + MEMBER_USE_POINT + " WHERE PHONNO='" + MEMBER_PHONNO + "'";
	    		__oracleDB.execute(updateUsePointQuery, [], {autoCommit:true}, function(err, result) {
					if(err) {
						callback("update use point err: " + err);
					} else {
						callback(null);
					}
				});
	    	} else {
	    		callback(null);
	    	}
	    },
	    // update SAVE POINT
	    function(callback) {
	    	if(MEMBER_PHONNO && MEMBER_SAVE_POINT) {
	    		var updateSavePointQuery = "UPDATE MEMBER SET POINT=POINT+" + MEMBER_SAVE_POINT + " WHERE PHONNO='" + MEMBER_PHONNO + "'";
	    		__oracleDB.execute(updateSavePointQuery, [], {autoCommit:true}, function(err, result) {
					if(err) {
						callback("update save point err: " + err);
					} else {
						callback(null);
					}
				});
	    	} else {
	    		callback(null);
	    	}
	    }
	], function (err, result) {
	    if(err) {
	    	console.log(err);
	   		callback(null);
	    } else {
	   		callback(true);
	    }
	});
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

	var query = "SELECT A.*, B.PRDT_NAME FROM SOLD_PRODUCT A, PRODUCT B WHERE A.PRDT_CD = B.PRDT_CD AND A.SELL_CD='" + SELL_CD + "'";

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
	var BRCH_CD = options.BRCH_CD;
	var LIST = options.LIST;
	var TOTAL_ORDER_PRICE = options.TOTAL_ORDER_PRICE;

	var orderDateFormat = getDateFormat();
	var timeFormat = getTimeFormat();
	var ORDER_CD = BRCH_CD + orderDateFormat;

	var addStore = function() {
		__oracleDB.execute("SELECT STORE_CD FROM (SELECT STORE_CD FROM STORE ORDER BY STORE_DATE DESC) WHERE ROWNUM=1", [], function(err, result) {
			if (err) {
		       console.error(err.message);
		       callback(null);
		    } else {
		    	var storeDateFormat = getDateFormat();
		    	var STORE_CD = BRCH_CD + storeDateFormat;
		    	if(result.rows && result.rows.length) {
		    		var recentStore = result.rows[0];
		    		var SEQ = getNextSeq(recentStore.STORE_CD.substring(14, 20));
		    		STORE_CD += SEQ;
		    	} else {
		    		STORE_CD += '000001';
		    	}

		    	var storeCreateQuery = "INSERT INTO STORE VALUES ('" + STORE_CD + "', TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + ORDER_CD + "')";
		    	__oracleDB.execute(storeCreateQuery, [], {autoCommit:true}, function(err, result) {
		    		if(err) {
		    			console.log('doOrder store push err: ', err);
		    			callback(null);
		    		} else {
		    			async.map(LIST, function(eachOrder, async_cb) {
							__oracleDB.execute("SELECT CMPNY_CD FROM PRODUCT WHERE PRDT_CD='" + eachOrder.PRDT_CD + "'", [], function(_err, _result) {
								var CMPNY_CD = _result.rows[0].CMPNY_CD;

								var storeListCreateQuery = "INSERT INTO STORED_PRODUCT VALUES (" + eachOrder.PRDT_CNT + ", '" + STORE_CD + "', '" + CMPNY_CD + "', '" + eachOrder.PRDT_CD + "')";
								__oracleDB.execute(storeListCreateQuery, [], {autoCommit:true}, function(__err, __result) {
						    		if(__err) {
						    			console.log('doOrder store list push err: ', __err);
						    			async_cb();
						    		} else {
						    			var updateReceiveCheckQuery = "UPDATE ORDERED_PRODUCT SET RECEIVE_CHECK='y' WHERE ORDER_CD='" + ORDER_CD + "' AND PRDT_CD='" + eachOrder.PRDT_CD + "'";
										__oracleDB.execute(updateReceiveCheckQuery, [], {autoCommit:true}, function(___err, ___result) {
											if(___err) {
												console.log('doOrder update order check err: ', ___err);
												async_cb();
											} else {
												var updateStockCntQuery = "UPDATE STOCK SET STOCK_CNT=STOCK_CNT+" + eachOrder.PRDT_CNT + " WHERE BRCH_CD='" + BRCH_CD + "' AND PRDT_CD='" + eachOrder.PRDT_CD + "'";
								    			__oracleDB.execute(updateStockCntQuery, [], {autoCommit:true}, function(____err, ____result) {
								    				if(____err) {
								    					console.log("doStore update stock cnt err: ", ____err);
								    				}
								    				async_cb();
								    			});
											}
										});
						    		}
						    	});
							});
						}, function(async_err) {
							callback(true);
						});
		    		}
		    	});
		    }
		});
	};

	if(LIST && LIST.length) {
		__oracleDB.execute("SELECT ORDER_CD FROM (SELECT ORDER_CD FROM PRODUCT_ORDER ORDER BY ORDER_DATE DESC) WHERE ROWNUM=1", [], function(err, result) {
			if (err) {
		       console.error(err.message);
		       callback(null);
		    } else {
		    	if(result.rows && result.rows.length) {
		    		var recentOrder = result.rows[0];
		    		var SEQ = getNextSeq(recentOrder.ORDER_CD.substring(14, 20));
		    		ORDER_CD += SEQ;
		    	} else {
		    		ORDER_CD += '000001';
		    	}

		    	var orderCreateQuery = "INSERT INTO PRODUCT_ORDER VALUES ('" + ORDER_CD + "', " + TOTAL_ORDER_PRICE + ", TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + BRCH_CD + "')";
		    	__oracleDB.execute(orderCreateQuery, [], {autoCommit:true}, function(err, result) {
		    		if(err) {
		    			console.log('doOrder order push err: ', err);
		    			callback(null);
		    		} else {
		    			async.map(LIST, function(eachOrder, async_cb) {
							var orderListCreateQuery = "INSERT INTO ORDERED_PRODUCT VALUES (" + eachOrder.PRDT_CNT + ", '" + ORDER_CD + "', '" + eachOrder.PRDT_CD + "', 'n')";
							__oracleDB.execute(orderListCreateQuery, [], {autoCommit:true}, function(__err, __result) {
					    		if(__err) {
					    			console.log('doOrder order list push err: ', __err);
					    			async_cb();
					    		} else {
					    			async_cb();
					    		}
					    	});
						}, function(async_err) {
							addStore();
						});
		    		}
		    	});
		    }
		});
	} else {
		callback(true);
	}
};

// 주문 취소하기
exports.cancelOrder = function(options, callback) {
	var ORDER_CD = options.ORDER_CD;

	var query = "DELETE FROM PRODUCT_ORDER WHERE ORDER_CD='" + ORDER_CD + "'";

	__oracleDB.execute(query, [], {autoCommit:true}, function(err, result) {
	    if (err) {
	       console.log("cancelOrder err: ", err);
	       callback(null);
	    } else {
	    	var _query = "DELETE FROM ORDERED_PRODUCT WHERE ORDER_CD='" + ORDER_CD + "'";
	    	__oracleDB.execute(_query, [], {autoCommit:true}, function(_err, _result) {
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

	var query = "SELECT A.PRDT_CD AS PRDT_CD, B.PRDT_NAME AS PRDT_NAME, A.PRDT_CNT AS PRDT_CNT, A.RECEIVE_CHECK AS RECEIVE_CHECK FROM ORDERED_PRODUCT A, PRODUCT B WHERE A.PRDT_CD = B.PRDT_CD AND A.ORDER_CD='" + ORDER_CD + "'";

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
// exports.doStore = function(options, callback) {
// 	var STORE_CD = options.STORE_CD;
// 	var BRCH_CD = options.BRCH_CD;

// 	var query = "SELECT * FROM STORED_PRODUCT WHERE STORE_CD='" + STORE_CD + "'";

// 	__oracleDB.execute(query, [], function(err, result) {
// 	    if (err) {
// 	       console.log("doStore select err: ", err);
// 	       callback(null);
// 	    } else {
// 	    	if(result.rows && result.rows.length) {
// 	    		// 재고 업데이트
// 	    		async.each(result.rows, function(eachStored, async_cb) {
// 	    			var _query = "UPDATE STOCK SET STOCK_CNT=STOCK_CNT+" + eachStored.PRDT_CNT + " WHERE BRCH_CD='" + BRCH_CD + "' AND PRDT_CD='" + eachStored.PRDT_CD + "'";
// 	    			__oracleDB.execute(query, [], {autoCommit:true}, function(_err, _result) {
// 	    				if(_err) {
// 	    					console.log("doStore update stock cnt err: ", _err);
// 	    				}
// 	    				async_cb();
// 	    			});
// 	    		}, function(async_err) {
// 	    			if(async_err) {
// 	    				console.log("doStore async_err: ", async_err);
// 	    				callback(null);
// 	    			} else {
// 	    				callback(true);
// 	    			}
// 	    		});
// 	    	} else {
// 	    		console.log("doStore: no stored product!");
// 	    		callback(null);
// 	    	}
// 	    }
// 	});
// };

// 입고목록 가져오기
exports.getStoreList = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;

	var query = "SELECT * FROM STORE";

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
	var BRCH_CD = options.BRCH_CD;
	var POS_CD = options.POS_CD;

	var SELL_CD = options.SELL_CD;
	var REF_DESCR = options.REF_DESCR;

	var refundDateFormat = getDateFormat();
	var timeFormat = getTimeFormat();

	// CODE
	var REF_CD = BRCH_CD + refundDateFormat;
	var MNY_HIS_CD = BRCH_CD + refundDateFormat;

	var productList = null;
	var TOTAL_REFUND_PRICE = 0;

	async.waterfall([
		// make REF_CD
	    function(callback){
	    	var query = "SELECT REF_CD FROM (SELECT REF_CD FROM REFUND ORDER BY REF_DATE DESC) WHERE ROWNUM=1";
	    	__oracleDB.execute(query, [], function(err, result) {
	    		if (err) {
			       callback("make REF_CD err: " + err);
			    } else {
			    	if(result.rows && result.rows.length) {
			    		var recentRef = result.rows[0];
			    		var REF_SEQ = getNextSeq(recentRef.REF_CD.substring(14, 20));
			    		REF_CD += REF_SEQ;
			    	} else {
			    		REF_CD += '000001';
			    	}
			    	callback(null);
			    }
	    	});
	    },
	    // get PRODUCT LIST
	    function(callback){
	    	var query = "SELECT * FROM SOLD_PRODUCT WHERE SELL_CD='" + SELL_CD + "'";
	    	__oracleDB.execute(query, [], function(err, result) {
	    		if (err) {
			       callback("get PRODUCT LIST err: " + err);
			    } else {
			    	productList = result.rows;
			    	callback(null);
			    }
	    	});
	    },
	    // make REFUND / update STOCK
	    function(callback){
	    	async.map(productList, function(eachRefund, async_cb) {
	    		TOTAL_REFUND_PRICE += eachRefund.SELL_PRICE;
	    		var query = "INSERT INTO REFUND VALUES ('" + REF_CD + "', TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + REF_DESCR + "', " + eachRefund.PRDT_CNT + ", " + eachRefund.SELL_PRICE + ", '" + eachRefund.PRDT_CD + "', '" + POS_CD + "')";
		    	__oracleDB.execute(query, [], {autoCommit:true}, function(err, result) {
		    		var stockQuery = "UPDATE STOCK SET STOCK_CNT=STOCK_CNT+" + eachRefund.PRDT_CNT + " WHERE BRCH_CD='" + BRCH_CD + "' AND PRDT_CD='" + eachRefund.PRDT_CD + "'";
					__oracleDB.execute(stockQuery, [], {autoCommit:true}, function(err, result) {
						async_cb();
					});
		    	});
	    	}, function(async_err) {
	    		callback(null);
	    	});
	    },
	    // delete sell list
	    function(callback){
	    	__oracleDB.execute("DELETE FROM SOLD_PRODUCT WHERE SELL_CD='" + SELL_CD + "'", [], {autoComit:true}, function(err, result) {
	    		if(err) {
	    			callback("delete sell list err: " + err);
	    		} else {
	    			__oracleDB.execute("DELETE FROM SELL WHERE SELL_CD='" + SELL_CD + "'", [], {autoComit:true}, function(_err, _result) {
			    		if(_err) {
			    			callback("delete sell err: " + _err);
			    		} else {
			    			callback(null);
			    		};
			    	});
	    		};
	    	});
	    },
	    // make MNY_HIS_CD
	    function(callback){
	    	__oracleDB.execute("SELECT MNY_HIS_CD FROM (SELECT MNY_HIS_CD FROM MONEY_HISTORY ORDER BY HISTORY_DATE DESC) WHERE ROWNUM=1", [], function(err, result) {
	    		if(err) {
	    			callback("make MNY_HIS_CD err: " + err);
	    		} else {
					if(result.rows && result.rows.length) {
			    		var recentHistory = result.rows[0];
			    		var MNY_HIS_SEQ = getNextSeq(recentHistory.MNY_HIS_CD.substring(14, 20));
			    		MNY_HIS_CD += MNY_HIS_SEQ;
			    	} else {
			    		MNY_HIS_CD += '000001';
			    	}
			    	callback(null);
			    }
		    });
	    },
	    // insert MONEY HISTORY
	    function(callback) {
	    	var insertMnyHistoryQuery = "INSERT INTO MONEY_HISTORY VALUES('" + MNY_HIS_CD + "', 'O', " + TOTAL_REFUND_PRICE + ", TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + BRCH_CD + "')";
	    	__oracleDB.execute(insertMnyHistoryQuery, [], {autoCommit:true}, function(err, result) {
	    		if(err) {
	    			callback("insert MONEY_HISTORY err: " + err);
	    		} else {
	    			callback(null);
	    		}
	    	});
	    },
	    // update Branch Money
	    function(callback) {
	    	var updateBrchMnyQuery = "UPDATE BRANCH SET MNY=MNY-" + TOTAL_REFUND_PRICE + " WHERE BRCH_CD='" + BRCH_CD + "'";
	    	__oracleDB.execute(updateBrchMnyQuery, [], {autoCommit:true}, function(err, result) {
	    		if(err) {
	    			callback("update Branch Money err: " + err);
	    		} else {
	    			callback(null);
	    		}
	    	});
	    }
	], function (err, result) {
		if(err) {
			console.log(err);
			callback(null);
		} else {
			callback(true);
		}
	});
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
	    	async.mapSeries(result.rows, function(row, async_cb) {
	    		__oracleDB.execute("SELECT PRDT_NAME FROM PRODUCT WHERE PRDT_CD='" + row.PRDT_CD + "'", [], function(_err, _result) {
	    			row.PRDT_NAME = _result.rows[0].PRDT_NAME;
	    			async_cb();
	    		});
	    	}, function(async_err) {
	    		callback({
		    		LIST: result.rows
		    	});
	    	});
	    }
	});
};

// 반품하기
exports.doReturn = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var LIST = options.LIST;

	var returnDateFormat = getDateFormat();
	var timeFormat = getTimeFormat();
	var RET_CD = BRCH_CD + returnDateFormat;

	if(LIST && LIST.length) {
		__oracleDB.execute("SELECT RET_CD FROM (SELECT RET_CD FROM RETURN ORDER BY RET_DATE DESC) WHERE ROWNUM=1", [], function(err, result) {
		    if (err) {
		       console.log("doReturn select return err: ", err);
		       callback(null);
		    } else {
		    	if(result.rows && result.rows.length) {
		    		var recentReturn = result.rows[0];
		    		var SEQ = getNextSeq(recentReturn.RET_CD.substring(14, 20));
		    		RET_CD += SEQ;
		    	} else {
		    		RET_CD += '000001';
		    	}

		    	__oracleDB.execute("INSERT INTO RETURN VALUES ('" + RET_CD + "', TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + BRCH_CD + "')", [], {autoCommit:true}, function(_err, _result) {
		    		if(_err) {
		    			console.log("doReturn insert Return err: ", _err);
		    			callback(null);
		    		} else {
		    			async.each(LIST, function(eachRet, async_cb) {
		    				__oracleDB.execute("INSERT INTO RETURNED_PRODUCT VALUES (" + eachRet.PRDT_CNT + ", '" + eachRet.RET_DESCRB + "', '" + RET_CD + "', '" + eachRet.PRDT_CD + "')", [], {autoCommit:true}, function(__err, __result) {
		    					__oracleDB.execute("UPDATE STOCK SET STOCK_CNT=STOCK_CNT-" + eachRet.PRDT_CNT + " WHERE BRCH_CD='" + BRCH_CD + "' AND PRDT_CD='" + eachRet.PRDT_CD + "'", [], {autoCommit:true}, function(___err, ___result) {
		    						async_cb();
		    					});
		    				});
		    			}, function(async_err) {
		    				if(async_err) {
		    					console.log("doReturn async_err: ", async_err);
		    					callback(null);
		    				} else {
		    					callback(true);
		    				}
		    			});
		    		}
		    	});
		    }
		});
	} else {
		callback(true);
	}
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
	var BRCH_CD = options.BRCH_CD;

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
	    	callback({
	    		LIST: result.rows
	    	});
	    }
	});
};

// 손실 등록하기
exports.doLoss = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var lossCreateDate = getDateFormat();
	var timeFormat = getTimeFormat();
	var LOSS_CD = BRCH_CD + lossCreateDate;

	__oracleDB.execute("SELECT LOSS_CD FROM (SELECT LOSS_CD FROM LOSS ORDER BY LOSS_DATE DESC) WHERE ROWNUM=1", [], function(err, result) {
	    if (err) {
	       console.log("doLoss select loss err: ", err);
	       callback(null);
	    } else {
	    	if(result.rows && result.rows.length) {
	    		var recentLoss = result.rows[0];
	    		var SEQ = getNextSeq(recentLoss.LOSS_CD.substring(14, 20));
	    		LOSS_CD += SEQ;
	    	} else {
	    		LOSS_CD += '000001';
	    	}

	    	__oracleDB.execute("INSERT INTO LOSS VALUES ('" + LOSS_CD + "', " + options.LOSS_CNT + ", " + options.LOSS_PRICE + ", TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + BRCH_CD + "', '" + options.PRDT_CD + "')", [], {autoCommit:true}, function(_err, _result) {
	    		if(_err) {
	    			console.log("doLoss insert loss err: ", _err);
	    			callback(null);
	    		} else {
	    			__oracleDB.execute("UPDATE STOCK SET STOCK_CNT=STOCK_CNT-" + options.LOSS_CNT + " WHERE BRCH_CD='" + BRCH_CD + "' AND PRDT_CD='" + options.PRDT_CD + "'", [], {autoCommit:true}, function(__err, __result) {
	    				if(__err) {
	    					console.log("doLoss update stock cnt err: ", __err);
	    					callback(null);
	    				} else {
	    					callback(true);
	    				}
	    			});
	    		}
	    	});
	    }
	});
};

// 손실 취소하기
// exports.cancelLoss = function(options, callback) {

// };

// 손실목록 가져오기
exports.getLossList = function(options, callback) {
	var query = "SELECT A.*, B.PRDT_NAME FROM LOSS A, PRODUCT B WHERE A.PRDT_CD = B.PRDT_CD";

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
	var BRCH_CD = options.BRCH_CD;

	var discardCreateDate = getDateFormat();
	var timeFormat = getTimeFormat();
	var DISCARD_CD = BRCH_CD + discardCreateDate;

	__oracleDB.execute("SELECT DISCARD_CD FROM (SELECT DISCARD_CD FROM DISCARD ORDER BY DISCARD_DATE DESC) WHERE ROWNUM=1", [], function(err, result) {
	    if (err) {
	       console.log("doDiscard select discard err: ", err);
	       callback(null);
	    } else {
	    	if(result.rows && result.rows.length) {
	    		var recentDiscard = result.rows[0];
	    		var SEQ = getNextSeq(recentDiscard.DISCARD_CD.substring(14, 20));
	    		DISCARD_CD += SEQ;
	    	} else {
	    		DISCARD_CD += '000001';
	    	}

	    	__oracleDB.execute("INSERT INTO DISCARD VALUES ('" + DISCARD_CD + "', TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), " + options.DISCARD_CNT + ", " + options.DISCARD_PRICE + ", '" + BRCH_CD + "', '" + options.PRDT_CD + "')", [], {autoCommit:true}, function(_err, _result) {
	    		if(_err) {
	    			console.log("doDiscard insert discard err: ", _err);
	    			callback(null);
	    		} else {
	    			__oracleDB.execute("UPDATE STOCK SET STOCK_CNT=STOCK_CNT-" + options.DISCARD_CNT + " WHERE BRCH_CD='" + BRCH_CD + "' AND PRDT_CD='" + options.PRDT_CD + "'", [], {autoCommit:true}, function(__err, __result) {
	    				if(__err) {
	    					console.log("doDiscount update stock cnt err: ", __err);
	    					callback(null);
	    				} else {
	    					callback(true);
	    				}
	    			});
	    		}
	    	});
	    }
	});
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
	var BRCH_CD = options.BRCH_CD;
	var joinDate = getDateFormat();
	var timeFormat = getTimeFormat();

	var POINT = options.POINT || 0;

	var query = "INSERT INTO MEMBER VALUES ('" + options.PHONNO + "', '" + options.PW + "', " + POINT + ", TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + BRCH_CD + "')";

	__oracleDB.execute(query, [], {autoCommit:true}, function(err, result) {
        if (err) {
            console.log("addMember err: ", err);
            callback(null);
        } else {
            callback(true);
        }
    });
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

	__oracleDB.execute(query, [], {autoCommit:true}, function(err, result) {
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

	__oracleDB.execute(query, [], {autoCommit:true}, function(err, result) {
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
	__oracleDB.execute(query, [], {autoCommit:true}, function(err, result) {
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
	var BRCH_CD = options.BRCH_CD;
	var historyDateFormat = getDateFormat();
	var timeFormat = getTimeFormat();
	var MNY_HIS_CD = BRCH_CD + historyDateFormat;

	var today = new Date();
	var todayYear = today.getFullYear();
	var todayMonth = today.getMonth();
	if(todayMonth < 10) {
		todayMonth = '0' + todayMonth;
	}
	var thisMonthFormat = (todayYear).toString() + (todayMonth).toString() + '01000000';

	if(todayMonth == 12) {
		var afterYear = todayYear + 1;
		var afterMonth = '01';
	} else {
		var afterYear = todayYear;
		var afterMonth = parseInt(todayMonth) + 1;

		if(afterMonth < 10) {
			afterMonth = '0' + afterMonth;
		}
	}

	var afterMonthFormat = (afterYear).toString() + (afterMonth).toString() + '01000000';

	var totalRevenue = 0;

	__oracleDB.execute("SELECT * FROM MONEY_HISTORY WHERE HISTORY_DATE >= TO_DATE('" + thisMonthFormat + "', 'YYYYMMDDHH24MISS') AND HISTORY_DATE < TO_DATE('" + afterMonthFormat + "', 'YYYYMMDDHH24MISS')", [], function(err, result) {
        if (err) {
            console.log("payMargin select err: ", err);
            callback(null);
        } else {
            if(result.rows && result.rows.length) {
            	var rows = result.rows;
            	for(var i = 0; i < rows.length; i++) {
            		if(rows[i].IO_TYPE == 'I') {
            			totalRevenue += rows[i].PRICE;
            		} else if(rows[i].IO_TYPE == 'O') {
            			totalRevenue -= rows[i].PRICE;
            		}
            	}

            	if(totalRevenue > 0) {
            		__oracleDB.execute("SELECT BRCH_TYPE_CD FROM BRANCH WHERE BRCH_CD='" + BRCH_CD + "'", [], function(_err, _result) {
	            		var BRCH_TYPE_CD = _result.rows[0].BRCH_TYPE_CD;
	            		__oracleDB.execute("SELECT PAYMENT_RATE FROM BRANCH_TYPE WHERE BRCH_TYPE_CD='" + BRCH_TYPE_CD + "'", [], function(__err, __result) {
	            			var PAYMENT_RATE = __result.rows[0].PAYMENT_RATE;
	            			var PAYMENT_PRICE = parseInt(totalRevenue*(PAYMENT_RATE/100));

							__oracleDB.execute("UPDATE BRANCH SET MNY=MNY+" + PAYMENT_PRICE + " WHERE BRCH_CD='" + BRCH_CD + "'", [], {autoCommit:true}, function(___err, ___result) {
								__oracleDB.execute("SELECT MNY_HIS_CD FROM (SELECT MNY_HIS_CD FROM MONEY_HISTORY ORDER BY HISTORY_DATE DESC) WHERE ROWNUM=1", [], function(____err, ____result) {
									if(result.rows && result.rows.length) {
							    		var recentHistory = result.rows[0];
							    		var SEQ = getNextSeq(recentHistory.MNY_HIS_CD.substring(14, 20));
							    		MNY_HIS_CD += SEQ;
							    	} else {
							    		MNY_HIS_CD += '000001';
							    	}
								});

								__oracleDB.execute("INSERT INTO MONEY_HISTORY VALUES ('" + MNY_HIS_CD + "', 'O', " + PAYMENT_PRICE + ", TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + BRCH_CD + "')", [], {autoCommit:true}, function(_____err, _____result) {
									callback(true);
								});
							});
	            		});
	            	});
            	} else {
            		callback(true);
            	}
            } else {
            	callback(true);
            }
        }
    });
};

// 직원 등록하기
exports.addEmployee = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var hiredDateFormat = getDateFormat();
	var timeFormat = getTimeFormat();
	var EMP_CD = BRCH_CD + hiredDateFormat;

	__oracleDB.execute("SELECT EMP_CD FROM (SELECT EMP_CD FROM EMPLOYEE ORDER BY HIRED_DATE DESC) WHERE ROWNUM=1", [], function(err, result) {
	    if (err) {
	       console.error(err.message);
	       callback(null);
	    } else {
	    	if(result.rows && result.rows.length) {
	    		var recentHired = result.rows[0];
	    		var SEQ = getNextSeq(recentHired.EMP_CD.substring(14, 20));
	    		EMP_CD += SEQ;
	    	} else {
	    		EMP_CD += '000001';
	    	}

	    	var insertQuery = "INSERT INTO EMPLOYEE VALUES ('" + EMP_CD + "', '" + options.EMP_NAME + "', '" + options.PHONNO + "', '사원', 0, 0, TO_DATE('" + timeFormat + "', 'YYYYMMDDHH24MISS'), '" + BRCH_CD + "')";
	    	__oracleDB.execute(insertQuery, [], {autoCommit:true}, function(_err, _result) {
		        if (_err) {
		            console.log("addEmployee insert err: ", _err);
		            callback(null);
		        } else {
		            callback(true);
		        }
		    });
	    }
	});
};

// 직원 삭제하기
exports.deleteEmployee = function(options, callback) {
	var BRCH_CD = options.BRCH_CD;
	var EMP_CD = options.EMP_CD;

	var query = "DELETE FROM EMPLOYEE WHERE BRCH_CD = '" + BRCH_CD + "' AND EMP_CD = '" + EMP_CD + "'";

	__oracleDB.execute(query, [], {autoCommit:true}, function(err, result) {
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
