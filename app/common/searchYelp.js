/* global getPosition, ajaxFunctions*/
(function() {
    getPosition(function(position) {
        if (position.latitude && position.longitude) {
            ajaxFunctions.ready(ajaxFunctions.ajaxPostRequest('POST', '/searchnear', {
                latitude: position.latitude,
                longitude: position.longitude
            }, function(res) {
                res = JSON.parse(res);
                var body = JSON.parse(res.body);
                var goingTo = res.user.goingTo;
                var bars = body.businesses;
                

                initializeUI(bars, goingTo);

            }));
        }
        else {
            alert("You need to allow geolocation");
        }
    });



})();
