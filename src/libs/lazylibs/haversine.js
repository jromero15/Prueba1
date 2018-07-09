/*
  A pure Javascript implementation of Haversine formula
  Based on Bartek Górny implementation and others
  Author: Jorge Brunal Perez <diniremix@gmail.com>

  How to use:

  origin = [4.6565, -74.564654]
  destiny = [4.6748, -74.05485]

  result_in_kms = Haversine.calculate(origin, destiny, 'kms');
  console.log("result in kms", result_in_kms);

  Otherwise
  result_in_mts = Haversine.calculate(origin, destiny)
  console.log("result in mts", result_in_mts);
*/

var Haversine = (function() {
    'use strict';
    var fn = {};

    fn.calculate = function(lat, lon, type_measure) {
        var lat1 = lat[0];
        var lat2 = lon[0];

        var lon1 = lat[1];
        var lon2 = lon[1];

        var R = 6371; // km
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        var c = 2 * Math.asin(Math.sqrt(a));
        var d = R * c;

        var resp = 0;
        if (type_measure === 'kms') {
            resp = d.toFixed(2);
        } else {
            //default results in meters
            var mts = (d * 1000);
            resp = mts.toFixed(2);
        }

        return parseFloat(resp);
    };

    return fn;
}()); //Haversine
