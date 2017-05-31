var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var json = {};
    res.render('index.html', json);
});

module.exports = router;
