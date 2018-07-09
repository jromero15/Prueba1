/*
 * gruops controller here
 *
 */
(function() {
    'use strict';

    function importController($scope, $timeout, $log, Api, Notify, APP_CONFIG, $state) {
        var vm = this;

        vm.aaaaaa = 'aaa';


        vm.main = function() {
            console.log("siii entrooo")
            if (sessionStorage.session != undefined) {

                APP_CONFIG.AUTH2_TOKEN = JSON.parse(sessionStorage.user).data.token.access_token;

            } else {
                $state.go('app.slogin');
            };
        };
        			
						$('.btn-twitter').on('click', function () {
							$(this).parent().prev().click();
						});

						$('input[type=file]').on('change', function (e) {
							$(this).next().find('input').val($(this).val());
						});

        vm.main();
    } //importController

    angular.module('app.core').controller('importController', importController);
    importController.$inject = [
        '$scope',
        '$timeout',
        '$log',
        'Api',
        'Notify',
        'APP_CONFIG',
        '$state'
    ];
})();