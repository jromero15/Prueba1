/*
 * gruops controller here
 *
 */
(function() {
	'use strict';

	function configController($scope, $timeout, $log, Api, Notify, APP_CONFIG, $state) {
		var vm = this;

		vm.listAgencies = [
			{
				id:'1234',
				name:'Andres León',
				description:'Trabajos en Agencia principal',
				dependence:'Gerencia de info'
			},
			{
				id:'1235',
				name:'Javier Torres',
				description:'Agencia de Cali',
				dependence:'Gerencia de telecomunicaciones'
			},
			{
				id:'1236',
				name:'Laura Andrea',
				description:'Trabajos en Agencia',
				dependence:'Gerencia Financiera'
			},
			{
				id:'1237',
				name:'Camilo Romero',
				description:'Trabajos en principal',
				dependence:'Tecnicos'
			},
			{
				id:'1239',
				name:'Juan Pineda',
				description:'Sur norte occidente',
				dependence:'Otros'
			},
			{
				id:'1267',
				name:'Lucas Lucas',
				description:'Norte completo',
				dependence:'Gerencia de telecomunicaciones'
			}
		];

		vm.tableCreate = function(){

			setTimeout(function(){

				$('#agenciesTable').DataTable({
	                "language": {
	                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
	                }
	            });

			},100);


		};

		vm.getAgencies = function() {
            /*Api('client/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:

                        vm.listAgencies = result.data.info;

                        $('#customersTable').DataTable().destroy();

                        setTimeout(function() {

                            $('#customersTable').DataTable({
                                "language": {
                                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                }
                            });

                        }, 100);

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
                        var _msg = 'No tiene permisos para consultar las Agencias.';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    default:
                        console.log("error inesperado. user_get");
                }
            });*/
        };

		vm.main = function() {



			if (sessionStorage.session != undefined) {

				APP_CONFIG.AUTH2_TOKEN = JSON.parse(sessionStorage.user).data.token.access_token;
				vm.tableCreate();

			} else {
				$state.go('app.slogin');
			};
		};

		vm.main();
	} //configController

	angular.module('app.core').controller('configController', configController);
	configController.$inject = [
		'$scope',
		'$timeout',
		'$log',
		'Api',
		'Notify',
		'APP_CONFIG',
		'$state'
	];
})();
