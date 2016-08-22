'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../../config');
var validator = require('validator');
var request = require('request');
var knex = require('../../library/db').knex;

module.exports.index = function(req, res, next){
    if(!req.params.name){
        return res.redirect('/cs255/blogs/cerf-kahn');
    }

    var blogsDir = require.main.filename + '/../../views/cs255/blogs';
    var blogName = req.params.name+'.jade';
    fs.stat(path.resolve(blogsDir, blogName), function(err, stat){
        if(err){
            var error = new Error('Not Found');
            error.status = 404;
            return next(error);
        }

        knex('comment')
        .select()
        .where({'blog': req.params.name})
        .then(function(comments){
            res.render('cs255/blogs/'+blogName, {
                captchaPublic: config.recaptcha.site,
                comments: comments,
                title: 'CS255 | Blogs',
            });
        });
    });
};

module.exports.comment = function(req, res, next){
    var name = req.body.name;
    if(validator.isNull(name) || !validator.isLength(name, {min: 1, max:30})){
        return res.json({
            isSuccessful: false,
            error: 'name'
        });
    }

    var comment = req.body.comment;
    if(validator.isNull(comment) || !validator.isLength(comment, {min: 1, max:5000})){
        return res.json({
            isSuccessful: false,
            error: 'comment'
        });
    }

    var recaptcha = req.body['g-recaptcha-response'];
    if(validator.isNull(recaptcha) || !validator.isLength(recaptcha, {min: 1, max: undefined})){
        return res.json({
            isSuccessful: false,
            error: 'recaptcha'
        });
    }

    request.post({
        url: config.recaptcha.url, 
        form: {
            secret: config.recaptcha.secret,
            response: req.body['g-recaptcha-response']
        }
    }, function(err,httpResponse,body){
        if(!JSON.parse(body).success){
            return res.json({
                isSuccessful: false,
                error: 'recaptcha'
            });
        }

        // push to database
        return knex('comment').insert({
            blog: req.params.name,
            name: name,
            comment: comment
        }).then(function(){
            return res.json({
                isSuccessful: true,
                comment: {
                    name: name,
                    comment: comment
                }
            });
        }).catch(function(e){
            var err = new Error('Something went horribly wrong in the server :(');
            err.status = 500;
            return next(err);
        });
    });
};
