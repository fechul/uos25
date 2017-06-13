var express = require('express');
var router = express.Router();

var core = require('../core/core.js');

/*
	판매
*/

// 메인페이지 라우팅
router.get('/', function(req, res, next) {
	var json = {};
	console.log("session: ", req.session);
    res.render('main.html', json);
});

// req.session.BRCH_CD -> 브랜치코드
// req.session.POS_CD -> POS코드


// 판매하기
router.post('/sell', function(req, res) {
	req.body.LIST = JSON.parse(req.body.LIST);
	req.body.BRCH_CD = req.session.BRCH_CD;
	req.body.POS_CD = req.session.POS_CD;

    core.doSell(req.body, function(result) {
    	res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
    });
});

// 판매취소하기
// router.delete('/sell', function(req, res) {
// 	core.cancelSell(req.body, function(result) {
// 		res.json(result);
// 	});
// });

// 판매기록가져오기
router.get('/sell/list', function(req, res) {
	var POS_CD = req.session.POS_CD;

	core.getSellList({
		POS_CD: POS_CD
	}, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});

// 판매정보확인하기
router.get('/sold_product', function(req, res) {
	core.getSoldProduct(req.query, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	재고
*/

// 재고목록 가져오기
router.get('/stock/list', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;

	core.getStockList({
		BRCH_CD: BRCH_CD
	}, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	상품
*/

// 상품정보 가져오기
router.get('/product', function(req, res) {
	core.getProduct(req.query, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});

// 상품목록 가져오기
router.get('/product/list', function(req, res) {
	core.getProductList(function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	주문
*/

// 주문하기
router.post('/order', function(req, res) {
	req.body.LIST = JSON.parse(req.body.LIST);
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.doOrder(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 주문 취소하기
router.delete('/order', function(req, res) {
	core.cancelOrder(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 주문정보 확인하기
router.get('/order', function(req, res) {
	core.getOrder(req.query, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});

// 주문목록 가져오기
router.post('/order/list', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;

	core.getOrderList({
		BRCH_CD: BRCH_CD
	}, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	입고
*/

// 입고 확정하기
router.post('/store', function(req, res) {
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.doStore(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 입고목록 가져오기
router.get('/store/list', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;

	core.getStoreList({
		BRCH_CD: BRCH_CD
	}, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});

// 입고정보 확인하기
router.get('/store', function(req, res) {
	core.getStore(req.query, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	환불
*/

// 환불하기
router.post('/refund', function(req, res) {
	core.doRefund(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 환불 취소하기
// router.delete('/refund', function(req, res) {
// 	core.cancelRefund(req.body, function(result) {
// 		res.json({
//     		RESULT: (result ? true : false),
//     		ERR_CD: (result ? null : 1),
//     		DATA: result
//     	});
// 	});
// });

// 환불기록 가져오기
router.get('/refund/list', function(req, res) {
	var POS_CD = req.session.POS_CD;

	core.getRefundList({
		POS_CD: POS_CD
	}, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	반품
*/

// 반품하기
router.post('/return', function(req, res) {
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.doReturn(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 반품 취소하기
// router.delete('/return', function(req, res) {
// 	core.cancelReturn(req.body, function(result) {
// 		res.json({
//     		RESULT: (result ? true : false),
//     		ERR_CD: (result ? null : 1),
//     		DATA: result
//     	});
// 	});
// });

// 반품기록 가져오기
router.get('/return/list', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;

	core.getReturnList({
		BRCH_CD: BRCH_CD
	}, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});

// 반품정보 확인하기
router.get('/return', function(req, res) {
	core.getReturn(req.query, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	손실
*/

// 손실 등록하기
router.post('/loss', function(req, res) {
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.doLoss(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 손실 취소하기
// router.delete('/loss', function(req, res) {
// 	core.cancelLoss(req.body, function(result) {
// 		res.json({
//     		RESULT: (result ? true : false),
//     		ERR_CD: (result ? null : 1),
//     		DATA: result
//     	});
// 	});
// });

// 손실목록 가져오기
router.get('/loss/list', function(req, res) {
	core.getLossList(function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	폐기
*/

// 폐기하기
router.post('/discard', function(req, res) {
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.doDiscard(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 폐기 취소하기
// router.delete('/discard', function(req, res) {
// 	core.cancelDiscard(req.body, function(result) {
// 		res.json({
//     		RESULT: (result ? true : false),
//     		ERR_CD: (result ? null : 1),
//     		DATA: result
//     	});
// 	});
// });

// 폐기목록 가져오기
router.get('/discard/list', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;
	core.getDiscardList({
		BRCH_CD: BRCH_CD
	}, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	회원
*/

// 회원 등록하기
router.post('/member', function(req, res) {
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.addMember(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 회원목록 가져오기
router.get('/member/list', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;

	core.getMemberList({
		BRCH_CD: BRCH_CD
	},function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});

// 회원 삭제하기
router.delete('/member', function(req, res) {
	core.deleteMember(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 마일리지 조회하기
router.get('/point', function(req, res) {
	var PHONNO = req.query.PHONNO;
	var PW = req.query.PW;

	core.getPoint({
		PHONNO: PHONNO,
		PW: PW
	}, function(data) {

		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});

	});
});


/*
	생활서비스
*/

// 생활서비스 등록하기
router.post('/cvs', function(req, res) {
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.addCvs(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 생활서비스 등록 해제하기
router.delete('/cvs', function(req, res) {
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.deleteCvs(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 전체 생활서비스 목록 가져오기
router.get('/cvs/list', function(req, res) {
	core.getCvsList(function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});

// 지점의 생활서비스 목록 가져오기
router.get('/cvs/list/branch', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;

	core.getCvsListBranch({
		BRCH_CD: BRCH_CD
    }, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	자금
*/

// 자금내역 가져오기
router.get('/branch/money', function(req, res) {
	req.query.BRCH_CD = req.session.BRCH_CD;
	core.getBranchMoney(req.query, function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	이벤트
*/

// 이벤트 정보 가져오기
router.get('/event', function(req, res) {
	var EVENT_CD = req.query.EVENT_CD;
    core.getEvent({

        EVENT_CD: EVENT_CD
    }, function(data) {
        res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
    });

});

// 이벤트목록 가져오기
router.get('/event/list', function(req, res) {
	core.getEventList(function(data) {
		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});


/*
	지점
*/

// 지점 정보 가져오기
router.get('/branch', function(req, res) {
	var BRCH_CD = req.sesion.BRCH_CD;

	core.getBranch({
		BRCH_CD: BRCH_CD
	}, function(data) {

		res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
	});
});

// 마진 지불하기
router.post('/margin', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;
	core.payMargin({
		BRCH_CD: BRCH_CD
	}, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});


/*
	직원
*/

// 직원 등록하기
router.post('/employee', function(req, res) {
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.addEmployee(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 직원 삭제하기
router.delete('/employee', function(req, res) {
	req.body.BRCH_CD = req.session.BRCH_CD;
	core.deleteEmployee(req.body, function(result) {
		res.json({
    		RESULT: (result ? true : false),
    		ERR_CD: (result ? null : 1),
    		DATA: result
    	});
	});
});

// 직원목록 가져오기
router.get('/employee/list', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;
	core.getEmployeeList({
		BRCH_CD: BRCH_CD
	}, function(data) {
        res.json({
    		RESULT: (data ? true : false),
    		ERR_CD: (data ? null : 1),
    		DATA: data
    	});
    });
});

module.exports = router;
