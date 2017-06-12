var express = require('express');
var router = express.Router();

var core = require('../core/core.js');

/*
	판매
*/

// 메인페이지 라우팅
router.get('/', function(req, res, next) {
	var json = {};
    res.render('main.html', json);
});


// 판매하기
router.post('/sell', function(req, res) {
    core.doSell(req.body, function(result) {
    	res.json(result);
    });
});

// 판매취소하기
router.delete('/sell', function(req, res) {
	core.cancelSell(req.body, function(result) {
		res.json(result);
	});
});

// 판매기록가져오기
router.get('/sell/list', function(req, res) {
	core.getSellList(function(data) {
		res.json(data);
	});
});

// 판매정보확인하기
router.get('/sell', function(req, res) {
	core.getSell(req.query, function(data) {
		res.json(data);
	});
});


/*
	재고
*/

// 재고목록 가져오기
router.get('/stock/list', function(req, res) {
	core.getStockList(function(data) {
		res.json(data);
	});
});


/*
	상품
*/

// 상품정보 가져오기
router.get('/product', function(req, res) {
	core.getProduct(req.query, function(data) {
		res.json(data);
	});
});

// 상품목록 가져오기
router.get('/product/list', function(req, res) {
	core.getProductList(function(data) {
		res.json(data);
	});
});


/*
	주문
*/

// 주문하기
router.post('/order', function(req, res) {
	core.doOrder(req.body, function(result) {
		res.json(result);
	});
});

// 주문 취소하기
router.delete('/order', function(req, res) {
	core.cancelOrder(req.body, function(result) {
		res.json(result);
	});
});

// 주문하기
router.get('/order', function(req, res) {
	core.getOrder(req.query, function(data) {
		res.json(data);
	});
});

// 주문하기
router.post('/order/list', function(req, res) {
	core.getOrderList(function(data) {
		res.json(data);
	});
});


/*
	입고
*/

// 입고 확정하기
router.post('/store', function(req, res) {
	core.doStore(req.body, function(result) {
		res.json(result);
	});
});

// 입고목록 가져오기
router.get('/store/list', function(req, res) {
	core.getStoreList(function(data) {
		res.json(data);
	});
});

// 입고정보 확인하기
router.get('/store', function(req, res) {
	core.getStore(req.query, function(data) {
		res.json(data);
	});
});


/*
	환불
*/

// 환불하기
router.post('/refund', function(req, res) {
	core.doRefund(req.body, function(result) {
		res.json(result);
	});
});

// 환불 취소하기
router.delete('/refund', function(req, res) {
	core.cancelRefund(req.body, function(result) {
		res.json(result);
	});
});

// 환불기록 가져오기
router.get('/refund/list', function(req, res) {
	core.getRefundList(function(data) {
		res.json(data);
	});
});


/*
	반품
*/

// 반품하기
router.post('/return', function(req, res) {
	core.doReturn(req.body, function(result) {
		res.json(result);
	});
});

// 반품 취소하기
router.delete('/return', function(req, res) {
	core.cancelReturn(req.body, function(result) {
		res.json(result);
	});
});

// 반품기록 가져오기
router.get('/return/list', function(req, res) {
	core.getReturnList(function(data) {
		res.json(data);
	});
});

// 반품정보 확인하기
router.get('/return', function(req, res) {
	core.getRefundList(req.query, function(data) {
		res.json(data);
	});
});


/*
	손실
*/

// 손실 등록하기
router.post('/loss', function(req, res) {
	core.doLoss(req.body, function(result) {
		res.json(result);
	});
});

// 손실 취소하기
router.delete('/loss', function(req, res) {
	core.cancelLoss(req.body, function(result) {
		res.json(result);
	});
});

// 손실목록 가져오기
router.get('/loss/list', function(req, res) {
	core.getLossList(function(data) {
		res.json(data);
	});
});


/*
	폐기
*/

// 폐기하기
router.post('/discard', function(req, res) {
	core.doDiscard(req.body, function(result) {
		res.json(result);
	});
});

// 폐기 취소하기
router.delete('/discard', function(req, res) {
	core.cancelDiscard(req.body, function(result) {
		res.json(result);
	});
});

// 폐기목록 가져오기
router.get('/discard/list', function(req, res) {
	core.getDiscardList(function(data) {
		res.json(data);
	});
});


/*
	회원
*/

// 회원 등록하기
router.post('/member', function(req, res) {
	core.addMember(req.body, function(result) {
		res.json(result);
	});
});

// 회원목록 가져오기
router.get('/member/list', function(req, res) {
	core.getMemberList(function(data) {
		res.json(data);
	});
});

// 회원 삭제하기
router.delete('/member', function(req, res) {
	core.deleteMember(req.body, function(result) {
		res.json(result);
	});
});

// 마일리지 조회하기
router.get('/point', function(req, res) {
	core.getPoint(req.query, function(data) {
		res.json(data);
	});
});


/*
	생활서비스
*/

// 생활서비스 등록하기
router.post('/cvs', function(req, res) {
	core.addCvs(req.body, function(result) {
		res.json(result);
	});
});

// 생활서비스 등록 해제하기
router.delete('/cvs', function(req, res) {
	core.deleteCvs(req.body, function(result) {
		res.json(result);
	});
});

// 전체 생활서비스 목록 가져오기
router.get('/cvs/list', function(req, res) {
	core.getCvsList(function(data) {
		res.json(data);
	});
});

// 지점의 생활서비스 목록 가져오기
router.get('/cvs/list/branch', function(req, res) {
	var BRCH_CD = req.session.BRCH_CD;

	core.getCvsListBranch(BRCH_CD, function(data) {
		res.json(data);
	});
});


/*
	자금
*/

// 자금내역 가져오기
router.get('/branch/money', function(req, res) {
	core.getBranchMoney(req.query, function(data) {
		res.json(data);
	});
});


/*
	이벤트
*/

// 이벤트 정보 가져오기
router.get('/event', function(req, res) {
	core.getEvent(req.query, function(data) {
		res.json(data);
	});
});

// 이벤트목록 가져오기
router.get('/event/list', function(req, res) {
	core.getEventList(function(data) {
		res.json(data);
	});
});


/*
	지점
*/

// 지점 정보 가져오기
router.get('/branch', function(req, res) {
	var BRCH_CD = req.sesion.BRCH_CD;

	core.getEvent(function(data) {
		res.json(data);
	});
});

// 마진 지불하기
router.post('/margin', function(req, res) {
	core.getEventList(function(result) {
		res.json(result);
	});
});


/*
	직원
*/

// 직원 등록하기
router.post('/employee', function(req, res) {
	core.addEmployee(req.body, function(result) {
		res.json(result);
	});
});

// 직원 삭제하기
router.delete('/employee', function(req, res) {
	core.deleteEmployee(req.body, function(result) {
		res.json(result);
	});
});

// 직원목록 가져오기
router.get('/employee/list', function(req, res) {
	core.getEmployeeList(function(data) {
		res.json(data);
	});
});

module.exports = router;

