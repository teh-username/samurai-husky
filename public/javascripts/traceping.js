function initMap(){
    // setup map, zoom in first route (probably the same through all routes)
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: routes[0][0]['lat'], lng: routes[0][0]['lng']},
      zoom: 8
    });

    // Define a symbol using a predefined path (an arrow)
    // supplied by the Google Maps JavaScript API.
    var lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
    };

    // do the fancy arrow thingies
    var routeCount = routes.length;
    for(var i = 0; i < routeCount; i++){
        routes[i].map(function(cur, index, arr){
            if(index === 0){return;}
            var arrowTail = arr[index-1];
            var arrowHead = cur;
            var line = new google.maps.Polyline({
              path: [{lat: arrowTail['lat'], lng: arrowTail['lng']}, {lat: arrowHead['lat'], lng: arrowHead['lng']}],
              icons: [{
                icon: lineSymbol,
                offset: '100%'
              }],
              map: map
            });

            animateArrow(line);
        });
    }
}

function animateArrow(line){
    var count = 0;
    window.setInterval(function() {
        count = (count + 1) % 200;
        var icons = line.get('icons');
        icons[0].offset = (count / 2) + '%';
        line.set('icons', icons);
    }, 20);
}

(function(){
    var labels = Object.keys(freq).sort();
    var data = labels.map(function(key){
        return freq[key];
    });

    // may want to fix that weird floaty y-axis since
    // we can't do 1.5 frequency right?
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ping Frequency',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
})();