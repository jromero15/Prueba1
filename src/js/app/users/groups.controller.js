/*
 * gruops controller here
 *
 */
(function() {
    'use strict';

    function groupsController($scope, $timeout, $log, Api, Notify, APP_CONFIG, $state, Alerts) {
        var vm = this;
        vm.btnSHSave = false;
        vm.btnSHUpdate = false;

        vm.objClear = {
            nombre_grupo: '',
            id_empresa: null,
            description: '',
            ids_users: []
        }

        vm.clearForm = function() {

            vm.obj = {
                nombre_grupo: '',
                id_empresa: null,
                description: '',
                ids_users: []
            };

            angular.forEach(vm.listUsers, function(value, index) {

                document.getElementById("groupsUsersList")[index].checked = false;

            });

        };


        vm.delete = function() {

        	$("#btnDeleteGroup"+vm.deleteGroupId).button('loading');
            Api('group/'+vm.deleteGroupId+'/', 'DELETE').then((function(result) {
                switch (result.status) {
                    case 201:
                    case 203:
                    default:
                        vm.clearForm();
                    	vm.getGroups();
                    	Notify.send("Grupo eliminado con éxito.", {
                            status: 'success',
                            timeout: 5000
                        });
                }
                $("#btnDeleteGroup"+vm.deleteGroupId).button('reset');
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
                $("#btnDeleteGroup"+vm.deleteGroupId).button('reset');
            });
        };

        vm.update = function() {

            console.log("updateeee");

            var sendBool = true;

            for (var i in vm.obj) {
                if (vm.obj[i] == vm.objClear[i]) {
                    sendBool = false;
                    break;
                }
            }

            if (sendBool) {

                $("#updateGroup").button('loading');
	            Api('group/'+vm.updateGroupId+'/', 'PUT', vm.obj).then((function(result) {
	                switch (result.status) {
	                    case 201:
	                    	vm.clearForm();
	                    	vm.getGroups();
	                    	$("#createGroup").modal("hide");
	                    	Notify.send("Grupo actualizado con éxito.", {
	                            status: 'success',
	                            timeout: 5000
	                        });
	                        break;
	                    default:
	                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
	                        Notify.send(_msg, {
	                            status: 'warning',
	                            timeout: 4500
	                        });
	                }
	                $("#updateGroup").button('reset');
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
	                $("#updateGroup").button('reset');
	            });

            } else {
                Notify.send('Por favor valide los datos', {
                    status: 'warning',
                    timeout: 5000
                });
            }

            console.log("sendBool", sendBool);
            console.log("vm.obj", vm.obj);
        };

        vm.save = function() {

            console.log("save");

            var sendBool = true;

            for (var i in vm.obj) {
                if (vm.obj[i] == vm.objClear[i]) {
                    sendBool = false;
                    break;
                }
            }

            if (sendBool) {

                $("#saveGroupNew").button('loading');
	            Api('group/', 'POST', vm.obj).then((function(result) {
	                switch (result.status) {
	                    case 200:
	                    case 201:
	                    	vm.clearForm();
	                    	vm.getGroups();
	                    	Notify.send("Grupo creado con éxito.", {
	                            status: 'success',
	                            timeout: 5000
	                        });
	                        break;
	                    default:
	                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
	                        Notify.send(_msg, {
	                            status: 'warning',
	                            timeout: 4500
	                        });
	                }
	                $("#saveGroupNew").button('reset');
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
	                $("#saveGroupNew").button('reset');
	            });

            } else {
                Notify.send('Por favor valide los datos', {
                    status: 'warning',
                    timeout: 5000
                });
            }

            console.log("sendBool", sendBool);
            console.log("vm.obj", vm.obj);

        };

        vm.optionsChecked = function() {

            vm.userSelect = [];

            angular.forEach(vm.listUsers, function(value, index) {

                var validate = document.getElementById("groupsUsersList")[index].checked;

                if (validate) {
                    vm.userSelect.push(value.id);
                }

            });

            vm.obj.ids_users = vm.userSelect;
        };

        vm.selectAction = function() {

            vm.optionsChecked();
            vm[vm.selectOption]();

        };

        vm.confirm = function(option, groupId) {

            switch (option) {
                case 'save':
                    vm.textConfirmGroup = 'Esta seguro de guardar este Grupo.';
                    break;
                case 'delete':
                    vm.textConfirmGroup = 'Esta seguro de eliminar este Grupo.';
                    vm.deleteGroupId = groupId;
                    break;
                case 'update':
                    vm.textConfirmGroup = 'Esta seguro de actualizar este Grupo.';
                    break;
                default:
                    console.log("error option incorrect users");
            }

            vm.selectOption = option;

            $("#confirmGroup").modal();
        };


        vm.fillFields = function(userId) {

            vm.updateGroupId = userId;

            vm.btnSHSave = false;
            vm.btnSHUpdate = true;
            vm.titleModal = 'Actualizar Usuario';

            angular.forEach(vm.listGroups, function(value, index) {

                if (value.id == vm.updateGroupId) {

                    vm.clearForm();

                    vm.obj = {
                        nombre_grupo: value.nombre_grupo,
                        id_empresa: value.id_empresa,
                        description: value.description
                    };

                    $("#createGroup").modal();

                    angular.forEach(vm.listUsers, function(value2, index2) {

                        angular.forEach(value.usuarios, function(value3, index3) {

                            if (value2.id == value3.id) {
                                document.getElementById("groupsUsersList")[index2].checked = true;
                            }

                        });

                    });

                }

            });
        };

        vm.createGroup = function() {

            vm.btnSHSave = true;
            vm.btnSHUpdate = false;
            vm.titleModal = 'Crear Grupo';
            vm.clearForm();
            $("#createGroup").modal();

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
                        vm.listCompany = [{ id: JSON.parse(sessionStorage.user).data.id_empresa, nombre_empresa: 'Empresa ' + JSON.parse(sessionStorage.user).data.id_empresa }]
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

        vm.getUsers = function() {

            Api('user/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:
                        vm.listUsers = result.data.info;
                        console.log(vm.listUsers)
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

        vm.getGroups = function() {
            Api('group/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:

                        vm.listGroups = result.data.info;


                        angular.forEach(vm.listGroups,function(value,index){

                        	value.cantidadUsuarios = value.usuarios.length;

                        });

                        console.log("vm.listGroups",vm.listGroups)

                        $('#gruopsTable').DataTable().destroy();

                        setTimeout(function() {

                            $('#gruopsTable').DataTable({
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
                    case 404:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron para consultar los grupos.';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 6000
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
                $log.info("loading groupsController");
                APP_CONFIG.AUTH2_TOKEN = JSON.parse(sessionStorage.user).data.token.access_token;
                vm.clearForm();
                vm.getGroups();
                vm.getCompany();
                vm.getUsers();

            } else {
                $state.go('app.slogin');
            };
        };

        vm.main();
    } //groupsController

    angular.module('app.core').controller('groupsController', groupsController);
    groupsController.$inject = [
        '$scope',
        '$timeout',
        '$log',
        'Api',
        'Notify',
        'APP_CONFIG',
        '$state',
        'Alerts'
    ];
})();
