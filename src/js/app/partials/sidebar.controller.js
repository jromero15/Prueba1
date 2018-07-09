/*
 * sidebar controller here
 *
 */
(function() {
    'use strict';

    function sideBarController($scope, $log, $state, ngUtils, Notify, Api, APP_CONFIG) {
        var vm = this;


        function clearForm(){

        	vm.passOld = '';
			vm.passNew = '';
			vm.passNew2 = '';

        };

        vm.changePassword = function() {

            if (vm.passOld != '' && vm.passNew != '' && vm.passNew2 != '') {

	            if (vm.passNew == vm.passNew2) {

	            	var obj = {
						new_password:vm.passNew2,
						old_password:vm.passOld
					}


        			$("#changePassword").button('loading');
	            	Api('user/pass/', 'POST', obj).then((function(result) {
                        switch (result.status) {
                            case 200:
                            case 201:
                                Notify.send('Contraseña actualizada con éxito.', {
                                    status: 'success',
                                    timeout: 5000
                                });
                                clearForm();
                                break;
                            default:
                                var _msg = 'Respuesta inesperada. Por favor intente nuevamente. Gracias';
                                Notify.send(_msg, {
                                    status: 'warning',
                                    timeout: 5000
                                });
                        }
                        $("#changePassword").button('reset');
                    }), function(error) {
                        switch (error) {
                            case 401:
                                var _msg = 'La contraseña actual no coincide.';
                                Notify.send(_msg, {
                                    status: 'warning',
                                    timeout: 4500
                                });
                                break;
                            default:
                                console.log("error inesperado. user_get");
                        }
                        $("#changePassword").button('reset');
                    });


	            } else {
	                Notify.send('Las contraseñas nuevas no coincide.', {
	                    status: 'warning',
	                    timeout: 5000
	                });
	            }


            } else {
                Notify.send('Por favor valide los datos.', {
                    status: 'info',
                    timeout: 5000
                });
            }
        };

        function logout(){

        	var campos = {};
        	campos.user = JSON.parse(sessionStorage.user).data.cedula;

        		Api('user/Logout/', 'POST', campos).then((function(result) {
	                $log.log('Api.post login', result);

	                switch (result.status) {
	                    case 200:
	                    	delete sessionStorage.session;
	                    	delete sessionStorage.user;
	                        $state.go('app.slogin');
	                        break;
	                    default:
                            Notify.send('Ocurrio un error por favor intente nuevamente.', {
                                status: 'warning',
                                timeout: 4500
                            });

	                }
	            }), function(error) {

	            	switch(error){
	            		case 400:
	            		case 401:
	            			Notify.send("Ocurrio un error por favor intente nuevamente.", {
                                status: 'warning',
                                timeout: 4500
                            });
	            			break;
	            		default:
	                		$log.error('Ocurrio un error por favor intente nuevamente.', error);
	            	}

	            });

        }

        vm.viewContent = function(option) {

            switch (option) {
                case 'groups':
                    $state.go('app.groups');
                    vm.hideSidebar();
                    break;
                case 'customers':
                    $state.go('app.customers');
                    vm.hideSidebar();
                    break;
                case 'users':
                    $state.go('app.users');
                    vm.hideSidebar();
                    break;
                case 'map':
                    $state.go('app.basemap');
                    vm.hideSidebar();
                    break;
                case 'logout':
                	localStorage.removeItem('session');
                    vm.hideSidebar();
                    logout();
                    break;
                case 'dashboard':
                    vm.hideSidebar();
                    $state.go('app.dashboard');
                    break;
                case 'calendar':
                    vm.hideSidebar();
                    $state.go('app.usersCalendar');
                    break;
                default:
                    console.log("default");

            }

        };

        vm.hideSidebar = function() {
            ngUtils.sideBar('hide');
        }


        vm.main = function() {
            $log.info('sidebar Controller');
            vm.hideSidebar();
            clearForm();
        };

        vm.main();
    }

    angular.module('app.core').controller('sideBarController', sideBarController);
    sideBarController.$inject = [
        '$scope',
        '$log',
        '$state',
        'ngUtils',
        'Notify',
        'Api',
        'APP_CONFIG'
    ];
})();
