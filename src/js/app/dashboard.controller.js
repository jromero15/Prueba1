/*
 * dashboard controller here
 *
 */
(function() {
    'use strict';

    function dashController($scope, $log, $state, Api, Notify, APP_CONFIG) {
        var vm = this;

        vm.totalCustomers = 0 ;
		vm.totalUsers = 0;
		vm.totalGroups = 0;


        vm.viewContent = function(option){

        	switch(option){
        		case 'customers':
        			$state.go('app.customers');
        			break;
        		case 'groups':
        			$state.go('app.groups');
        			break;
        		case 'users':
        			$state.go('app.users');
        			break;
        		default:
        			console.log('default...');
        	}

        };

        vm.viewCharts = function(){

        	// Initialize a Line chart in the container with the ID chart1
            new Chartist.Line('#chart1', {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
                series: [
                    [100, 120, 180, 200]
                ]
            });

            // Initialize a Line chart in the container with the ID chart2
            new Chartist.Bar('#chart2', {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
                series: [
                    [5, 4, 3, 7, 5, 10, 3],
                    [3, 2, 9, 5, 4, 6, 4]
                ]
            }, {
                seriesBarDistance: 10,
                reverseData: true,
                horizontalBars: true,
                axisY: {
                    offset: 70
                }
            });


            new Chartist.Pie('#chart3', {
                series: [20, 10, 30, 40]
            }, {
                donut: true,
                donutWidth: 60,
                donutSolid: true,
                startAngle: 270,
                showLabel: true
            });
        };


        vm.getUsers = function() {

            Api('user/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:
                    	vm.totalUsers = result.data.info.length;
                        break;
                    default:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                }
            }), function(error) {
                switch (error) {
                    case 400:
                    case 401:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    default:
                        console.log("error inesperado. user_get");
                }
            });
        };

        vm.getCustomers = function() {
            Api('client/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:

                        vm.totalCustomers = result.data.info.length;

                        break;
                    default:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                }
            }), function(error) {
                switch (error) {
                    case 400:
                    case 401:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    case 403:
                        var _msg = 'No tiene permisos para consultar los Clientes.';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    default:
                        console.log("error inesperado. user_get");
                }
            });
        };

        vm.getGroups = function() {
            Api('group/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:
                        vm.totalGroups = result.data.info.length;
                        break;
                    default:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                }
            }), function(error) {
                switch (error) {
                    case 400:
                    case 401:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    case 403:
                        var _msg = 'No tiene permisos para consultar los Grupos.';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    default:
                        console.log("error inesperado. user_get");
                }
            });
        };


        vm.main = function() {

            if(sessionStorage.session!=undefined){
            	$log.info('dashboard Controller');
		        APP_CONFIG.AUTH2_TOKEN = JSON.parse(sessionStorage.user).data.token.access_token;
		        vm.viewCharts();
		        vm.getUsers();
		        vm.getGroups();
		        vm.getCustomers();
        	}else{
        		$state.go('app.slogin');
        	};

        };

        vm.main();
    }

    angular.module('app.core').controller('dashController', dashController);
    dashController.$inject = [
        '$scope',
        '$log',
        '$state',
        'Api',
        'Notify',
        'APP_CONFIG'
    ];
})();
