/*
 * cartoDb controller here
 *
 */
(function() {
    'use strict';

    function cartoDbController($scope, $log, Notify) {
        var vm = this;

        vm.main = function() {
            Notify.send('cargando cartoDb espere...', {
                status: 'info',
                timeout: 2500
            });
        };

        vm.main();
    } //cartoDbController

    angular.module('app.cartodb').controller('cartoDbController', cartoDbController);
    cartoDbController.$inject = [
        '$scope',
        '$log',
        'Notify'
    ];

})();
