/* =========================================================
 * Module: cartodb.service.js
 * A beautiful plugin for cartoDB, using Angular 1.x
 * ==========================================================
 */

(function() {
    'use strict';

    function cartoDB($log, Api, CARTODB_SETTINGS) {
        this.sqlApi = requestSqlApi;

        function requestSqlApi(query, callbackFn) {
            if (query === null) {
                $log.error('SQLApi: query was not provided');
                return false;
            }

            var data = {
                'api_key': CARTODB_SETTINGS.key,
                'q': query
            }

            var params = {
                'external': true,
                'credentials': false
            };

            if (typeof(callbackFn) === 'function') {
                Api(CARTODB_SETTINGS.uri, 'POST', data, params).then((function(result) {
                    if (result.hasOwnProperty('rows') && result.hasOwnProperty('total_rows')) {
                    	callbackFn({
                    		status:200,
                    		message:'Success',
                    		data:result
                    	});
                    }else{
                    	callbackFn({
                    		status:400,
                    		message:'Warning, there was a problem with the response of the cartoDB server',
                    		data:result
                    	});
                    }
                }), function(error) {
                    $log.error('SQLApi: Failed to make request to cartoDB server', error);
                    callbackFn(error);
                });
            } else {
                $log.error('SQLApi: callbackFn is not a valid function');
                return false;
            }
        };
    }

    angular.module('app.cartodb').service('cartoDB', cartoDB);
    cartoDB.$inject = [
        '$log',
        'Api',
        'CARTODB_SETTINGS'
    ];

})();
