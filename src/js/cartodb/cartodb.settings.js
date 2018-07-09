/*cartoDB settings here*/
(function() {
    'use strict';

    angular.module('app.cartodb').constant('CARTODB_SETTINGS', {
        uri: 'https://awesome-account.cartodb.com/api/v2/sql',
        key: 'awesome-key'
    });
})();
