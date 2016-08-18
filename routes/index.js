var express = require('express');
var router = express.Router();

var indexController = require('../controllers/index');
var tracepingController = require('../controllers/cs255/traceping');

/* GET home page. */
router.get('/', indexController);

/* CS255 related routes */
/* traceping */
router.get('/cs255/traceping', tracepingController);

module.exports = router;
