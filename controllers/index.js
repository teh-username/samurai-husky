'use strict';

module.exports = function(req, res, next) {
    res.render('index', { 
        title: 'Hi There!'
    });
};
