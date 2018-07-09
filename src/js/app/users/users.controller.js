/*
 * gruops controller here
 *
 */
(function() {
    'use strict';

    function usersController($scope, $timeout, $log, Api, Notify, APP_CONFIG, $state) {
        var vm = this;
        vm.dtInstance = {};
        vm.listUsers = [];

        vm.textConfirmUsers = '';
        vm.selectOption = '';
        vm.groupsSelect = [];
        vm.customersSelect = [];
        vm.clearChecks = false;
        vm.btnSHSave = false;
		vm.btnSHUpdate=false;

        vm.objClear = {
            first_name: '',
            last_name: '',
            username: '',
            password: '',
            passConfirm: '',
            email: '',
            telefono: '',
            cedula: '',
            id_empresa: null,
            id_perfil: null,
            ids_grupo: [],
            ids_cliente: []
        };

        vm.clearForm = function() {

            vm.obj = {
                first_name: '',
                last_name: '',
                username: '',
                password: '',
                passConfirm: '',
                email: '',
                telefono: '',
                cedula: '',
                id_empresa: null,
                id_perfil: null,
                ids_grupo: [],
                ids_cliente: []
            };

            if (vm.clearChecks) {

                angular.forEach(vm.listCustomers, function(value, index) {
                    document.getElementById("usersCustomersList")[index].checked = false;
                });

                angular.forEach(vm.listGroups, function(value, index) {
                    document.getElementById("usersGroupsList")[index].checked = false;
                });
            }
        };

        vm.update = function() {

            var sendBool = true;

            for (var i in vm.obj) {
                if (vm.obj[i] == vm.objClear[i]) {
                    sendBool = false;
                    break;
                }
            }

            if (sendBool) {

                if (vm.obj.password == vm.obj.passConfirm) {

                	if(vm.obj.password.length>=8){

                		if(vm.obj.telefono.length>=7){

		                    $("#updateUser").button('loading');

		                    Api('user/'+vm.updateUserId+'/', 'PUT', vm.obj).then((function(result) {
		                        switch (result.status) {
		                            case 200:
		                            case 201:
		                                console.log(result);
		                                Notify.send('Usuario actualizado con éxito.', {
		                                    status: 'success',
		                                    timeout: 5000
		                                });
		                                vm.clearForm();
		                                vm.getUsers();
		                                $("#createUsers").modal('hide');
		                                break;
		                            default:
		                                var _msg = 'Respuesta inesperada. Por favor intente nuevamente. Gracias';
		                                Notify.send(_msg, {
		                                    status: 'warning',
		                                    timeout: 5000
		                                });
		                        }
		                        $("#updateUser").button('reset');
		                    }), function(error) {
		                        switch (error) {
		                            case 400:
		                                var _msg = 'Error. Por favor valide los datos enviados. El usuario y correo deben de ser unicos';
		                                Notify.send(_msg, {
		                                    status: 'warning',
		                                    timeout: 7000
		                                });
		                                break;
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
		                        $("#updateUser").button('reset');
		                    });

		                } else {

		                    Notify.send('El teléfono tiene que ser mínimo de 7 caracteres.', {
		                        status: 'warning',
		                        timeout: 5000
		                    });
		                }

	                } else {

	                    Notify.send('La contraseña tiene que ser mínimo de 8 caracteres.', {
	                        status: 'warning',
	                        timeout: 5000
	                    });
	                }

                } else {
                    Notify.send('Las contraseñas no coinciden.', {
                        status: 'warning',
                        timeout: 5000
                    });
                }

            } else {
                Notify.send('Por favor valide los datos', {
                    status: 'warning',
                    timeout: 5000
                });
            }
        };

        vm.delete = function() {

            $("#btnDeleteUser" + vm.deleteUserId).button('loading');

            Api('user/' + vm.deleteUserId + '/', 'DELETE').then((function(result) {
                Notify.send('Usuario Eliminado con éxito.', {
                    status: 'success',
                    timeout: 5000
                });
                vm.getUsers();
                $("#btnDeleteUser" + vm.deleteUserId).button('reset');
            }), function(error) {
                switch (error) {
                    case 400:
                        var _msg = 'Error. Por favor valide los datos enviados.';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 7000
                        });
                        break;
                    case 404:
                        var _msg = 'No se puede eliminar Usuario, Usuario no encontrado o el usuario a eliminar es un administrador';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 7000
                        });
                        break;
                    default:
                        console.log("error inesperado. user_get");
                }
                $("#btnDeleteUser" + vm.deleteUserId).button('reset');
            });
        };

        vm.save = function() {

            var sendBool = true;

            for (var i in vm.obj) {
                if (vm.obj[i] == vm.objClear[i]) {
                    sendBool = false;
                    break;
                }
            }

            if (sendBool) {

                if (vm.obj.password == vm.obj.passConfirm) {

                	if(vm.obj.password.length>=8){

                		if(vm.obj.telefono.length>=7){

		                    $("#saveUserNew").button('loading');

		                    Api('user/', 'POST', vm.obj).then((function(result) {
		                        switch (result.status) {
		                            case 200:
		                            case 201:
		                                console.log(result);
		                                Notify.send('Usuario creado con éxito.', {
		                                    status: 'success',
		                                    timeout: 5000
		                                });
		                                vm.clearForm();
		                                vm.getUsers();
		                                break;
		                            default:
		                                var _msg = 'Respuesta inesperada. Por favor intente nuevamente. Gracias';
		                                Notify.send(_msg, {
		                                    status: 'warning',
		                                    timeout: 5000
		                                });
		                        }
		                        $("#saveUserNew").button('reset');
		                    }), function(error) {
		                        switch (error) {
		                            case 400:
		                                var _msg = 'Error. Por favor valide los datos enviados. El usuario y correo deben de ser unicos';
		                                Notify.send(_msg, {
		                                    status: 'warning',
		                                    timeout: 7000
		                                });
		                                break;
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
		                        $("#saveUserNew").button('reset');
		                    });

		             	} else {

		                    Notify.send('El teléfono tiene que ser mínimo de 7 caracteres.', {
		                        status: 'warning',
		                        timeout: 5000
		                    });
		                }

	                } else {

	                    Notify.send('La contraseña tiene que ser mínimo de 8 caracteres.', {
	                        status: 'warning',
	                        timeout: 5000
	                    });
	                }

                } else {
                    Notify.send('Las contraseñas no coinciden.', {
                        status: 'warning',
                        timeout: 5000
                    });
                }

            } else {
                Notify.send('Por favor valide los datos', {
                    status: 'warning',
                    timeout: 5000
                });
            }
        };

        vm.createUser = function(){

        	vm.btnSHSave = true;
			vm.btnSHUpdate=false;
			vm.titleModal ='Crear Usuario';
			vm.clearForm();
			$("#createUsers").modal();

        };

        vm.fillFields = function(userId){

        	vm.updateUserId = userId;

        	vm.btnSHSave = false;
			vm.btnSHUpdate=true;
			vm.titleModal ='Actualizar Usuario';

        	angular.forEach(vm.listUsers, function(value, index) {

                if (value.id == vm.updateUserId) {

                	vm.clearForm();

                	vm.obj = {
		                first_name: value.first_name,
		                last_name: value.last_name,
		                username: value.username,
		                password: value.password,
		                email: value.email,
		                telefono: parseInt(value.telefono),
		                cedula: parseInt(value.cedula),
		                id_perfil: value.perfil.id,
		                id_empresa: value.empresa.id
		            };

                    $("#createUsers").modal();

                    angular.forEach(vm.listGroups, function(value2, index2) {

                    	angular.forEach(value.grupos, function(value3,index3){

                    		if(value2.id == value3.id){
                    			document.getElementById("usersGroupsList")[index2].checked = true;
                    			console.log();
                    		}

                    	});

		            });

		            angular.forEach(vm.listCustomers, function(value2, index2) {

                    	angular.forEach(value.clientes, function(value3,index3){

                    		if(value2.id == value3.id){
                    			document.getElementById("usersCustomersList")[index2].checked = true;
                    			console.log();
                    		}

                    	});

		            });

                }

            });
        };

        vm.optionsChecked = function() {

            vm.groupsSelect = [];
            vm.customersSelect = [];

            angular.forEach(vm.listGroups, function(value, index) {

                var validate = document.getElementById("usersGroupsList")[index].checked;

                if (validate) {
                    vm.groupsSelect.push(value.id);
                }

            });

            angular.forEach(vm.listCustomers, function(value, index) {

                var validate = document.getElementById("usersCustomersList")[index].checked;

                if (validate) {
                    vm.customersSelect.push(value.id);
                }

            });

            vm.obj.ids_grupo = vm.groupsSelect;
            vm.obj.ids_cliente = vm.customersSelect;
        };

        vm.selectAction = function() {

            vm.optionsChecked();

            vm[vm.selectOption]();
        };

        vm.confirm = function(option, userId) {

            switch (option) {
                case 'save':
                    vm.textConfirmUsers = 'Esta seguro de guardar este usuario.';
                    break;
                case 'delete':
                    vm.textConfirmUsers = 'Esta seguro de eliminar este usuario.';
                    vm.deleteUserId = userId;
                    break;
                case 'update':
                    vm.textConfirmUsers = 'Esta seguro de actualizar este usuario.';
                    break;
                default:
                    console.log("error option incorrect users");
            }

            vm.selectOption = option;

            $("#confirmUsers").modal();
        };

        vm.getUsers = function() {

            Api('user/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:
                        console.log(result.data.info);

                        $('#usersTable').DataTable().destroy();

                        vm.listUsers = result.data.info;

                        setTimeout(function() {

                            $('#usersTable').DataTable({
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
                    default:
                        console.log("error inesperado. user_get");
                }
            });
        };

        vm.getProfiles = function() {
            Api('profile/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:

                        vm.listProfiles = result.data.info;
                        console.log("vm.listProfiles", vm.listProfiles);

                        /*setTimeout(function() {

                            $('#usersTable').DataTable({
                                "language": {
                                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                }
                            });

                        }, 100);*/

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
                        var _msg = 'No tiene permisos para consultar los Perfiles.';
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

        vm.getCompany = function() {
            Api('company/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:

                        vm.listCompany = result.data.info;
                        console.log("vm.listCompany", vm.listCompany);

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
                    vm.listCompany = [{id:JSON.parse(sessionStorage.user).data.id_empresa,nombre_empresa:'Empresa '+JSON.parse(sessionStorage.user).data.id_empresa}]
                        var _msg = 'No tiene permisos para consultar las empresas.';
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

                        vm.listCustomers = result.data.info;
                        console.log("vm.listCustomers", vm.listCustomers);

                        /*setTimeout(function() {

                            $('#usersTable').DataTable({
                                "language": {
                                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                }
                            });

                        }, 100);*/

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

                        vm.listGroups = result.data.info;
                        console.log("vm.listGroups", vm.listGroups);

                        /*setTimeout(function() {

                            $('#usersTable').DataTable({
                                "language": {
                                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                }
                            });

                        }, 100);*/

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

            if (sessionStorage.session != undefined) {

                APP_CONFIG.AUTH2_TOKEN = JSON.parse(sessionStorage.user).data.token.access_token;

                vm.getUsers();
                vm.getCompany();
                vm.getProfiles();
                vm.getCustomers();
                vm.getGroups();

                vm.clearForm();
                vm.clearChecks = true;

            } else {
                $state.go('app.slogin');
            };
        };

        vm.main();
    } //usersController

    angular.module('app.core').controller('usersController', usersController);
    usersController.$inject = [
        '$scope',
        '$timeout',
        '$log',
        'Api',
        'Notify',
        'APP_CONFIG',
        '$state'
    ];
})();
