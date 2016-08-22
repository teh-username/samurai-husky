'use strict';

var config = require('../config');
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: config.sqlite.dir
    },
    useNullAsDefault: true
});

module.exports = {
    knex: knex
};
