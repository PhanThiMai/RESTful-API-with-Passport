var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET user profile. */
router.get('/me', function (req, res, next) {
  res.send(req.indexRouter);
});


module.exports = router;
