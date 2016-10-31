var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
 res.redirect('index');
});

router.get('/index', function(req, res){
	 res.render('index', {
    title: "Unite Salisbury",
    message: req.flash('loginMessage')
  });
});

module.exports = router;
