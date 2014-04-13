$(document).ready(function () {
    // GeonameIds of all country codes
    // TODO: get all geonames from geonames API by ajax request
    // or from itrip api
    var geonameIds = {
        'DE': 2921044,
        'CN': 1814991,
    };

    $('#world-map').vectorMap({
        map: 'world_mill_en',
        onRegionClick: function(event, code){
            if (geonameIds[code]) {
                window.location.href = '/resort/' + geonameIds[code];
            }
　　　　}
    });
});