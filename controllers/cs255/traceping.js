knex = require('../../library/db').knex

module.exports = function(req, res, next){
    knex('ping')
    .select()
    .then(function(pings){
        knex('traceroute')
        .select()
        .then(function(traceroutes){
            var freq = {};
            pings.map(function(ping){
                if(ping.time in freq){ freq[ping.time]++; }
                else { freq[ping.time] = 1; }
            });

            var routes = traceroutes.map(function(route){
                return JSON.parse(route['route']).map(function(blip){
                    return {hostname: blip['hostname'], lat: blip['latitude'], lng: blip['longitude']};
                });
            });

            res.render('cs255/traceping', {
                freq: freq,
                routes: routes
            });
        });
    });
}
