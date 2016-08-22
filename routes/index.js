'use strict';

var express = require('express');
var router = express.Router();

var indexController = require('../controllers/index');
var tracepingController = require('../controllers/cs255/traceping');
var blogController = require('../controllers/cs255/blog');

/* GET home page. */
router.get('/', indexController);

/* CS255 related routes */
/* traceping */
router.get('/cs255/traceping', tracepingController);

/* blog */
router.get('/cs255/blogs/:name?', blogController.index);
router.post('/cs255/blogs/:name/comment', blogController.comment);

module.exports = router;
