/*Geo settings here*/
(function() {
    'use strict';

    angular.module('app.core').constant('GEO_SETTINGS', {
        GEOCODER: {
            'uri': 'https://sitidata-stdr.appspot.com/api/geocoder/',
            'token': 'awesome-token',
        },
        GEOMASSIVE: {
            'objectOnly': 'https://sitidata-stdr.appspot.com/api/massive',
            'objectMassive': 'https://sitidata-stdr.appspot.com/api/outobjmassive',
            'token': 'awesome-token',
        },
        GEOASSISTED: {
            'uri': 'https://sitidata-stdr.appspot.com/api/geoassisted/',
            'chain_geo': 'awesome-chain.geo',
            'token': 'awesome-token',
        }
    });
})();
