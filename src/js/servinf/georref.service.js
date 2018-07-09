/* =========================================================
 * Module: GeoRef.service.js
 * A beautiful plugin, for Geo using Angular 1.x
 * ==========================================================
 */

(function() {
    'use strict';

    function GeoRef($log, Api, GEO_SETTINGS) {
        this.geoStatus = statusGeo;
        this.geoCoder = oneByOneGeo;
        this.geoMassive = massiveGeo;
        this.geoAssisted = assistedGeo;

        function statusGeo(code) {
            var typeStatus = {
                'A': 'Aproximado con geo al 100%',
                'B': 'Normalizado y Georreferenciado Exacto',
                'C': 'Intraducible',
                'D': 'Normalizado y georreferenciado aproximado',
                'E': 'Normalizado y no georreferenciado',
                'F': 'Normalizado por cruce y georreferenciado exacto',
                'G': 'Normalizado por cruce y no georreferenciado',
                'H': 'Atípicas',
                'I': 'Normalizado por barrio georreferenciado',
                'J': 'Normalizado por barrio no georreferenciado',
                'K': 'Georreferenciado a centroide de barrio',
                'L': 'Normalizado por sitio y georreferenciado',
                'M': 'Normalizado y georreferenciado por predio',
                'N': 'Normalizado y georreferenciado por predio MZ',
                'O': 'Georreferenciado a centroide de localidad / comuna',
                'R': 'Direcciones Rurales',
                'W': 'Apartados aereos',
                'X': 'Ciudad disponible no adquirida',
                'Y': 'Georreferenciado por predio aproximado',
                'Z': 'Ubicado por centroide del centro poblado'
            };

            if (code !== null) {
                if (typeStatus.hasOwnProperty(code)) {
                    return typeStatus[code];
                }
            }
            return null;
        }

        function oneByOneGeo(data, callbackFn) {
            if (data === null) {
                $log.error('Geocoder: data was not provided');
                return false;
            }

            var params = {
                'external': true,
                'credentials':false,
                'headers': {
                    'header': 'Authorization',
                    'token': 'Token ' + GEO_SETTINGS.GEOCODER.token
                }
            };

            if (typeof(callbackFn) === 'function') {
                Api(GEO_SETTINGS.GEOCODER.uri, 'POST', data, params).then((function(result) {
                    if (result.success) {
                        if (result.data) {
                            var resp = result.data;
                            resp.estado = statusGeo(resp.estado);

                            callbackFn({
                                'message': result.message,
                                'data': resp
                            });
                        } else {
                            callbackFn(result);
                        }
                    } else {
                        callbackFn(result);
                    }
                }), function(error) {
                    $log.error('Geocoder: Failed to make request to server', error);
                    callbackFn(error);
                });
            } else {
                $log.error('Geocoder: callbackFn is not a valid function method');
            }
        }

        function massiveGeo(data, geoType, callbackFn) {
            if (data === null) {
                $log.error('massiveGeo: data was not provided');
                return false;
            }

            var url = GEO_SETTINGS.GEOMASSIVE.objectMassive;

            switch (geoType) {
                case 'objectOnly':
                    url = GEO_SETTINGS.GEOMASSIVE.objectOnly;
                    break;
                case 'objectMassive':
                    url = GEO_SETTINGS.GEOMASSIVE.objectMassive;
                    break;
                default:
                    url = GEO_SETTINGS.GEOMASSIVE.objectMassive;
                    break;
            }

            var params = {
                'external': true,
                'credentials':false,
                'headers': {
                    'header': 'Authorization',
                    'token': 'Token ' + GEO_SETTINGS.GEOMASSIVE.token
                }
            };

            if (typeof(callbackFn) === 'function') {
                Api(url, 'POST', data, params).then((function(result) {
                    if (result.success) {
                        if (result.data) {
                            var resp = result.data;

                            var objectConstructor = {}.constructor;
                            var arrayConstructor = [].constructor;

                            if (resp.constructor === objectConstructor) {
                                angular.forEach(resp, function(value, index) {
                                    value.estado = statusGeo(value.estado);
                                });
                            } else if (resp.constructor === arrayConstructor) {
                                angular.forEach(resp, function(value, index) {
                                    value.estado = statusGeo(value.estado);
                                });
                            } else {
                                $log.error('massiveGeo: Error parsing response');
                            }

                            callbackFn({
                                'message': result.message,
                                'data': resp,
                                'geoType': (geoType) ? geoType : 'objectMassive'
                            });

                        } else {
                            callbackFn(result);
                        }
                    } else {
                        callbackFn(result);
                    }
                }), function(error) {
                    $log.error('massiveGeo: Failed to make request to server', error);
                    callbackFn(error);
                });
            } else {
                $log.error('massiveGeo: callbackFn is not a valid function method');
            }
        }

        function assistedGeo(data, callbackFn) {
            if (data === null) {
                $log.error('assistedGeo: data was not provided');
                return false;
            }

            var params = {
                'external': true,
                'credentials':false,
                'headers': {
                    'header': 'Authorization',
                    'token': 'Token ' + GEO_SETTINGS.GEOASSISTED.token
                }
            };

            if (typeof(callbackFn) === 'function') {
                Api(GEO_SETTINGS.GEOASSISTED.uri, 'POST', data, params).then((function(result) {
                    if (result.success) {
                        if (result.data) {
                            callbackFn({
                                'message': result.message,
                                'data': result.data
                            });
                        } else {
                            callbackFn(result);
                        }
                    } else {
                        callbackFn(result);
                    }
                }), function(error) {
                    $log.error('assistedGeo: Failed to make request to server', error);
                    callbackFn(error);
                });
            } else {
                $log.error('assistedGeo: callbackFn is not a valid function method');
            }
        };
    }

    angular.module('app.servinf').service('GeoRef', GeoRef);
    GeoRef.$inject = [
        '$log',
        'Api',
        'GEO_SETTINGS'
    ];

})();
