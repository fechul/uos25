var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var json = {};
    res.render('main.html', json);
});

module.exports = router;
