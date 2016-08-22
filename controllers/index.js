'use strict';

var fs = require('fs');
var https = require('https');
var corgiFilePath = 'corgi.json';
var defaultCorgeh = 'https://i.imgur.com/YkmDoKN.jpg';

module.exports = function(req, res, next) {
    var corgeh = defaultCorgeh;
    fs.readFile(corgiFilePath, 'utf-8', function(err, data){
        if (err){
            updateCorgis();
        }
        else{
            data = JSON.parse(data);
            var id = Math.floor(Math.random() * (data.data.children.length + 1));
            try{
                corgeh = data.data.children[id].data.preview.images[0].source.url;
            } catch(e){
                // probably a text post
            }
        }

        res.render('index', { 
            title: 'Homepage',
            corgeh:  corgeh
        });
    });
};

function updateCorgis(){
    https.get('https://www.reddit.com/r/corgi/top/.json?count=30', function(res){
        var writeStream = fs.createWriteStream(corgiFilePath);
        writeStream.on('finish', function(){
            writeStream.end();
        });
        res.pipe(writeStream);
    });
}
