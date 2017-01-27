/*global navigator*/
function getPosition(callback) {
    navigator.geolocation.getCurrentPosition(function(location) {
        return callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy
        });
    });
};